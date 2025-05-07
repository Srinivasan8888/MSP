import requests
import random
import string
import time
from datetime import datetime
from zoneinfo import ZoneInfo

# Function to generate a random string for 'id'
def random_string(length=6):
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

# Function to generate random sensor data
def generate_sensor_data():
    return {
        "id": '2501',
        "vibration": round(random.uniform(0.1, 5.0), 2),
        "magneticflux": random.randint(300, 500),
        "rpm": random.randint(1000, 2000),
        "acoustics": round(random.uniform(50.0, 80.0), 1),
        "temperature": round(random.uniform(20.0, 40.0), 1),
        "humidity": round(random.uniform(30.0, 70.0), 1),
        "pressure": random.randint(950, 1050),
        "altitude": round(random.uniform(0, 1000), 1),
        "airquality": random.randint(200, 500),
        "signal":  round(random.uniform(20.0, 100.0), 1),
        "battery": round(random.uniform(20.0, 100.0), 1),
        "time": datetime.now(ZoneInfo("Asia/Kolkata")).strftime("%Y-%m-%d %H:%M:%S")
    }

# Main function to send POST request
def send_sensor_data(url):
    try:
        data = generate_sensor_data()
        print("\nSending data:", data)
        
        # Print the full URL with parameters
        full_url = f"{url}?" + "&".join([f"{k}={v}" for k, v in data.items()])
        print("Full URL:", full_url)

        response = requests.post(url, params=data)
        print("Response status code:", response.status_code)
        print("Response body:", response.text)
    except Exception as e:
        print(f"Error occurred: {e}")

if __name__ == "__main__":
    API_URL = "http://localhost:4000/api/v1/create"
    print("Starting sensor data transmission...")
    print("Press Ctrl+C to stop")
    
    try:
        while True:
            send_sensor_data(API_URL)
            time.sleep(2)  # Wait for 2 seconds before next transmission
    except KeyboardInterrupt:
        print("\nStopping sensor data transmission...")