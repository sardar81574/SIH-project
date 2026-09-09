import time
import random
import requests
import cv2
import numpy as np
from datetime import datetime

BACKEND_URL = "http://127.0.0.1:8000"
DEVICE_ID = "ESP32_KHET_SEHORE_01"
LATITUDE = 23.2031
LONGITUDE = 77.0844

def create_synthetic_sticky_trap(pest_count: int) -> bytes:
    """
    Yellow sticky trap canvas create karta hai jisme black specks (insects)
    randomly distribute hote hain OpenCV testing ke liye.
    """
    # 400x400 Yellow Canvas (BGR: Yellow is (30, 220, 240))
    canvas = np.full((400, 400, 3), (30, 220, 240), dtype=np.uint8)

    # Random noise / dust specs
    for _ in range(30):
        nx = random.randint(10, 390)
        ny = random.randint(10, 390)
        cv2.circle(canvas, (nx, ny), 1, (60, 180, 200), -1)

    # Insects / Pests (Dark brownish-black spots of varying sizes)
    for _ in range(pest_count):
        cx = random.randint(25, 375)
        cy = random.randint(25, 375)
        radius = random.randint(3, 7)
        # Main insect body
        cv2.ellipse(canvas, (cx, cy), (radius, int(radius * 1.5)), random.randint(0, 180), 0, 360, (20, 25, 30), -1)
        # Minor legs / antennas
        cv2.line(canvas, (cx, cy), (cx + random.randint(-8, 8), cy + random.randint(-8, 8)), (15, 15, 15), 1)

    _, encoded_img = cv2.imencode(".jpg", canvas, [int(cv2.IMWRITE_JPEG_QUALITY), 90])
    return encoded_img.tobytes()

def send_telemetry():
    payload = {
        "device_id": DEVICE_ID,
        "battery_level": round(random.uniform(82.0, 99.0), 1),
        "temperature": round(random.uniform(26.0, 36.5), 1),
        "humidity": round(random.uniform(55.0, 88.0), 1),
        "soil_moisture": round(random.uniform(32.0, 58.0), 1)
    }
    try:
        res = requests.post(f"{BACKEND_URL}/api/iot/telemetry", json=payload, timeout=5)
        if res.status_code == 200:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] 🔋 Telemetry Sent | Battery: {payload['battery_level']}% | Temp: {payload['temperature']}°C | Moisture: {payload['soil_moisture']}%")
        else:
            print(f"⚠️ Telemetry Status {res.status_code}: {res.text}")
    except Exception as e:
        print(f"❌ Telemetry Connection Error: {e}")

def send_camera_frame():
    # 2 se 25 ke beech me random kide generate honge
    target_bugs = random.randint(3, 24)
    img_bytes = create_synthetic_sticky_trap(target_bugs)

    files = {
        "file": ("sticky_trap_snapshot.jpg", img_bytes, "image/jpeg")
    }
    data = {
        "device_id": DEVICE_ID,
        "latitude": LATITUDE,
        "longitude": LONGITUDE
    }

    try:
        res = requests.post(f"{BACKEND_URL}/api/iot/pest-detect", files=files, data=data, timeout=8)
        if res.status_code == 200:
            out = res.json()
            pest_detected = out.get("pest_count", 0)
            severity = out.get("severity", "Normal")
            action = "🚨 ALERT TRIGGERED" if out.get("action_required") else "✅ Normal"
            print(f"[{datetime.now().strftime('%H:%M:%S')}] 📸 Camera Capture -> Generated: {target_bugs} | OpenCV Counted: {pest_detected} Pests | Severity: {severity} [{action}]")
        else:
            print(f"⚠️ Camera Route Status {res.status_code}: {res.text}")
    except Exception as e:
        print(f"❌ Camera Upload Error: {e}")

def main():
    print("=" * 65)
    print(f"🌾 Starting AgriScan IoT Field Device Simulator [{DEVICE_ID}]")
    print(f"📡 Target Backend: {BACKEND_URL}")
    print("Press Ctrl+C to Stop Simulation")
    print("=" * 65)

    cycle = 1
    while True:
        try:
            print(f"\n--- [Cycle #{cycle}] ---")
            send_telemetry()
            send_camera_frame()
            cycle += 1
            time.sleep(5)  # Har 5 second me naya telemetry aur image sync
        except KeyboardInterrupt:
            print("\n🛑 IoT Simulation Stopped by User.")
            break
        except Exception as err:
            print(f"Loop Error: {err}")
            time.sleep(3)

if __name__ == "__main__":
    main()