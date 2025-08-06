import pandas as pd
import requests
import base64
import os
import matplotlib.pyplot as plt
from email_logs import process_logger
import traceback

# Function to send email
def send_email(html, fromID, toIDs, subject):
    status = "failed"
    try:
        headers = {
            'userid': 'Ashish',
            'password': 'pass,123',
            'Accept': '*/*'
        }

        url = 'https://mserverservices.mahindra.com/rest/service/sendmail'

        data = {
            "fromID": fromID,
            "contentType": "text/html",
            "subject": subject,
            "content": html,
            "mailTitle": "Trespass Vehicle Alert"
        }

        for toID in toIDs:
            data['toID'] = toID  # Update recipient for each iteration
            print(f"Sending mail to {toID}....")
            status = requests.post(url, data=data, headers=headers).text
            process_logger.info(f"Mail status {status} sent to {toID}")
            print(f"Mail sent to {toID} with status: {status}")

        return status
    except Exception as e:
        print(f"Exception in send_mail() {e}")
        process_logger.error(f"Error {e}")
        process_logger.error(f"TraceBack {traceback.format_exc()}")
        return status

# Function to generate histogram
def generate_histogram(df):
    try:
        # Generate histogram
        plt.figure(figsize=(10, 6))  # Adjust figure size for more space
        grouped_data = df.groupby('camera_name').sum()[['helmet_counter', 'non_helmet_counter']]
        grouped_data.plot.bar(stacked=True, width=0.7, alpha=0.9, ax=plt.gca())

        plt.title('Helmet vs Non-Helmet Count per Camera')
        plt.xlabel('Camera Name')
        plt.ylabel('Count')

        # Adjust the legend to the bottom right corner and outside the plot area
        plt.legend(
            loc='lower right',
            bbox_to_anchor=(1.15, 0),  # Adjust position to move outside the plot
            title='Legend',
        )

        plt.tight_layout()

        # Save histogram as an image
        histogram_path = "histogram.png"
        plt.savefig(histogram_path)
        plt.close()
        return histogram_path
    except Exception as e:
        print(f"Exception in generate_histogram() {e}")
        process_logger.error(f"Error {e}")
        process_logger.error(f"TraceBack {traceback.format_exc()}")
        return None

# Function to embed image in email content
def embed_image_in_email(image_path):
    try:
        with open(image_path, "rb") as img_file:
            base64_image = base64.b64encode(img_file.read()).decode('utf-8')
        html_image = f'<img src="data:image/png;base64,{base64_image}" alt="Histogram" />'
        return html_image
    except Exception as e:
        print(f"Exception in embed_image_in_email() {e}")
        process_logger.error(f"Error {e}")
        process_logger.error(f"Traceback {traceback.format_exc()}")
        return ""

# Function to send DataFrame and histogram via email
def send_dataframe_with_histogram(df, fromID, toIDs, subject):
    try:
        # Convert the DataFrame to an HTML table
        html_table = df.to_html(index=False, border=1)
        histogram_path = generate_histogram(df)

        if not histogram_path:
            return "failed"

        histogram_html = embed_image_in_email(histogram_path)

        # HTML content with DataFrame and histogram
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>DataFrame Report</title>
        </head>
        <body>
            <h3>Attached DataFrame Report:</h3>
            {html_table}
            <h3>Histogram of Helmet vs Non-Helmet Count per Camera:</h3>
            {histogram_html}
        </body>
        </html>
        """
        # Send the email
        status = send_email(html_content, fromID, toIDs, subject)
        return status
    except Exception as e:
        print(f"Exception in send_dataframe_with_histogram() {e}")
        process_logger.error(f"Error {e}")
        process_logger.error(f"Traceback {traceback.format_exc()}")
        return "failed"

# Main function
def send():
    # Load the CSV file
    df = pd.read_csv('D:\\helmet_deployment\\email_report_2025-01-13.csv')

    # Rename columns to match expected names
    df.columns = ['camera_name', 'datetime', 'status']

    # Count occurrences of helmet and non-helmet detections per camera
    df['helmet_counter'] = df['status'].apply(lambda x: 1 if x == 'helmet' else 0)
    df['non_helmet_counter'] = df['status'].apply(lambda x: 1 if x == 'non-helmet' else 0)

    # Group the data by camera_name to get the counts
    grouped_df = df.groupby('camera_name').sum().reset_index()

    # Define list of recipient emails
    to_emails = ["s05081@mahindra.com", "25017514@mahindra.com", "50002170@mahindra.com"]

    # Send DataFrame and histogram via email to multiple recipients
    send_dataframe_with_histogram(
        grouped_df, 
        fromID="mrvtracker@mahindra.com",  
        toIDs=to_emails,  
        subject="Detection Report: Helmet vs Non-Helmet"
    )

if __name__ == "__main__":
    send()
