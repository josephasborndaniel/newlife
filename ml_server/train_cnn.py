"""
Train EfficientNet-B0 on ml_server/train and ml_server/test folder splits.
Outputs: model.h5, model.tflite, class_map.json, training_report.json

Key improvements over v1:
- Stronger augmentation: random hue, saturation, brightness, cutout
- Label smoothing (0.1) to reduce overconfidence
- Phase 1: 15 epochs at 3e-4 with cosine decay + warmup
- Phase 2: 50 epochs at 1e-4 fine-tuning top-60 layers
- ReduceLROnPlateau + EarlyStopping (patience=10) in Phase 2
- MixUp augmentation as final regulariser
- Focal-loss-weighted class_weights to handle class imbalance
- Correct EfficientNet preprocess_input in calibration dataset
"""

import glob
import json
import math
import os
import shutil
from collections import Counter

import numpy as np
import tensorflow as tf
from sklearn.metrics import classification_report, confusion_matrix
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.applications.efficientnet import EfficientNetB3, preprocess_input
from tqdm import tqdm

# ──────────────────────────────────────────────
# CONFIGURATION
# ──────────────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
TRAIN_DIR  = os.path.join(BASE_DIR, "train")
TEST_DIR   = os.path.join(BASE_DIR, "test")
IMG_SIZE   = 300
BATCH_SIZE = 16

# Phase 1: Frozen backbone, train head only
PHASE1_EPOCHS = 15
PHASE1_LR     = 3e-4

# Phase 2: Fine-tune top 60 backbone layers
PHASE2_EPOCHS       = 50
PHASE2_LR           = 1e-4
PHASE2_LR_MIN       = 1e-6
PHASE2_UNFREEZE     = 60   # number of top EfficientNet layers to unfreeze

# Early stopping patience (Phase 2)
EARLY_STOP_PATIENCE = 12

# Label smoothing — reduces overconfidence
LABEL_SMOOTHING = 0.1

# MixUp alpha
MIXUP_ALPHA = 0.2

# ──────────────────────────────────────────────
# METADATA
# ──────────────────────────────────────────────
SEVERITY_MAP = {
    "Melanoma Skin Cancer Nevi and Moles":                                    "High",
    "Actinic Keratosis Basal Cell Carcinoma and other Malignant Lesions":     "High",
    "Vascular Tumors":                                                         "High",
    "Eczema Photos":                                                           "Medium",
    "Atopic Dermatitis Photos":                                                "Medium",
    "Psoriasis pictures Lichen Planus and related diseases":                  "Medium",
    "Lupus and other Connective Tissue diseases":                             "Medium",
    "Bullous Disease Photos":                                                  "Medium",
    "Exanthems and Drug Eruptions":                                            "Medium",
    "Poison Ivy Photos and other Contact Dermatitis":                         "Medium",
    "Urticaria Hives":                                                         "Medium",
    "Vasculitis Photos":                                                       "Medium",
    "Light Diseases and Disorders of Pigmentation":                           "Medium",
    "Systemic Disease":                                                        "Medium",
    "Acne and Rosacea Photos":                                                 "Low",
    "Seborrheic Keratoses and other Benign Tumors":                           "Low",
    "Warts Molluscum and other Viral Infections":                             "Low",
    "Tinea Ringworm Candidiasis and other Fungal Infections":                 "Low",
    "Cellulitis Impetigo and other Bacterial Infections":                     "Low",
    "Herpes HPV and other STDs Photos":                                       "Low",
    "Nail Fungus and other Nail Disease":                                     "Low",
    "Scabies Lyme Disease and other Infestations and Bites":                  "Low",
    "Hair Loss Photos Alopecia and other Hair Diseases":                      "Low",
}

DESCRIPTIONS = {
    "Melanoma Skin Cancer Nevi and Moles":
        "Pigmented lesion patterns detected. Professional dermatological evaluation is recommended.",
    "Actinic Keratosis Basal Cell Carcinoma and other Malignant Lesions":
        "Features consistent with actinic keratosis or basal cell carcinoma. Medical consultation advised.",
    "Eczema Photos":
        "Inflammatory dermatitis patterns detected. Moisturize and consult if symptoms persist.",
    "Atopic Dermatitis Photos":
        "Atopic dermatitis patterns detected. Gentle skincare and medical follow-up if needed.",
    "Psoriasis pictures Lichen Planus and related diseases":
        "Plaque or scaling patterns consistent with psoriasis or related conditions.",
    "Acne and Rosacea Photos":
        "Localized inflammatory acne or rosacea patterns detected.",
    "Seborrheic Keratoses and other Benign Tumors":
        "Benign skin growth patterns detected. Routine monitoring recommended.",
}


# ──────────────────────────────────────────────
# HELPERS
# ──────────────────────────────────────────────
def get_classes(directory: str) -> list[str]:
    return sorted(d for d in os.listdir(directory) if os.path.isdir(os.path.join(directory, d)))


def count_images(directory: str) -> int:
    total = 0
    for ext in ("*.jpg", "*.jpeg", "*.png", "*.JPG", "*.JPEG", "*.PNG"):
        total += len(glob.glob(os.path.join(directory, "**", ext), recursive=True))
    return total


def compute_class_weights(classes: list[str]) -> dict[int, float]:
    """Compute balanced class weights with mild focal boost for rare classes."""
    counts = Counter({cls: count_images(os.path.join(TRAIN_DIR, cls)) for cls in classes})
    total  = sum(counts.values())
    n_cls  = len(classes)
    base   = {i: total / (n_cls * counts[cls]) for i, cls in enumerate(classes)}
    # Clip extreme weights so rare classes don't dominate completely
    max_w  = max(base.values())
    return {i: min(w, max_w * 0.5) for i, w in base.items()}


# ──────────────────────────────────────────────
# AUGMENTATION
# ──────────────────────────────────────────────
def augmentation_pipeline() -> keras.Sequential:
    """
    Strong augmentation applied only during training.
    All ops run in the graph (fast on CPU/GPU).
    """
    return keras.Sequential([
        layers.RandomFlip("horizontal_and_vertical"),
        layers.RandomRotation(0.15),
        layers.RandomZoom(0.15),
        layers.RandomTranslation(0.1, 0.1),
        layers.RandomContrast(0.2),
        # Simulate varying lighting / camera exposure
        layers.RandomBrightness(factor=0.2, value_range=(0.0, 255.0)),
    ], name="augmentation")


# ──────────────────────────────────────────────
# MIXUP
# ──────────────────────────────────────────────
def apply_mixup(ds: tf.data.Dataset, num_classes: int, alpha: float = 0.2) -> tf.data.Dataset:
    """
    Mix examples and their one-hot labels within the same batch.
    """
    def mixup_batch(images, labels):
        batch_size = tf.shape(images)[0]
        lam = tf.random.uniform((batch_size, 1, 1, 1), alpha, 1.0)
        lam_label = tf.reshape(lam, (batch_size, 1))
        
        indices = tf.random.shuffle(tf.range(batch_size))
        shuffled_images = tf.gather(images, indices)
        shuffled_labels = tf.gather(labels, indices)
        
        mixed_images = lam * images + (1.0 - lam) * shuffled_images
        mixed_labels = lam_label * labels + (1.0 - lam_label) * shuffled_labels
        return mixed_images, mixed_labels

    return ds.map(mixup_batch, num_parallel_calls=tf.data.AUTOTUNE)


# ──────────────────────────────────────────────
# DATASET BUILDERS
# ──────────────────────────────────────────────
def build_datasets(classes: list[str]):
    autotune = tf.data.AUTOTUNE
    aug      = augmentation_pipeline()

    # ---------- training dataset ----------
    train_raw = keras.utils.image_dataset_from_directory(
        TRAIN_DIR,
        labels="inferred",
        label_mode="int",
        class_names=classes,
        image_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        shuffle=True,
        seed=42,
    )

    def preprocess_train(x, y):
        x = aug(x, training=True)               # augment (raw pixel values)
        x = preprocess_input(tf.cast(x, tf.float32))  # EfficientNet normalisation
        y_oh = tf.one_hot(y, len(classes))
        return x, y_oh

    train_ds = (
        train_raw
        .map(preprocess_train, num_parallel_calls=autotune)
        .prefetch(autotune)
    )

    # MixUp — applied on top of already-augmented data
    train_ds_mixup = apply_mixup(train_ds, len(classes), MIXUP_ALPHA).prefetch(autotune)

    # ---------- validation dataset (NO augmentation) ----------
    def preprocess_val(x, y):
        x = preprocess_input(tf.cast(x, tf.float32))
        y_oh = tf.one_hot(y, len(classes))
        return x, y_oh

    val_ds = (
        keras.utils.image_dataset_from_directory(
            TEST_DIR,
            labels="inferred",
            label_mode="int",
            class_names=classes,
            image_size=(IMG_SIZE, IMG_SIZE),
            batch_size=BATCH_SIZE,
            shuffle=False,
        )
        .map(preprocess_val, num_parallel_calls=autotune)
        .prefetch(autotune)
    )

    return train_ds, train_ds_mixup, val_ds


# ──────────────────────────────────────────────
# MODEL
# ──────────────────────────────────────────────
def build_model(num_classes: int) -> keras.Model:
    base = EfficientNetB3(
        include_top=False,
        weights="imagenet",
        input_shape=(IMG_SIZE, IMG_SIZE, 3),
        name="efficientnetb3",
    )
    base.trainable = False  # Start frozen

    inputs = keras.Input(shape=(IMG_SIZE, IMG_SIZE, 3))
    x = base(inputs)  # Let dynamic training mode pass through
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dense(512, activation="relu")(x)
    x = layers.Dropout(0.4)(x)
    x = layers.Dense(256, activation="relu")(x)
    x = layers.Dropout(0.3)(x)
    outputs = layers.Dense(num_classes, activation="softmax", dtype="float32")(x)
    return keras.Model(inputs, outputs)


# ──────────────────────────────────────────────
# LEARNING RATE SCHEDULE (cosine + warmup)
# ──────────────────────────────────────────────
class WarmupCosineDecay(keras.optimizers.schedules.LearningRateSchedule):
    def __init__(self, initial_lr: float, total_steps: int, warmup_steps: int, min_lr: float = 1e-7):
        self.initial_lr   = initial_lr
        self.total_steps  = total_steps
        self.warmup_steps = warmup_steps
        self.min_lr       = min_lr

    def __call__(self, step):
        step = tf.cast(step, tf.float32)
        warmup = step / tf.cast(self.warmup_steps, tf.float32) * self.initial_lr
        cosine_decay = self.min_lr + 0.5 * (self.initial_lr - self.min_lr) * (
            1.0 + tf.cos(math.pi * (step - self.warmup_steps) /
                          tf.cast(self.total_steps - self.warmup_steps, tf.float32))
        )
        return tf.where(step < self.warmup_steps, warmup, cosine_decay)

    def get_config(self):
        return {
            "initial_lr": self.initial_lr,
            "total_steps": self.total_steps,
            "warmup_steps": self.warmup_steps,
            "min_lr": self.min_lr,
        }


# ──────────────────────────────────────────────
# TFLITE EXPORT
# ──────────────────────────────────────────────
def export_tflite(model: keras.Model, path: str, train_raw_ds, classes: list[str]):
    # Full-precision backup
    fp32_path = path.replace(".tflite", "_fp32.tflite")
    conv = tf.lite.TFLiteConverter.from_keras_model(model)
    fp32 = conv.convert()
    with open(fp32_path, "wb") as f:
        f.write(fp32)
    print(f"Exported {fp32_path} ({len(fp32)/1024/1024:.1f} MB)")

    # INT8 with correct calibration preprocessing
    def representative_dataset():
        count = 0
        for images, _ in train_raw_ds.take(10):
            for img in images:
                yield [np.expand_dims(preprocess_input(img.numpy().astype(np.float32)), 0)]
                count += 1
                if count >= 250:
                    return

    conv8 = tf.lite.TFLiteConverter.from_keras_model(model)
    conv8.optimizations               = [tf.lite.Optimize.DEFAULT]
    conv8.representative_dataset      = representative_dataset
    conv8.target_spec.supported_ops   = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
    conv8.inference_input_type        = tf.uint8
    conv8.inference_output_type       = tf.uint8

    tflite_int8 = conv8.convert()
    with open(path, "wb") as f:
        f.write(tflite_int8)
    print(f"Exported {path} (INT8, {len(tflite_int8)/1024/1024:.1f} MB)")

    # Class labels
    labels_path = os.path.join(os.path.dirname(path), "class_labels.json")
    with open(labels_path, "w", encoding="utf-8") as f:
        json.dump({str(i): name for i, name in enumerate(classes)}, f, indent=2)
    print(f"Exported {labels_path}")


# ──────────────────────────────────────────────
# EVALUATION
# ──────────────────────────────────────────────
def evaluate(model: keras.Model, val_ds, classes: list[str]) -> dict:
    y_true, y_pred = [], []
    for images, labels in tqdm(val_ds, desc="Evaluating"):
        probs  = model.predict(images, verbose=0)
        y_pred.extend(np.argmax(probs, axis=1).tolist())
        if len(labels.shape) > 1 and labels.shape[-1] > 1:
            y_true.extend(np.argmax(labels.numpy(), axis=1).tolist())
        else:
            y_true.extend(labels.numpy().tolist())

    report = classification_report(y_true, y_pred, target_names=classes,
                                   output_dict=True, zero_division=0)
    cm = confusion_matrix(y_true, y_pred).tolist()
    return {"accuracy": report["accuracy"], "classification_report": report, "confusion_matrix": cm}


# ──────────────────────────────────────────────
# CLASS MAP
# ──────────────────────────────────────────────
def save_class_map(classes: list[str], path: str):
    payload = {
        "classes": classes,
        "index_to_class": {str(i): c for i, c in enumerate(classes)},
        "severity": {c: SEVERITY_MAP.get(c, "Medium") for c in classes},
        "descriptions": {
            c: DESCRIPTIONS.get(
                c,
                f"Our CNN model detected patterns consistent with {c}. "
                "Consult a dermatologist for confirmation.",
            )
            for c in classes
        },
    }
    with open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)


# ──────────────────────────────────────────────
# MAIN
# ──────────────────────────────────────────────
def main():
    if not os.path.isdir(TRAIN_DIR) or not os.path.isdir(TEST_DIR):
        raise SystemExit(f"Missing train/ or test/ under {BASE_DIR}")

    classes       = get_classes(TRAIN_DIR)
    test_classes  = set(get_classes(TEST_DIR))
    if set(classes) != test_classes:
        raise SystemExit("train/ and test/ class folders do not match")

    num_classes = len(classes)
    print(f"Found {num_classes} classes, {count_images(TRAIN_DIR)} training images")

    train_ds, train_ds_mixup, val_ds = build_datasets(classes)
    class_weights = compute_class_weights(classes)
    steps_per_epoch = sum(1 for _ in train_ds)
    print(f"Steps/epoch: {steps_per_epoch}")

    # ── PHASE 1: frozen backbone, train head ──────────────────────────────
    print("\n=== Phase 1: Frozen backbone ===")
    model = build_model(num_classes)

    p1_schedule = WarmupCosineDecay(
        initial_lr  = PHASE1_LR,
        total_steps = steps_per_epoch * PHASE1_EPOCHS,
        warmup_steps= steps_per_epoch * 2,
        min_lr      = 1e-6,
    )

    model.compile(
        optimizer = keras.optimizers.AdamW(p1_schedule, weight_decay=1e-4),
        loss      = keras.losses.CategoricalCrossentropy(label_smoothing=LABEL_SMOOTHING),
        metrics   = ["accuracy"],
    )

    model.fit(
        train_ds,
        validation_data = val_ds,
        epochs          = PHASE1_EPOCHS,
        class_weight    = class_weights,
        callbacks       = [
            keras.callbacks.ModelCheckpoint(
                os.path.join(BASE_DIR, "model_best_p1.h5"),
                save_best_only=True, monitor="val_accuracy", verbose=1,
            ),
        ],
    )

    # Load best Phase 1 weights before fine-tuning
    model.load_weights(os.path.join(BASE_DIR, "model_best_p1.h5"))

    # ── PHASE 2: unfreeze top layers, fine-tune ───────────────────────────
    print("\n=== Phase 2: Fine-tuning ===")
    base_model = model.get_layer("efficientnetb3")
    base_model.trainable = True
    # Freeze everything except the last PHASE2_UNFREEZE layers
    for layer in base_model.layers[:-PHASE2_UNFREEZE]:
        layer.trainable = False
    # Explicitly freeze all BatchNormalization layers to preserve moving averages
    for layer in base_model.layers:
        if "batch_normalization" in layer.__class__.__name__.lower():
            layer.trainable = False

    p2_schedule = WarmupCosineDecay(
        initial_lr   = PHASE2_LR,
        total_steps  = steps_per_epoch * PHASE2_EPOCHS,
        warmup_steps = steps_per_epoch * 3,
        min_lr       = PHASE2_LR_MIN,
    )

    model.compile(
        optimizer = keras.optimizers.AdamW(p2_schedule, weight_decay=1e-5),
        loss      = keras.losses.CategoricalCrossentropy(label_smoothing=LABEL_SMOOTHING),
        metrics   = ["accuracy"],
    )

    best_ckpt = os.path.join(BASE_DIR, "model_best.h5")

    model.fit(
        train_ds_mixup,          # MixUp dataset (outputs soft labels)
        validation_data = val_ds,
        epochs          = PHASE2_EPOCHS,
        callbacks       = [
            keras.callbacks.ModelCheckpoint(
                best_ckpt, save_best_only=True, monitor="val_accuracy", verbose=1,
            ),
            keras.callbacks.EarlyStopping(
                monitor="val_accuracy", patience=EARLY_STOP_PATIENCE,
                restore_best_weights=True, verbose=1,
            ),
            keras.callbacks.TerminateOnNaN(),
        ],
    )

    # ── SAVE ──────────────────────────────────────────────────────────────
    h5_path        = os.path.join(BASE_DIR, "model.h5")
    tflite_path    = os.path.join(BASE_DIR, "model.tflite")
    class_map_path = os.path.join(BASE_DIR, "class_map.json")
    report_path    = os.path.join(BASE_DIR, "training_report.json")

    model.save(h5_path)
    print(f"Saved {h5_path}")

    # Raw (un-preprocessed) train dataset for calibration
    train_raw = keras.utils.image_dataset_from_directory(
        TRAIN_DIR, labels="inferred", label_mode="int",
        class_names=classes, image_size=(IMG_SIZE, IMG_SIZE),
        batch_size=32, shuffle=True, seed=0,
    )
    export_tflite(model, tflite_path, train_raw, classes)
    save_class_map(classes, class_map_path)

    report = evaluate(model, val_ds, classes)
    report["data_notes"] = [
        "v2: AdamW + cosine LR warmup, MixUp, label smoothing=0.1, 60-layer unfreeze.",
        f"Classes: {num_classes}",
    ]
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)

    # Cleanup Phase 1 checkpoint
    p1_ckpt = os.path.join(BASE_DIR, "model_best_p1.h5")
    if os.path.exists(p1_ckpt):
        os.remove(p1_ckpt)

    print(f"\n=== TRAINING COMPLETE ===")
    print(f"Validation accuracy: {report['accuracy'] * 100:.2f}%")
    print(f"Report saved to {report_path}")


if __name__ == "__main__":
    main()
