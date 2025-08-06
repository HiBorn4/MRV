import sqlite3
from datetime import datetime

# Connect to SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('test_records.db')
cursor = conn.cursor()

# Create the table if it doesn't exist
cursor.execute('''
CREATE TABLE IF NOT EXISTS test_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    model_project TEXT,
    start_date DATE,
    end_date DATE,
    test_actuator TEXT,
    load_max INTEGER,
    load_min INTEGER,
    disp_max INTEGER,
    disp_min INTEGER,
    test_objective TEXT,
    test_background TEXT,
    record_no TEXT,
    job_number TEXT,
    customer TEXT,
    frequency TEXT,
    target TEXT,
    loadcell_sensitivity TEXT,
    loadcell_p REAL,
    loadcell_i REAL,
    loadcell_d REAL,
    loadcell_polarity TEXT,
    loadcell_offset REAL,
    loadcell_shunt_check TEXT,
    lvdt_sensitivity TEXT,
    lvdt_p REAL,
    lvdt_i REAL,
    lvdt_d REAL,
    lvdt_polarity TEXT,
    lvdt_offset REAL,
    lvdt_shunt_check TEXT,
    instructions TEXT,
    critical_failures TEXT,
    man_hours_summary TEXT,
    test_engineer TEXT,
    team_leader TEXT,
    contract_manpower TEXT,
    component_observation TEXT,
    checked_by TEXT,
    technical_manager TEXT
);
''')

# Commit changes and close the connection
conn.commit()

def create_record(data):
    """ Insert a new record into the test_records table. """
    cursor.execute('''
    INSERT INTO test_records (model_project, start_date, end_date, test_actuator, load_max, load_min, disp_max, disp_min,
                              test_objective, test_background, record_no, job_number, customer, frequency, target,
                              loadcell_sensitivity, loadcell_p, loadcell_i, loadcell_d, loadcell_polarity, loadcell_offset, loadcell_shunt_check,
                              lvdt_sensitivity, lvdt_p, lvdt_i, lvdt_d, lvdt_polarity, lvdt_offset, lvdt_shunt_check,
                              instructions, critical_failures, man_hours_summary, test_engineer, team_leader,
                              contract_manpower, component_observation, checked_by, technical_manager)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', data)
    conn.commit()

def read_records():
    """ Retrieve all records from the test_records table. """
    cursor.execute('SELECT * FROM test_records')
    return cursor.fetchall()

def update_record(record_id, updated_data):
    """ Update a specific record in the test_records table. """
    cursor.execute('''
    UPDATE test_records
    SET model_project = ?, start_date = ?, end_date = ?, test_actuator = ?, load_max = ?, load_min = ?, disp_max = ?, disp_min = ?,
        test_objective = ?, test_background = ?, record_no = ?, job_number = ?, customer = ?, frequency = ?, target = ?,
        loadcell_sensitivity = ?, loadcell_p = ?, loadcell_i = ?, loadcell_d = ?, loadcell_polarity = ?, loadcell_offset = ?, loadcell_shunt_check = ?,
        lvdt_sensitivity = ?, lvdt_p = ?, lvdt_i = ?, lvdt_d = ?, lvdt_polarity = ?, lvdt_offset = ?, lvdt_shunt_check = ?,
        instructions = ?, critical_failures = ?, man_hours_summary = ?, test_engineer = ?, team_leader = ?, contract_manpower = ?,
        component_observation = ?, checked_by = ?, technical_manager = ?
    WHERE id = ?
    ''', (*updated_data, record_id))
    conn.commit()

def delete_record(record_id):
    """ Delete a specific record from the test_records table. """
    cursor.execute('DELETE FROM test_records WHERE id = ?', (record_id,))
    conn.commit()

# Example usage
if __name__ == "__main__":
    # Example data for a new record
    new_record = (
        "Sample Project", "2025-01-15", "2025-01-20", "Test Actuator Details", 100, 10, 5, 1,
        "Objective details", "Background details", "MRV/123456", "Job123", "Sample Customer", "50Hz", "100N",
        "0.001", 1.0, 0.1, 0.01, "Positive", 0.0, "Check123", "0.002", 1.1, 0.2, 0.02, "Negative", 0.0, "Check456",
        "Sample Instructions", "No critical failures", "8 hours", "John Doe", "Jane Smith",
        "3 workers", "Observation details", "Checked by John", "Technical Manager"
    )
    create_record(new_record)

    # Fetch all records
    records = read_records()
    print(records)

    # Update a record
    updated_data = (
        "Updated Project", "2025-01-16", "2025-01-21", "Updated Actuator Details", 200, 20, 10, 2,
        "Updated objective", "Updated background", "MRV/654321", "Job321", "Updated Customer", "60Hz", "200N",
        "0.002", 2.0, 0.2, 0.02, "Negative", 0.1, "Check789", "0.003", 2.1, 0.3, 0.03, "Positive", 0.1, "Check987",
        "Updated Instructions", "Some critical failures", "10 hours", "Alice Doe", "Bob Smith",
        "5 workers", "Updated observation", "Checked by Alice", "Senior Manager"
    )
    update_record(1, updated_data)

    # Delete a record
    delete_record(1)
