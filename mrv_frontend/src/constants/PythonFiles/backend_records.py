from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

# Helper function to connect to the SQLite database
def get_db_connection():
    conn = sqlite3.connect('test_records.db')
    conn.row_factory = sqlite3.Row  # This allows fetching rows as dictionaries
    return conn

# Create a new record
@app.route('/record', methods=['POST'])
def create_record():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO test_records (model_project, start_date, end_date, test_actuator, load_max, load_min, disp_max, disp_min,
                                  test_objective, test_background, record_no, job_number, customer, frequency, target,
                                  loadcell_sensitivity, loadcell_p, loadcell_i, loadcell_d, loadcell_polarity, loadcell_offset, loadcell_shunt_check,
                                  lvdt_sensitivity, lvdt_p, lvdt_i, lvdt_d, lvdt_polarity, lvdt_offset, lvdt_shunt_check,
                                  instructions, critical_failures, man_hours_summary, test_engineer, team_leader,
                                  contract_manpower, component_observation, checked_by, technical_manager)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data['model_project'], data['start_date'], data['end_date'], data['test_actuator'], data['load_max'], data['load_min'], 
        data['disp_max'], data['disp_min'], data['test_objective'], data['test_background'], data['record_no'], 
        data['job_number'], data['customer'], data['frequency'], data['target'], data['loadcell_sensitivity'], 
        data['loadcell_p'], data['loadcell_i'], data['loadcell_d'], data['loadcell_polarity'], data['loadcell_offset'], 
        data['loadcell_shunt_check'], data['lvdt_sensitivity'], data['lvdt_p'], data['lvdt_i'], data['lvdt_d'], 
        data['lvdt_polarity'], data['lvdt_offset'], data['lvdt_shunt_check'], data['instructions'], 
        data['critical_failures'], data['man_hours_summary'], data['test_engineer'], data['team_leader'], 
        data['contract_manpower'], data['component_observation'], data['checked_by'], data['technical_manager']
    ))
    conn.commit()
    record_id = cursor.lastrowid
    conn.close()
    return jsonify({"message": "Record created", "id": record_id}), 201

# Read all records
@app.route('/records', methods=['GET'])
def read_records():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM test_records')
    records = cursor.fetchall()
    conn.close()
    return jsonify([dict(record) for record in records])

# Update a specific record
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

# Delete a record
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
