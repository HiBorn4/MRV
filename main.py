import cv2
import numpy as np
from paddleocr import PaddleOCR
import re
import csv
import time
import os
import sys

# Path to your video file
video_path = 'dataset/WIN_20241114_13_16_06_Pro.mp4'

# Path to CSV file for storing the data
csv_file = sys.argv[1] if len(sys.argv) > 1 else 'csv_files/default_output.csv'

# Initialize the CSV file with headers if it doesn't already exist
header = ['Time', 'Load Min', 'Load Max', 'Position Min', 'Position Max', 'Position Track', 'Loaded Track', 'Position Ult Max', 'Loaded Ult Max', 'Frequency Track', 'Cycles Total']

# Check if the CSV file exists, if not, create and write the header
try:
    with open(csv_file, mode='x', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(header)
except FileExistsError:
    pass

# Path to save threshold images
threshold_images_folder = 'threshold_images'
os.makedirs(threshold_images_folder, exist_ok=True)

# Path to save OCR outputs (before preprocessing)
ocr_output_file = 'ocr_output.txt'

# Initialize PaddleOCR
ocr = PaddleOCR(use_angle_cls=True, lang='en')  # Enabling angle classification

# Load the video
cap = cv2.VideoCapture(video_path)

# Check if the video was successfully opened
if not cap.isOpened():
    print("Error: Could not open video.")
    exit()

# Loop through the video, processing one frame every second
frame_rate = int(cap.get(cv2.CAP_PROP_FPS))  # Get the frames per second
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))  # Total number of frames

# Initialize variables to check for 30 identical values
last_30_values = []

# Process each second of the video
for second in range(0, total_frames // frame_rate):
    try:
        # Set the current position of the video to the start of the second
        cap.set(cv2.CAP_PROP_POS_FRAMES, second * frame_rate)

        # Read the frame at the current position
        ret, frame = cap.read()

        if not ret:
            print(f"Error: Could not read frame at second {second}.")
            continue

        # Coordinates for the crop window: (top-left corner x, top-left corner y, width, height)
        top_left_x = 30
        top_left_y = 30
        width = 500
        height = 310

        # Crop the frame using coordinates
        cropped_frame = frame[top_left_y:top_left_y + height, top_left_x:top_left_x + width]

        # Apply thresholding to enhance text for OCR
        gray_frame = cv2.cvtColor(cropped_frame, cv2.COLOR_BGR2GRAY)  # Convert to grayscale
        _, thresholded_frame = cv2.threshold(gray_frame, 110, 255, cv2.THRESH_BINARY)  # Apply binary thresholding

        # Perform OCR on the thresholded frame
        result = ocr.ocr(thresholded_frame, cls=True)

        # Extract text from OCR result
        extracted_text = "\n".join([line[1][0] for line in result])

        # Save the OCR result (before preprocessing) to a text file
        with open(ocr_output_file, 'a') as f:
            f.write(f"Second {second} OCR Output:\n")
            f.write(extracted_text + "\n\n")

        # Regular expression to extract numbers with or without units
        pattern = r'(-?\d+\.\d+)([a-zA-Z]*)'  # Match numbers with decimals and optional units
        matches = re.findall(pattern, extracted_text)

        # Process and format the output
        numbers = []
        for i, (number, unit) in enumerate(matches, start=1):
            numbers.append(f"{number}{unit}")

        # Get the current timestamp (for the second)
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime(second))

        # Ensure we have 10 numbers, adding empty strings if needed
        numbers += [''] * (10 - len(numbers))

        # Combine the timestamp and numbers into a row
        row = [timestamp] + numbers

        # Write the row to the CSV file
        with open(csv_file, mode='a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(row)

        # Print the detected text and the row written to the CSV
        print(f"Detected Text at second {second}:")
        print(extracted_text)
        print("\nFormatted Output:")
        print(row)

        # Save the thresholded frame as an image in the folder
        threshold_image_filename = os.path.join(threshold_images_folder, f'thresholded_frame_at_{second}_second.jpg')
        cv2.imwrite(threshold_image_filename, thresholded_frame)
        print(f"Thresholded frame saved at second {second}.")

        # Append the current numbers to the last_30_values list
        last_30_values.append(tuple(numbers))

        # If we have 30 entries, check if they are all the same
        if len(last_30_values) > 30:
            last_30_values.pop(0)  # Remove the oldest value

        # Check if all the values are the same
        if len(last_30_values) == 30 and all(x == last_30_values[0] for x in last_30_values):
            print("Testing has stopped")
            break

    except Exception as e:
        print(f"Error processing second {second}: {e}")
        continue

# Release the video capture object
cap.release()
