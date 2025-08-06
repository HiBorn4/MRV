import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Define the new CSV filename
output_csv = "generated_2hr_47min_data.csv"

# Target duration: 2 hours 47 minutes (10,020 seconds)
num_rows_needed = 10020
start_time = datetime(1970, 1, 1, 0, 0, 0)  # Start from original dataset time

# Observed min-max values from given data (approximated)
load_min_range = (-88.510, -88.210)  # Min Load (kN)
load_max_range = (23.499, 23.662)  # Max Load (kN)
pos_min_range = (-22.478, -22.469)  # Position Min (mm)
pos_max_range = (-21.150, -21.143)  # Position Max (mm)
pos_track_range = (-22.456, -21.183)  # Position Track (mm)
load_track_range = (-86.393, 21.296)  # Loaded Track (kN)
pos_ult_range = (-20.526, -20.526)  # Position Ult Max (mm)
load_ult_range = (43.613, 43.613)  # Loaded Ult Max (kN)
freq_range = (10.000, 10.000)  # Frequency Track (Hz)
cycles_total_start = 4082832.25  # Start cycle
cycles_total_increment = 10  # Increment per second

# Create an empty list to store rows
data = []

# Generate data for each second
for i in range(num_rows_needed):
    timestamp = start_time + timedelta(seconds=i)

    row = [
        timestamp.strftime("%Y-%m-%d %H:%M:%S"),  # Time column
        f"{np.random.uniform(*load_min_range):.3f}kN",  # Load Min
        f"{np.random.uniform(*load_max_range):.3f}kN",  # Load Max
        f"{np.random.uniform(*pos_min_range):.3f}mm",  # Position Min
        f"{np.random.uniform(*pos_max_range):.3f}mm",  # Position Max
        f"{np.random.uniform(*pos_track_range):.3f}mm",  # Position Track
        f"{np.random.uniform(*load_track_range):.3f}kN",  # Loaded Track
        f"{np.random.uniform(*pos_ult_range):.3f}mm",  # Position Ult Max
        f"{np.random.uniform(*load_ult_range):.3f}kN",  # Loaded Ult Max
        f"{np.random.uniform(*freq_range):.3f}Hz",  # Frequency Track
        f"{cycles_total_start + (i * cycles_total_increment):.2f}Cyc"  # Cycles Total
    ]

    data.append(row)

# Define column headers
columns = [
    "Time", "Load Min", "Load Max", "Position Min", "Position Max",
    "Position Track", "Loaded Track", "Position Ult Max", "Loaded Ult Max",
    "Frequency Track", "Cycles Total"
]

# Convert list to DataFrame and save as CSV
df = pd.DataFrame(data, columns=columns)
df.to_csv(output_csv, index=False, sep="\t")

print(f"✅ Successfully generated {output_csv} with {num_rows_needed} rows!")
