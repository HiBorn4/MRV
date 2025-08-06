from flask import Flask, request, jsonify, send_from_directory, send_file, abort
import os
import subprocess
from datetime import datetime

app = Flask(__name__)
script_running = False
script_process = None
csv_folder = "csv_files"  # Folder to store CSV files

os.makedirs(csv_folder, exist_ok=True)  # Ensure the CSV folder exists

@app.route('/start', methods=['POST'])
def start_script():
    global script_running, script_process
    if not script_running:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        csv_filename = f"{timestamp}_output.csv"
        script_path = "live_main.py"
        command = ["python", script_path, csv_folder, csv_filename]
        script_process = subprocess.Popen(command)
        script_running = True
        return jsonify({"message": "Script started", "csv_file": csv_filename})
    else:
        return jsonify({"message": "Script is already running"}), 400

@app.route('/stop', methods=['POST'])
def stop_script():
    global script_running, script_process
    if script_running:
        script_process.terminate()
        script_process = None
        script_running = False
        return jsonify({"message": "Script stopped"})
    else:
        return jsonify({"message": "No script is running"}), 400

@app.route('/history', methods=['GET'])
def get_history():
    files = os.listdir(csv_folder)
    csv_files = [f for f in files if f.endswith('.csv')]
    return jsonify({"csv_files": csv_files})

@app.route('/download/<filename>', methods=['GET'])
def download_csv(filename):
    if filename in os.listdir(csv_folder):
        return send_from_directory(csv_folder, filename, as_attachment=True)
    else:
        return jsonify({"message": "File not found"}), 404

@app.route('/view/<filename>', methods=['GET'])
def view_csv(filename):
    file_path = os.path.join(csv_folder, filename)
    if os.path.exists(file_path):
        return send_file(file_path, mimetype='text/csv')
    else:
        return jsonify({"message": "File not found"}), 404

@app.route('/delete/<filename>', methods=['DELETE'])
def delete_csv(filename):
    file_path = os.path.join(csv_folder, filename)
    if os.path.exists(file_path):
        os.remove(file_path)
        return jsonify({"message": f"File {filename} deleted successfully"})
    else:
        return jsonify({"message": "File not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
