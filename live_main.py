import cv2
import numpy as np
from paddleocr import PaddleOCR
import re
import csv
import time
import os
from datetime import datetime

# User-defined name for the CSV file
name = "Testing_Engineer_Name"  # You can change this to any name you'd like.

# Path to save CSV files
csv_folder = 'results'
os.makedirs(csv_folder, exist_ok=True)

# Initialize the OCR engine
ocr = PaddleOCR(use_angle_cls=True, lang='en')  # Enabling angle classification

# URL for the live camera feed
video_url = 'http://192.168.0.101:8080/video'  # Replace with your live feed URL

# Set up the path to save OCR output text
current_datetime = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
ocr_output_file = f"{name}_{current_datetime}.txt"

# Folder to save threshold images
threshold_images_folder = 'threshold_images'
os.makedirs(threshold_images_folder, exist_ok=True)

# Create a dynamic CSV filename based on the current date and time
csv_filename = f"{name}_{current_datetime}.csv"
csv_file = os.path.join(csv_folder, csv_filename)

# Initialize the CSV file with headers if it doesn't already exist
header = ['Time', 'Load Min', 'Load Max', 'Position Min', 'Position Max', 'Position Track', 'Loaded Track', 'Position Ult Max', 'Loaded Ult Max', 'Frequency Track', 'Cycles Total']

try:
    with open(csv_file, mode='x', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(header)
except FileExistsError:
    pass

# Start capturing the live feed
cap = cv2.VideoCapture(video_url)

# Ensure the live feed is opened correctly
if not cap.isOpened():
    print("Error: Could not open live feed.")
    exit()

# Initialize variables for checking technical interference
last_30_values = []
frame_rate = int(cap.get(cv2.CAP_PROP_FPS))  # Get the frames per second of the live feed
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))  # Total number of frames (can be ignored for live feed)

# Flag for human interference (press "q" to stop temporarily)
stop_flag = False

while True:
    try:
        if stop_flag:
            print("Press 'q' to resume the program.")
            while stop_flag:
                key = cv2.waitKey(1) & 0xFF
                if key == ord('q'):
                    stop_flag = False
                    print("Program resumed.")
            continue

        # Read the frame from the live feed
        ret, frame = cap.read()

        if not ret:
            print("Error: Lost connection to live feed, retrying...")
            cap.release()
            time.sleep(2)  # Wait before trying to reconnect
            cap = cv2.VideoCapture(video_url)
            if not cap.isOpened():
                print("Error: Could not reconnect to live feed. Retrying...")
                time.sleep(2)
                continue
            continue

        # Coordinates for cropping the frame
        top_left_x = 30
        top_left_y = 30
        width = 500
        height = 310

        # Crop the frame to focus on the area where OCR should process
        cropped_frame = frame[top_left_y:top_left_y + height, top_left_x:top_left_x + width]

        # Convert to grayscale and apply thresholding
        gray_frame = cv2.cvtColor(cropped_frame, cv2.COLOR_BGR2GRAY)
        _, thresholded_frame = cv2.threshold(gray_frame, 110, 255, cv2.THRESH_BINARY)

        # Perform OCR
        result = ocr.ocr(thresholded_frame, cls=True)

        # Extract text from OCR result
        extracted_text = "\n".join([line[1][0] for line in result])

        # Save the OCR output (before preprocessing) to a text file
        with open(ocr_output_file, 'a') as f:
            f.write(f"OCR Output at {time.strftime('%Y-%m-%d %H:%M:%S')}:\n")
            f.write(extracted_text + "\n\n")

        # Use regex to extract numbers and possible units
        pattern = r'(-?\d+\.\d+)([a-zA-Z]*)'  # Match numbers with decimals and optional units
        matches = re.findall(pattern, extracted_text)

        # Process the OCR numbers and format
        numbers = [f"{number}{unit}" for number, unit in matches]

        # Ensure 10 values are available, add empty strings if necessary
        numbers += [''] * (10 - len(numbers))

        # Get the current timestamp for the CSV file
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime())

        # Write the data to CSV file
        row = [timestamp] + numbers
        with open(csv_file, mode='a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(row)

        print(f"Processed frame at {timestamp}")
        print(f"Detected Text: {extracted_text}")
        print(f"Formatted Output: {row}")

        # Save the thresholded frame as an image in the folder
        threshold_image_filename = os.path.join(threshold_images_folder, f'thresholded_frame_at_{timestamp.replace(":", "-")}.jpg')
        cv2.imwrite(threshold_image_filename, thresholded_frame)
        print(f"Thresholded frame saved at {timestamp}.")

        # Track values for 30 seconds and stop if all are identical
        last_30_values.append(tuple(numbers))
        if len(last_30_values) > 30:
            last_30_values.pop(0)

        if len(last_30_values) == 30 and all(x == last_30_values[0] for x in last_30_values):
            print("Testing has stopped.")
            break

    except Exception as e:
        print(f"Error occurred: {e}. Retrying...")
        cap.release()
        time.sleep(2)
        cap = cv2.VideoCapture(video_url)
        if not cap.isOpened():
            print("Error: Could not reconnect to live feed. Retrying...")
            time.sleep(2)
            continue

# Release the video capture object
cap.release()
cv2.destroyAllWindows()
