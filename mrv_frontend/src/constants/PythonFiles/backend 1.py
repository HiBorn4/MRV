import json
import os
import subprocess
import sqlite3
import time
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
from flask_socketio import SocketIO, emit

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Global variables for script management
script_running = False
script_process = None
start_time = None  # To track when script started
csv_folder = "csv_files"

os.makedirs(csv_folder, exist_ok=True)

# SQLite database helper function
def get_db_connection():
    conn = sqlite3.connect('test_records.db')
    conn.row_factory = sqlite3.Row  # This allows fetching rows as dictionaries
    return conn

# Function to initialize the database if it doesn't exist
def initialize_database():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS test_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            model TEXT,
            start_date TEXT,
            end_date TEXT,
            test_actuator TEXT,
            max_load REAL,
            min_load REAL,
            max_displacement REAL,
            min_displacement REAL,
            test_objective TEXT,
            test_background TEXT,
            job_no TEXT,
            customer TEXT,
            frequency TEXT,
            target TEXT,
            instructions TEXT,
            critical_failures TEXT,
            test_engineer TEXT,
            checked_by TEXT,
            technical_manager TEXT
        );
    ''')

    conn.commit()
    conn.close()

# Ensure the database is initialized before running the server
initialize_database()

@app.route('/')
def home():
    return jsonify({"message": "MRV API is running!"})

# Emit elapsed time every second
def send_elapsed_time():
    global script_running, start_time
    while script_running:
        elapsed_time = int(time.time() - start_time)
        socketio.emit("elapsed_time", {"seconds": elapsed_time})
        time.sleep(1)

@app.route('/start', methods=['POST'])
def start_script():
    global script_running, script_process, start_time
    if not script_running:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        csv_filename = f"{timestamp}_output.csv"
        script_path = "main.py"
        
        script_process = subprocess.Popen(["python", script_path])
        script_running = True
        start_time = time.time()  # Start timer

        # Emit event to notify frontend
        socketio.start_background_task(send_elapsed_time)
        socketio.emit("script_status", {"status": "running"})

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

        # Notify frontend that script stopped
        socketio.emit("script_status", {"status": "stopped"})

        return jsonify({"message": "Script stopped"})
    else:
        return jsonify({"message": "No script is running"}), 400

@socketio.on("connect")
def handle_connect():
    print("Frontend connected")


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

@app.route('/record', methods=['POST'])
def create_record():
    data = request.json  

    print("\n🔹 Received Payload:", json.dumps(data, indent=4))  # Debugging

    if not data:
        print("❌ Error: Received empty payload!")
        return jsonify({"error": "Empty payload"}), 400

    # Check if required fields are missing
    # required_fields = ["Job_No", "Start_Date", "End_Date", "Tech_Manager", "Tech_Engineer"]
    # missing_fields = [field for field in required_fields if field not in data]

    # if missing_fields:
    #     print(f"❌ Error: Missing fields - {missing_fields}")
    #     return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

    # Generate CSV filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    csv_filename = f"{data['job_no']}_{timestamp}.csv"

    # Insert into database
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT INTO test_records (job_no, start_date, end_date, csv_name, tech_manager, tech_engineer,
                                      model, test_actuator, max_load, min_load, max_displacement, min_displacement, 
                                      target, test_objective, test_background, customer, frequency, 
                                      instructions, critical_failures, checked_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data["job_no"], data["start_date"], data["end_date"], csv_filename, 
            data["tech_manager"], data["tech_engineer"], data.get("model", ""),
            data.get("test_actuator", ""), data.get("max_load", 0), data.get("min_load", 0),
            data.get("max_displacement", 0), data.get("min_displacement", 0), data.get("target", ""),
            data.get("test_objective", ""), data.get("test_background", ""),
            data.get("customer", ""), data.get("frequency", ""), data.get("instructions", ""),
            data.get("critical_failures", ""), data.get("checked_by", "")
        ))
        conn.commit()
        print(f"✅ SQL Insert Success for Job No: {data['job_no']}")
    
    except Exception as e:
        print(f"❌ SQL Insert Failed: {e}")
        return jsonify({"error": "Database insert failed"}), 500

    # Fetch all previous and new records
    cursor.execute("SELECT job_no, start_date, end_date, csv_name, tech_manager, tech_engineer FROM test_records")
    all_records = [dict(row) for row in cursor.fetchall()]
    conn.close()

    print("\n📤 Sending All Records:", json.dumps(all_records, indent=4))  # Debugging

    return jsonify(all_records), 201


@app.route('/records', methods=['GET'])
def read_records():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM test_records')
    records = cursor.fetchall()
    conn.close()
    return jsonify([dict(record) for record in records])

@app.route('/record/<int:record_id>', methods=['PUT'])
def update_record(record_id):
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE test_records
        SET model_project = ?, start_date = ?, end_date = ?, test_actuator = ?, load_max = ?, load_min = ?, disp_max = ?, disp_min = ?,
            test_objective = ?, test_background = ?, record_no = ?, job_number = ?, customer = ?, frequency = ?, target = ?,
            loadcell_sensitivity = ?, loadcell_p = ?, loadcell_i = ?, loadcell_d = ?, loadcell_polarity = ?, loadcell_offset = ?, loadcell_shunt_check = ?,
            lvdt_sensitivity = ?, lvdt_p = ?, lvdt_i = ?, lvdt_d = ?, lvdt_polarity = ?, lvdt_offset = ?, lvdt_shunt_check = ?,
            instructions = ?, critical_failures = ?, man_hours_summary = ?, test_engineer = ?, team_leader = ?, contract_manpower = ?,
            component_observation = ?, checked_by = ?, technical_manager = ?
        WHERE id = ?
    ''', (
        data['model_project'], data['start_date'], data['end_date'], data['test_actuator'], data['load_max'], data['load_min'], 
        data['disp_max'], data['disp_min'], data['test_objective'], data['test_background'], data['record_no'], 
        data['job_number'], data['customer'], data['frequency'], data['target'], data['loadcell_sensitivity'], 
        data['loadcell_p'], data['loadcell_i'], data['loadcell_d'], data['loadcell_polarity'], data['loadcell_offset'], 
        data['loadcell_shunt_check'], data['lvdt_sensitivity'], data['lvdt_p'], data['lvdt_i'], data['lvdt_d'], 
        data['lvdt_polarity'], data['lvdt_offset'], data['lvdt_shunt_check'], data['instructions'], 
        data['critical_failures'], data['man_hours_summary'], data['test_engineer'], data['team_leader'], 
        data['contract_manpower'], data['component_observation'], data['checked_by'], data['technical_manager'], 
        record_id
    ))
    conn.commit()
    conn.close()
    return jsonify({"message": "Record updated"})

@app.route('/record/<int:record_id>', methods=['DELETE'])
def delete_record(record_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM test_records WHERE id = ?', (record_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Record deleted"})

if __name__ == '__main__':
    app.run(debug=True)
