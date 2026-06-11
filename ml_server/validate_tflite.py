import tensorflow as tf
import numpy as np
import json
from pathlib import Path

TFLITE_PATH = "model.tflite"
KERAS_PATH  = "model.h5"
TEST_DIR    = "test"          # adjusted to your test split path
N_SAMPLES   = 50
IMG_SIZE    = (300, 300)

# Load models
print("Loading Keras model...")
keras_model = tf.keras.models.load_model(KERAS_PATH)

print("Loading TFLite model...")
interp = tf.lite.Interpreter(model_path=TFLITE_PATH)
interp.allocate_tensors()
inp = interp.get_input_details()[0]
out = interp.get_output_details()[0]

with open("class_labels.json") as f:
    labels = json.load(f)

def preprocess(path):
    img = tf.keras.utils.load_img(path, target_size=IMG_SIZE)
    arr = tf.keras.utils.img_to_array(img)
    return np.expand_dims(arr, 0).astype(np.float32)

# INT8 models expect uint8 input
def preprocess_int8(path):
    img = tf.keras.utils.load_img(path, target_size=IMG_SIZE)
    arr = tf.keras.utils.img_to_array(img)
    return np.expand_dims(arr, 0).astype(np.uint8)

match = 0
for i, p in enumerate(Path(TEST_DIR).rglob("*.jpg")):
    if i >= N_SAMPLES:
        break
    
    keras_pred  = np.argmax(keras_model.predict(preprocess(p), verbose=0))
    tflite_input = preprocess_int8(p) if inp["dtype"] == np.uint8 else preprocess(p)
    interp.set_tensor(inp["index"], tflite_input)
    interp.invoke()
    tflite_pred = np.argmax(interp.get_tensor(out["index"]))
    
    if keras_pred == tflite_pred:
        match += 1

print(f"Agreement: {match}/{N_SAMPLES} ({match/N_SAMPLES*100:.1f}%)")
print("Expected: >95% agreement for INT8 quantized EfficientNet-B0")
