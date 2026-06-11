import os
import json
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.applications.efficientnet import preprocess_input

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.h5")
TRAIN_DIR = os.path.join(BASE_DIR, "train")

print("Loading Keras model...")
model = keras.models.load_model(MODEL_PATH, compile=False)

print("Loading calibration data...")
train_ds = keras.utils.image_dataset_from_directory(
    TRAIN_DIR,
    image_size=(224, 224),
    batch_size=32,
    shuffle=True,
    seed=42,
)

# 1. Full-precision export first (for validation baseline)
print("Converting to FP32 TFLite...")
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()
with open(os.path.join(BASE_DIR, "model_fp32.tflite"), "wb") as f:
    f.write(tflite_model)
print("Exported model_fp32.tflite")

# 2. INT8 post-training quantization
print("Converting to INT8 Quantized TFLite (running calibration)...")
def representative_dataset():
    """Use 200 images from the training set as calibration data."""
    count = 0
    for images, _ in train_ds.take(7):          # ~200 imgs at batch_size=32
        for img in images:
            preprocessed_img = preprocess_input(img.numpy())
            yield [np.expand_dims(preprocessed_img, axis=0).astype(np.float32)]
            count += 1
            if count >= 200:
                return

converter_int8 = tf.lite.TFLiteConverter.from_keras_model(model)
converter_int8.optimizations = [tf.lite.Optimize.DEFAULT]
converter_int8.representative_dataset = representative_dataset
converter_int8.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
converter_int8.inference_input_type  = tf.uint8
converter_int8.inference_output_type = tf.uint8

tflite_int8 = converter_int8.convert()
with open(os.path.join(BASE_DIR, "model.tflite"), "wb") as f:
    f.write(tflite_int8)
print(f"Exported model.tflite (INT8) - size: {len(tflite_int8)/1024/1024:.1f} MB")

# 3. Export class labels
class_names = train_ds.class_names
with open(os.path.join(BASE_DIR, "class_labels.json"), "w") as f:
    json.dump({str(i): name for i, name in enumerate(class_names)}, f, indent=2)
print("Exported class_labels.json")
