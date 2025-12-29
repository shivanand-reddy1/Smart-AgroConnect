from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import os
import json
from PIL import Image

app = Flask(__name__)
CORS(app)

# ---------- PATHS ----------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "static", "model", "plant_disease_model.keras")
CLASSES_PATH = os.path.join(BASE_DIR, "static", "model", "classes.json")

# ---------- LOAD MODEL ----------
model = tf.keras.models.load_model(MODEL_PATH)

with open(CLASSES_PATH, "r", encoding="utf-8") as f:
    CLASS_NAMES = json.load(f)

print("✅ Model & classes loaded")

# ---------- IMAGE PREPROCESS ----------
def preprocess_image(image_path):
    img = Image.open(image_path).convert("RGB")
    img = img.resize((128, 128))

    img_array = np.array(img, dtype=np.float32)
    img_array /= 255.0  # normalize
    img_array = np.expand_dims(img_array, axis=0)

    return img_array


@app.route("/api/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({
            "disease": "Unknown",
            "confidence": 0,
            "confidence_score": 0
        })

    file = request.files["image"]

    upload_dir = os.path.join(BASE_DIR, "uploads")
    os.makedirs(upload_dir, exist_ok=True)

    image_path = os.path.join(upload_dir, file.filename)
    file.save(image_path)

    try:
        img_array = preprocess_image(image_path)
        preds = model.predict(img_array, verbose=0)

        if preds is None or np.isnan(preds).any():
            raise ValueError("NaN prediction")

        probs = preds[0]
        top_index = int(np.argmax(probs))

        disease_name = CLASS_NAMES[top_index]

        # 🔒 ABSOLUTE SAFETY
        raw_score = float(probs[top_index]) * 100
        confidence_score = int(max(0, min(100, round(raw_score))))

        return jsonify({
            # 🔥 SEND ALL POSSIBLE KEYS (frontend-safe)
            "disease": disease_name,
            "disease_name": disease_name,
            "confidence": confidence_score,        # number
            "confidence_score": confidence_score,  # number
            "confidence_percent": confidence_score # number
        })

    except Exception as e:
        return jsonify({
            "disease": "Unknown",
            "disease_name": "Unknown",
            "confidence": 0,
            "confidence_score": 0,
            "confidence_percent": 0,
            "error": str(e)
        })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
