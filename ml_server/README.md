# SkinScan AI — ML Server (EfficientNet-B0)

## Setup

```bash
cd ml_server
python -m pip install -r requirements.txt
```

## Train

```bash
python train_cnn.py
```

Uses `train/` and `test/` folder splits (~15.5k images, 23 classes).  
Outputs: `model.h5`, `model.tflite`, `class_map.json`, `training_report.json`

Training time: ~2–4 hours on CPU, ~20–40 min on GPU (use WSL2/Linux for CUDA).

## Run

```bash
uvicorn analyzer:app --port 8000 --reload
```

Health check:

```bash
curl http://localhost:8000/health
```

## Data layout

```
ml_server/
  train/<class_name>/*.jpg
  test/<class_name>/*.jpg
```
