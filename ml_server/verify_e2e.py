"""End-to-end ML verification script. Run after train_cnn.py completes."""
import base64
import glob
import io
import json
import os
import sys
import urllib.request

import numpy as np
from PIL import Image

BASE = os.path.dirname(os.path.abspath(__file__))
HEALTH_URL = "http://localhost:8000/health"
ANALYZE_URL = "http://localhost:8000/analyze"


def find_sample_image() -> str:
    for folder in ["test", "train"]:
        pattern = os.path.join(BASE, folder, "**", "*.jpg")
        matches = glob.glob(pattern, recursive=True)
        if matches:
            return matches[0]
    raise FileNotFoundError("No sample images found under train/ or test/")


def post_json(url: str, payload: dict) -> dict:
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url, data=data, headers={"Content-Type": "application/json"}, method="POST"
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8"))


def get_json(url: str) -> dict:
    with urllib.request.urlopen(url, timeout=10) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main():
    if not os.path.exists(os.path.join(BASE, "model.h5")):
        print("FAIL: model.h5 not found. Run: python train_cnn.py")
        sys.exit(1)

    health = get_json(HEALTH_URL)
    print("Health:", json.dumps(health, indent=2))

    if not health.get("clfLoaded"):
        print("FAIL: clfLoaded is false")
        sys.exit(1)

    if health.get("backend") != "efficientnet-b3":
        print("FAIL: unexpected backend", health.get("backend"))
        sys.exit(1)

    sample = find_sample_image()
    img = Image.open(sample).convert("RGB").resize((300, 300))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    b64 = base64.b64encode(buf.getvalue()).decode("utf-8")

    result = post_json(ANALYZE_URL, {"image": b64})
    print("Analyze:", json.dumps(result, indent=2))

    if not result.get("used_ml"):
        print("FAIL: used_ml is not true")
        sys.exit(1)

    if result.get("backend") != "efficientnet-b3":
        print("FAIL: analyze backend mismatch")
        sys.exit(1)

    if result.get("confidence", 0) < 20:
        print("WARN: confidence below 20% on sample image")

    print("PASS: end-to-end ML verification succeeded")
    sys.exit(0)


if __name__ == "__main__":
    main()
