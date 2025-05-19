import requests
import random
import string
import time
from datetime import datetime
from zoneinfo import ZoneInfo

# Configuration for different sensor IDs and their data ranges
SENSOR_CONFIGS = {
    '2501': {
        'vibration': (0.1, 3.0),
        'magneticflux': (300, 400),
        'rpm': (1000, 1500),
        'acoustics': (50.0, 65.0),
        'temperature': (20.0, 30.0),
        'humidity': (30.0, 50.0),
        'pressure': (950, 1000),
        'altitude': (0, 500),
        'airquality': (200, 350),
        'signal': (20.0, 60.0),
        'battery': (20.0, 60.0)
    },
    '2502': {
        'vibration': (2.0, 5.0),
        'magneticflux': (400, 500),
        'rpm': (1500, 2000),
        'acoustics': (65.0, 80.0),
        'temperature': (30.0, 40.0),
        'humidity': (50.0, 70.0),
        'pressure': (1000, 1050),
        'altitude': (500, 1000),
        'airquality': (350, 500),
        'signal': (60.0, 100.0),
        'battery': (60.0, 100.0)
    }
    # Add new sensor configurations here
    # Example:
    # '2503': {
    #     'vibration': (1.0, 4.0),
    #     'magneticflux': (350, 450),
    #     ...
    # }
}

def generate_sensor_data(id):
    if id not in SENSOR_CONFIGS:
        raise ValueError(f"No configuration found for sensor ID: {id}")
    
    config = SENSOR_CONFIGS[id]
    data = {"id": id}
    
    # Generate data for each parameter based on its configuration
    for param, (min_val, max_val) in config.items():
        if isinstance(min_val, int) and isinstance(max_val, int):
            data[param] = random.randint(min_val, max_val)
        else:
            data[param] = round(random.uniform(min_val, max_val), 1)
    
    # Add timestamp
    data["time"] = datetime.now(ZoneInfo("Asia/Kolkata")).strftime("%Y-%m-%d %H:%M:%S")
    return data

def send_sensor_data(url, id):
    try:
        data = generate_sensor_data(id)
        print(f"\nSending data for ID {id}:", data)
        
        # Print the full URL with parameters
        full_url = f"{url}?" + "&".join([f"{k}={v}" for k, v in data.items()])
        print("Full URL:", full_url)

        response = requests.post(url, params=data)
        print("Response status code:", response.status_code)
        print("Response body:", response.text)
    except Exception as e:
        print(f"Error occurred for sensor {id}: {e}")

if __name__ == "__main__":
    API_URL = "http://35.200.197.100:4000/api/v1/create"
    print("Starting sensor data transmission...")
    print("Press Ctrl+C to stop")
    print(f"Active sensors: {', '.join(SENSOR_CONFIGS.keys())}")
    
    try:
        while True:
            # Send data for all configured sensors
            for sensor_id in SENSOR_CONFIGS.keys():
                send_sensor_data(API_URL, sensor_id)
                time.sleep(1)  # Wait for 1 second between each sensor
    except KeyboardInterrupt:
        print("\nStopping sensor data transmission...")