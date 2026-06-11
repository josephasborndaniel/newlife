"""Backward-compatible entry point — prefer: uvicorn analyzer:app --port 8000"""
from analyzer import app  # noqa: F401

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("analyzer:app", host="0.0.0.0", port=8000, reload=True)
