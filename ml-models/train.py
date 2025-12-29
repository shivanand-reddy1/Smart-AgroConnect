# ================================
# train.py (JPEG-SAFE VERSION)
# ================================

import os
import json
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

# ---------- TF STABILITY ----------
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "1"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["TF_NUM_INTRAOP_THREADS"] = "1"
os.environ["TF_NUM_INTEROP_THREADS"] = "1"

print("🔥 train.py started")

# ---------- PATHS ----------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")
MODEL_DIR = os.path.join(BASE_DIR, "static", "model")

os.makedirs(MODEL_DIR, exist_ok=True)

if not os.path.exists(DATASET_DIR):
    raise FileNotFoundError("❌ dataset folder not found")

print("📂 Dataset:", DATASET_DIR)

# ---------- LOAD CLASS NAMES ----------
class_names = sorted([
    d for d in os.listdir(DATASET_DIR)
    if os.path.isdir(os.path.join(DATASET_DIR, d))
])

num_classes = len(class_names)

print("✅ Classes detected:", num_classes)
for c in class_names:
    print(" -", c)

# ---------- SAVE classes.json ----------
with open(os.path.join(MODEL_DIR, "classes.json"), "w", encoding="utf-8") as f:
    json.dump(class_names, f, indent=2)

# ---------- PARAMETERS ----------
IMG_SIZE = (128, 128)
BATCH_SIZE = 16
EPOCHS = 25
SEED = 42

# ---------- FILE PATHS + LABELS ----------
image_paths = []
labels = []

for idx, class_name in enumerate(class_names):
    class_dir = os.path.join(DATASET_DIR, class_name)
    for file in os.listdir(class_dir):
        if file.lower().endswith((".jpg", ".jpeg", ".png")):
            image_paths.append(os.path.join(class_dir, file))
            labels.append(idx)

print(f"📸 Total images found: {len(image_paths)}")

# ---------- TRAIN / VAL SPLIT ----------
split = int(0.8 * len(image_paths))
train_paths = image_paths[:split]
train_labels = labels[:split]
val_paths = image_paths[split:]
val_labels = labels[split:]

# ---------- SAFE IMAGE LOADER ----------
def load_image(path, label):
    image = tf.io.read_file(path)

    # SAFE decode → skips broken images
    image = tf.image.decode_image(image, channels=3, expand_animations=False)

    image = tf.image.resize(image, IMG_SIZE)
    image = image / 255.0
    return image, label

# ---------- DATASETS ----------
train_ds = tf.data.Dataset.from_tensor_slices((train_paths, train_labels))
train_ds = train_ds.map(load_image, num_parallel_calls=tf.data.AUTOTUNE)
train_ds = train_ds.shuffle(1000).batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)
train_ds = train_ds.apply(tf.data.experimental.ignore_errors())

val_ds = tf.data.Dataset.from_tensor_slices((val_paths, val_labels))
val_ds = val_ds.map(load_image, num_parallel_calls=tf.data.AUTOTUNE)
val_ds = val_ds.batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)
val_ds = val_ds.apply(tf.data.experimental.ignore_errors())

print("✅ Dataset pipeline ready (corrupted images will be skipped)")

# ---------- MODEL ----------
model = keras.Sequential([
    layers.Conv2D(32, 3, activation="relu", input_shape=(*IMG_SIZE, 3)),
    layers.MaxPooling2D(),

    layers.Conv2D(64, 3, activation="relu"),
    layers.MaxPooling2D(),

    layers.Conv2D(128, 3, activation="relu"),
    layers.MaxPooling2D(),

    layers.Flatten(),
    layers.Dense(256, activation="relu"),
    layers.Dropout(0.4),

    layers.Dense(num_classes, activation="softmax")
])

model.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

model.summary()

# ---------- TRAIN ----------
print("🚀 Training started...")
model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS
)

# ---------- SAVE MODEL ----------
model_path = os.path.join(MODEL_DIR, "plant_disease_model.keras")
model.save(model_path)

print("🎉 Training completed successfully")
print("💾 Model saved at:", model_path)
