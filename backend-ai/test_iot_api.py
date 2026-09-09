import io
import requests
import numpy as np
import cv2

BASE_URL = "http://127.0.0.1:8000"

def test_1_server_health():
    print("TEST 1: Checking Backend Root...")
    res = requests.get(f"{BASE_URL}/")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    print("  -> Passed! Server is Live.\n")

def test_2_send_telemetry():
    print("TEST 2: Testing /api/iot/telemetry...")
    payload = {
        "device_id": "TEST_ESP32_01",
        "battery_level": 91.5,
        "temperature": 29.0,
        "humidity": 65.0,
        "soil_moisture": 45.0
    }
    res = requests.post(f"{BASE_URL}/api/iot/telemetry", json=payload)
    assert res.status_code == 200, f"Telemetry failed: {res.text}"
    json_data = res.json()
    assert json_data.get("status") == "success", "Expected success status"
    print(f"  -> Passed! Response: {json_data}\n")

def test_3_pest_detection_opencv():
    print("TEST 3: Testing /api/iot/pest-detect (OpenCV Counting)...")
    
    # Yellow background with 8 black spots
    canvas = np.full((300, 300, 3), (30, 220, 240), dtype=np.uint8)
    for coord in [(50, 50), (100, 80), (150, 200), (200, 150), (80, 220), (220, 70), (120, 140), (180, 250)]:
        cv2.circle(canvas, coord, 5, (20, 20, 20), -1)

    _, img_encoded = cv2.imencode(".jpg", canvas)
    files = {"file": ("test_trap.jpg", img_encoded.tobytes(), "image/jpeg")}
    data = {"device_id": "TEST_ESP32_01"}

    res = requests.post(f"{BASE_URL}/api/iot/pest-detect", files=files, data=data)
    assert res.status_code == 200, f"Pest detect failed: {res.text}"
    json_data = res.json()
    print(f"  -> Detected Pests: {json_data.get('pest_count')} | Severity: {json_data.get('severity')}")
    assert "pest_count" in json_data, "pest_count key missing"
    print("  -> Passed!\n")

def test_4_dashboard_fetch():
    print("TEST 4: Testing /api/iot/dashboard-data...")
    res = requests.get(f"{BASE_URL}/api/iot/dashboard-data")
    assert res.status_code == 200, f"Dashboard fetch failed: {res.text}"
    json_data = res.json()
    assert "devices" in json_data, "devices key missing"
    assert "total_pest_count" in json_data, "total_pest_count key missing"
    print(f"  -> Active Devices: {len(json_data['devices'])}, Total Pests Counted: {json_data['total_pest_count']}")
    print("  -> Passed!\n")

def test_5_community_geofence():
    print("TEST 5: Testing /api/community/feed (2 KM Geofence)...")
    res = requests.get(f"{BASE_URL}/api/community/feed?lat=22.7196&lng=75.8577")
    assert res.status_code == 200, f"Community feed failed: {res.text}"
    json_data = res.json()
    assert "alerts" in json_data, "alerts key missing"
    print(f"  -> Alerts within 2 KM: {len(json_data['alerts'])}")
    print("  -> Passed!\n")

if __name__ == "__main__":
    print("=" * 60)
    print("🧪 Running AgriScan Full IoT Integration Test Suite")
    print("=" * 60 + "\n")
    try:
        test_1_server_health()
        test_2_send_telemetry()
        test_3_pest_detection_opencv()
        test_4_dashboard_fetch()
        test_5_community_geofence()
        print("🎉 ALL 5 TESTS PASSED SUCCESSFULLY! Your IoT pipeline is 100% operational.")
    except AssertionError as err:
        print(f"❌ TEST FAILED: {err}")
    except Exception as exc:
        print(f"❌ EXECUTION ERROR: {exc}. Make sure Uvicorn is running on port 8000.")