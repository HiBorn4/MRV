import json
import os
import subprocess
import sqlite3
import time
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import uuid

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")  # Ensure WebSockets are enabled


# Global variables for script management
script_running = False
script_process = None
start_time = None  # To track when script started
csv_folder = "csv_files"
# Global variable to store the latest CSV filename
latest_csv_filename = None  # Initialize as None

os.makedirs(csv_folder, exist_ok=True)

# SQLite database helper function
def get_db_connection():
    conn = sqlite3.connect('test_records.db')
    conn.row_factory = sqlite3.Row  # This allows fetching rows as dictionaries
    return conn

@socketio.on("connect")
def handle_connect():
    print("✅ Frontend connected to SocketIO")
    emit("connection_status", {"message": "Connected to backend"}, broadcast=True)

@socketio.on("disconnect")
def handle_disconnect():
    print("❌ Frontend disconnected from SocketIO")

def initialize_database():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS test_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT UNIQUE,
            csv_name TEXT,
            model TEXT,
            start_date TEXT,
            end_date TEXT,
            job_no TEXT,
            test_actuator TEXT,
            max_load TEXT,  -- Changed from REAL to TEXT
            min_load TEXT,  -- Changed from REAL to TEXT
            max_displacement TEXT,  -- Changed from REAL to TEXT
            min_displacement TEXT,  -- Changed from REAL to TEXT
            target TEXT,
            test_objective TEXT,
            test_background TEXT,
            customer TEXT,
            frequency TEXT,
            instructions TEXT,
            critical_failures TEXT,
            test_engineer TEXT,
            test_engineer_man_hours TEXT,
            checked_by TEXT,
            technical_manager TEXT,
            team_leader TEXT,
            contract_manpower TEXT,
            component_observation TEXT,
            loadcell_sensitivity TEXT,  -- Changed from REAL to TEXT
            loadcell_p TEXT,  -- Changed from REAL to TEXT
            loadcell_i TEXT,  -- Changed from REAL to TEXT
            loadcell_d TEXT,  -- Changed from REAL to TEXT
            loadcell_polarity TEXT,
            loadcell_offset TEXT,  -- Changed from REAL to TEXT
            loadcell_shunt_check TEXT,
            lvdt_sensitivity TEXT,  -- Changed from REAL to TEXT
            lvdt_p TEXT,  -- Changed from REAL to TEXT
            lvdt_i TEXT,  -- Changed from REAL to TEXT
            lvdt_d TEXT,  -- Changed from REAL to TEXT
            lvdt_polarity TEXT,
            lvdt_offset TEXT,  -- Changed from REAL to TEXT
            lvdt_shunt_check TEXT
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
        # timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        # job_no = request.json.get("job_no", "default_job")
        # csv_filename = f"{job_no}_{timestamp}.csv"
        csv_filename = latest_csv_filename

        script_path = "main.py"
        script_process = subprocess.Popen(["python", script_path, csv_filename])
        script_running = True
        start_time = time.time()  # Start timer

        socketio.emit("script_status", {"status": "Test Started"})
        print(f"🚀 Script started with CSV: {csv_filename}")

        # Emit event to notify frontend
        socketio.start_background_task(send_elapsed_time)  # Run time counter in background

        return jsonify({"message": "Script started", "csv_file": csv_filename})
    else:
        print("⚠️ Script already running.")
        return jsonify({"message": "Script is already running"}), 400

# @app.route('/start', methods=['POST'])
# def start_script():
#     global script_running, script_process, start_time, latest_csv_filename

#     print("\n📌 [STEP 1] /start API called - Checking script status...")

#     if script_running:
#         print("⚠️ [WARNING] Script is already running. Rejecting new start request.")
#         return jsonify({"message": "Script is already running"}), 400

#     if latest_csv_filename is None:
#         print("❌ [ERROR] No CSV file found! Please create a record first.")
#         return jsonify({"error": "No CSV file generated yet. Please create a record first."}), 400

#     print(f"📄 [INFO] Using CSV file: {latest_csv_filename}")

#     script_path = "main.py"

#     try:
#         # Start script process (commented out for now)
#         # script_process = subprocess.Popen(["python", script_path, latest_csv_filename])
#         script_running = True
#         start_time = time.time()

#         print(f"🚀 [SUCCESS] Script started with CSV: {latest_csv_filename}")
        
#         # Emit updated script status
#         print(f"📡 [EMIT] Sending 'script_status' event with status: Running, CSV: {latest_csv_filename}")
#         socketio.emit("script_status", {"status": "Running", "csv_file": latest_csv_filename})

#         # Start elapsed time counter
#         print("⏳ [INFO] Starting elapsed time counter...")
#         socketio.start_background_task(send_elapsed_time)

#         return jsonify({"message": "Script started", "csv_file": latest_csv_filename})

#     except Exception as e:
#         print(f"❌ [ERROR] Failed to start script: {e}")
#         return jsonify({"error": f"Failed to start script: {e}"}), 500


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

@app.route('/download/<uuid:record_uuid>', methods=['GET'])
def download_csv(record_uuid):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Retrieve the CSV filename for the given UUID
    cursor.execute("SELECT csv_name FROM test_records WHERE uuid = ?", (str(record_uuid),))
    record = cursor.fetchone()
    conn.close()

    if record and record["csv_name"]:
        csv_filename = record["csv_name"]
        file_path = os.path.join(csv_folder, csv_filename)

        if os.path.exists(file_path):
            return send_from_directory(csv_folder, csv_filename, as_attachment=True)
        else:
            return jsonify({"message": "CSV file not found"}), 404
    else:
        return jsonify({"message": "Record not found"}), 404


@app.route('/view/<uuid:record_uuid>', methods=['GET'])
def view_csv(record_uuid):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Retrieve the CSV filename for the given UUID
    cursor.execute("SELECT csv_name FROM test_records WHERE uuid = ?", (str(record_uuid),))
    record = cursor.fetchone()
    conn.close()

    if record and record["csv_name"]:
        csv_filename = record["csv_name"]
        file_path = os.path.join(csv_folder, csv_filename)

        if os.path.exists(file_path):
            return send_file(file_path, mimetype='text/csv')
        else:
            return jsonify({"message": "CSV file not found"}), 404
    else:
        return jsonify({"message": "Record not found"}), 404


@app.route('/record', methods=['POST'])
def create_record():
    print("\n📌 [STEP 1] API /record hit - Processing incoming request...")

    # Get JSON payload
    data = request.json  
    print("\n🔹 [STEP 2] Received Payload:")
    print(json.dumps(data, indent=4))  

    if not data:
        print("❌ [ERROR] Empty payload received!")
        return jsonify({"error": "Empty payload"}), 400

    # Normalize keys: Convert spaces to underscores and lowercase keys
    normalized_data = {key.lower().replace(" ", "_"): value for key, value in data.items()}
    
    print("\n✅ [STEP 3] Normalized Data Keys:")
    for key, value in normalized_data.items():
        print(f"🔍 Key: {key} | Value: {value}")

    # Extract LoadCell and LVDT values properly
    loadcell = normalized_data.get("loadcell", {})
    lvdt = normalized_data.get("lvdt", {})

    # Debugging LoadCell and LVDT
    print("\n🛠 [DEBUG] Extracted LoadCell Values:")
    for key, value in loadcell.items():
        print(f"📦 LoadCell {key}: {value}")

    print("\n🛠 [DEBUG] Extracted LVDT Values:")
    for key, value in lvdt.items():
        print(f"📦 LVDT {key}: {value}")

    # Function to safely convert empty strings to numbers
    def safe_numeric(value, default=0):
        return float(value) if isinstance(value, (int, float)) and value != "" else default

    loadcell_values = (
        str(loadcell.get("Sensitivity", "")), 
        str(loadcell.get("P", "")), 
        str(loadcell.get("I", "")),
        str(loadcell.get("D", "")), 
        str(loadcell.get("Polarity", "")),  
        str(loadcell.get("Offset", "")),    
        str(loadcell.get("Shunt Check", ""))
    )

    lvdt_values = (
        str(lvdt.get("Sensitivity", "")), 
        str(lvdt.get("P", "")), 
        str(lvdt.get("I", "")),
        str(lvdt.get("D", "")), 
        str(lvdt.get("Polarity", "")),  
        str(lvdt.get("Offset", "")),    
        str(lvdt.get("Shunt Check", ""))
    )



    print("\n🔎 [DEBUG] Processed LoadCell Values Tuple:", loadcell_values)
    print("🔎 [DEBUG] Processed LVDT Values Tuple:", lvdt_values)

    # Generate UUID and CSV filename
    record_uuid = str(uuid.uuid4())
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    csv_filename = f"{normalized_data.get('job_no', 'default_job')}_{timestamp}.csv"
    
    global latest_csv_filename
    latest_csv_filename = csv_filename

    print(f"\n🆔 [STEP 4] Generated UUID: {record_uuid}")
    print(f"📄 [STEP 4] Generated CSV Filename: {csv_filename}")

    # Connect to the database
    conn = get_db_connection()
    cursor = conn.cursor()
    print("\n🔗 [STEP 5] Database connection established.")

    # Prepare SQL query
    sql_query = '''
        INSERT INTO test_records (
            uuid, csv_name, job_no, start_date, end_date, technical_manager, test_engineer,
            model, test_actuator, max_load, min_load, max_displacement, min_displacement, 
            target, test_objective, test_background, customer, frequency, 
            instructions, critical_failures, checked_by, team_leader, 
            contract_manpower, component_observation, test_engineer_man_hours,
            loadcell_sensitivity, loadcell_p, loadcell_i, loadcell_d, loadcell_polarity, 
            loadcell_offset, loadcell_shunt_check, lvdt_sensitivity, lvdt_p, lvdt_i, lvdt_d, 
            lvdt_polarity, lvdt_offset, lvdt_shunt_check
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    '''

    # Prepare SQL values (Including LoadCell & LVDT)
    sql_values = (
        record_uuid, csv_filename, normalized_data.get("job_no", ""), 
        normalized_data.get("start_date", ""), 
        normalized_data.get("end_date", ""), 
        normalized_data.get("technical_manager", ""), 
        normalized_data.get("test_engineer", ""), 
        normalized_data.get("model", ""), 
        normalized_data.get("actuator", ""), 
        str(normalized_data.get("max_load", "")), 
        str(normalized_data.get("min_load", "")), 
        str(normalized_data.get("max_displacement", "")), 
        str(normalized_data.get("min_displacement", "")), 
        normalized_data.get("target", ""), 
        normalized_data.get("test_objective", ""), 
        normalized_data.get("test_background", ""),
        normalized_data.get("customer", ""), 
        normalized_data.get("frequency", ""), 
        normalized_data.get("instructions", ""), 
        normalized_data.get("critical_failures", ""), 
        normalized_data.get("checked_by", ""), 
        normalized_data.get("team_leader", ""), 
        normalized_data.get("contract_manpower", ""), 
        normalized_data.get("component_observation", ""), 
        normalized_data.get("test_engineer_man_hours", ""), 
        *loadcell_values, 
        *lvdt_values
    )


    print("\n🔢 [DEBUG] SQL Values List (Before Insert):", sql_values)
    print(f"📝 [DEBUG] Total Values Count: {len(sql_values)}")

    try:
        # Execute SQL insert
        print("\n📌 [STEP 6] Executing SQL Insert...")
        cursor.execute(sql_query, sql_values)
        conn.commit()
        print(f"\n✅ [SUCCESS] SQL Insert Success for UUID: {record_uuid}")
    
    except Exception as e:
        print(f"\n❌ [ERROR] SQL Insert Failed: {e}")
        return jsonify({"error": "Database insert failed"}), 500

    # Fetch all records with the latest one at the top
    print("\n📌 [STEP 7] Fetching all records from database...")
    cursor.execute("""
        SELECT uuid, csv_name, job_no, start_date, end_date, technical_manager, test_engineer 
        FROM test_records 
        ORDER BY id DESC
    """)
    all_records = [dict(row) for row in cursor.fetchall()]

    # Ensure the latest inserted record is placed at the top
    latest_record = {
        "uuid": record_uuid,
        "csv_name": csv_filename,
        "job_no": normalized_data.get("job_no", ""),
        "start_date": normalized_data.get("start_date", ""),
        "end_date": normalized_data.get("end_date", ""),
        "technical_manager": normalized_data.get("technical_manager", ""),
        "test_engineer": normalized_data.get("test_engineer", ""),
    }

    # Insert the latest record at the beginning
    all_records.insert(0, latest_record)

    # Close connection
    conn.close()

    print("\n📤 [STEP 8] Sending All Records (Latest First):")
    print(json.dumps(all_records, indent=4))

    return jsonify(all_records), 201


@app.route('/records', methods=['GET'])
def read_records():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM test_records')
    records = cursor.fetchall()
    conn.close()
    return jsonify([dict(record) for record in records])

@app.route('/record/<uuid:record_uuid>', methods=['PUT'])
def update_record(record_uuid):
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE test_records
        SET model = ?, start_date = ?, end_date = ?, test_actuator = ?, max_load = ?, min_load = ?, max_displacement = ?, min_displacement = ?,
            test_objective = ?, test_background = ?, job_no = ?, customer = ?, frequency = ?, target = ?,
            instructions = ?, critical_failures = ?, test_engineer = ?, checked_by = ?, technical_manager = ?
        WHERE uuid = ?
    ''', (
        data['model'], data['start_date'], data['end_date'], data['test_actuator'], data['max_load'], data['min_load'], 
        data['max_displacement'], data['min_displacement'], data['test_objective'], data['test_background'], 
        data['job_no'], data['customer'], data['frequency'], data['target'], data['instructions'], 
        data['critical_failures'], data['test_engineer'], data['checked_by'], data['technical_manager'], record_uuid
    ))

    conn.commit()
    conn.close()
    return jsonify({"message": "Record updated"})

@app.route('/record/<uuid:record_uuid>', methods=['DELETE'])
def delete_record_and_csv(record_uuid):
    print(f"\n📌 [STEP 1] /delete API called for UUID: {record_uuid}")

    conn = get_db_connection()
    cursor = conn.cursor()

    # Fetch the CSV filename before deleting the record
    print("🔍 [INFO] Fetching record from database...")
    cursor.execute("SELECT csv_name FROM test_records WHERE uuid = ?", (str(record_uuid),))
    record = cursor.fetchone()

    if record:
        csv_filename = record["csv_name"]
        file_path = os.path.join(csv_folder, csv_filename)

        print(f"📄 [INFO] Found record. Associated CSV file: {csv_filename}")

        # Delete record from database
        print("🗑 [INFO] Deleting record from database...")
        cursor.execute("DELETE FROM test_records WHERE uuid = ?", (str(record_uuid),))
        conn.commit()
        conn.close()
        print("✅ [SUCCESS] Record deleted from database.")

        # Delete CSV file if it exists
        if os.path.exists(file_path):
            print(f"🗑 [INFO] Deleting CSV file: {file_path}")
            os.remove(file_path)
            print("✅ [SUCCESS] CSV file deleted.")
            return jsonify({"message": f"Record and file {csv_filename} deleted successfully"})
        else:
            print("⚠️ [WARNING] CSV file not found!")
            return jsonify({"message": "Record deleted, but CSV file not found"}), 200

    else:
        conn.close()
        print("❌ [ERROR] Record not found in database!")
        return jsonify({"message": "Record not found"}), 404

if __name__ == '__main__':
    print("🔥 Starting Flask-SocketIO server...")
    socketio.run(app, debug=True, host="0.0.0.0", port=5000)
