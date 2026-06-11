import os
import json
import numpy as np
import tensorflow as tf
from tensorflow import keras
from sklearn.metrics import classification_report, confusion_matrix
from tensorflow.keras.applications.efficientnet import preprocess_input

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.h5")
TEST_DIR = os.path.join(BASE_DIR, "test")
CLASS_MAP_PATH = os.path.join(BASE_DIR, "class_map.json")
IMG_SIZE = 224
BATCH_SIZE = 32

def main():
    if not os.path.exists(MODEL_PATH):
        print(f"Error: Model not found at {MODEL_PATH}")
        return
        
    if not os.path.exists(CLASS_MAP_PATH):
        print(f"Error: Class map not found at {CLASS_MAP_PATH}")
        return
        
    with open(CLASS_MAP_PATH, "r", encoding="utf-8") as f:
        class_map = json.load(f)
    classes = class_map["classes"]
    
    print("Loading model...")
    model = keras.models.load_model(MODEL_PATH, compile=False)
    
    print("Loading full test dataset...")
    val_ds = keras.utils.image_dataset_from_directory(
        TEST_DIR,
        labels="inferred",
        label_mode="int",
        class_names=classes,
        image_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        shuffle=False,
    )
    
    # Preprocess
    val_ds = val_ds.map(lambda x, y: (preprocess_input(x), y))
    
    print("Evaluating model on the entire test dataset (this might take a minute)...")
    y_true, y_pred = [], []
    for images, labels in val_ds:
        probs = model.predict(images, verbose=0)
        y_pred.extend(np.argmax(probs, axis=1).tolist())
        y_true.extend(labels.numpy().tolist())
        
    print("\n================ Classification Report ================")
    report = classification_report(
        y_true, y_pred, target_names=classes, zero_division=0
    )
    print(report)
    
    # Print summary metrics
    report_dict = classification_report(
        y_true, y_pred, target_names=classes, output_dict=True, zero_division=0
    )
    print("================ Summary Metrics ================")
    print(f"Overall Accuracy: {report_dict['accuracy'] * 100:.2f}%")
    print(f"Macro Avg Precision: {report_dict['macro avg']['precision'] * 100:.2f}%")
    print(f"Macro Avg Recall: {report_dict['macro avg']['recall'] * 100:.2f}%")
    print(f"Macro Avg F1-Score: {report_dict['macro avg']['f1-score'] * 100:.2f}%")
    
if __name__ == "__main__":
    main()
