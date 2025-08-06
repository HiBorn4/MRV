import os
import cv2
import subprocess

def loop_video(video_path, output_path, total_duration=3 * 60 * 60):  
    """
    Loops a given video file until it reaches the total duration.

    Parameters:
    - video_path: Path to the input video file.
    - output_path: Path to save the output looped video.
    - total_duration: Total duration of the output video in seconds (default 3 hours).
    """
    # Get the original video duration using OpenCV
    cap = cv2.VideoCapture(video_path)
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = frame_count / fps  # Original duration in seconds
    cap.release()

    # Calculate the number of loops needed
    loops_needed = int(total_duration / duration)
    
    if loops_needed < 1:
        print("Error: The original video is longer than the required duration.")
        return

    print(f"Original Video Duration: {duration:.2f} seconds")
    print(f"Total Duration Required: {total_duration / 60:.2f} minutes")
    print(f"Looping video {loops_needed} times...")

    # Use FFmpeg to concatenate the video multiple times
    concat_list = "concat_list.txt"
    with open(concat_list, "w") as f:
        for _ in range(loops_needed):
            f.write(f"file '{video_path}'\n")

    # Run FFmpeg to merge the videos
    ffmpeg_command = [
        "ffmpeg", "-f", "concat", "-safe", "0",
        "-i", concat_list, "-c", "copy", output_path
    ]

    subprocess.run(ffmpeg_command, check=True)
    
    print(f"Looped video saved as: {output_path}")
    os.remove(concat_list)  # Clean up temp file

# Example usage
video_path = "dataset/WIN_20241114_13_16_06_Pro.mp4"  # Change this to your video path
output_path = "looped_video.mp4"
loop_video(video_path, output_path)
