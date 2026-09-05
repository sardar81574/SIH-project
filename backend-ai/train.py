import os
import json

# OneDNN / MKL Memory crash ko disable karein
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint

# --- 1. Settings ---
DATASET_DIR = "dataset"
TRAIN_DIR = os.path.join(DATASET_DIR, "train")
VAL_DIR = os.path.join(DATASET_DIR, "val")

IMG_SIZE = (128, 128)  # Lightweight size to guarantee 0 memory crash
BATCH_SIZE = 8
EPOCHS = 15
MODEL_SAVE_PATH = "crop_doctor_model.h5"
CLASSES_JSON_PATH = "class_indices.json"

print("[INFO] Loading datasets...")

# --- 2. Load Datasets ---
train_ds = tf.keras.utils.image_dataset_from_directory(
    TRAIN_DIR,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode="categorical",
    shuffle=True
)

val_ds = tf.keras.utils.image_dataset_from_directory(
    VAL_DIR,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode="categorical",
    shuffle=False
)

class_names = train_ds.class_names
class_indices = {name: idx for idx, name in enumerate(class_names)}
num_classes = len(class_names)

with open(CLASSES_JSON_PATH, "w") as f:
    json.dump(class_indices, f)

print(f"[INFO] Classes detected: {class_indices}")

# Normalization & Augmentation
AUTOTUNE = tf.data.AUTOTUNE
normalization_layer = layers.Rescaling(1.0 / 255.0)

train_ds = train_ds.map(lambda x, y: (normalization_layer(x), y)).prefetch(buffer_size=AUTOTUNE)
val_ds = val_ds.map(lambda x, y: (normalization_layer(x), y)).prefetch(buffer_size=AUTOTUNE)

# --- 3. Ultra-Lightweight Custom CNN Architecture ---
print("[INFO] Building Lightweight Leaf Disease Classifier...")
model = models.Sequential([
    layers.Input(shape=(128, 128, 3)),
    layers.Conv2D(16, (3, 3), activation="relu", padding="same"),
    layers.MaxPooling2D(2, 2),
    
    layers.Conv2D(32, (3, 3), activation="relu", padding="same"),
    layers.MaxPooling2D(2, 2),
    
    layers.Conv2D(64, (3, 3), activation="relu", padding="same"),
    layers.MaxPooling2D(2, 2),
    
    layers.Flatten(),
    layers.Dense(64, activation="relu"),
    layers.Dropout(0.3),
    layers.Dense(num_classes, activation="softmax")
])

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

callbacks = [
    EarlyStopping(monitor="val_loss", patience=4, restore_best_weights=True, verbose=1),
    ModelCheckpoint(MODEL_SAVE_PATH, monitor="val_accuracy", save_best_only=True, verbose=1)
]

# --- 4. Model Training ---
print("[INFO] Training started on CPU...")
history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS,
    callbacks=callbacks
)

# --- 5. Save Model ---

model.save(MODEL_SAVE_PATH)
print(f"\n[SUCCESS] Model trained & saved successfully as '{MODEL_SAVE_PATH}'!")