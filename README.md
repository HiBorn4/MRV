# 🛠️ MRV - Machine Runtime Visualizer

![MRV Interface](/public/ui.png)
![Technical Architecture](/public/mrv.drawio.png)

---

## 📌 What is MRV?

**MRV (Machine Runtime Visualizer)** is an intelligent, real-time monitoring and visualization system built to track machine operations using RTSP camera feeds and advanced analytics. It captures and processes runtime data, extracts meaningful insights, and provides an interactive UI for users to monitor machine health and workflow efficiently.

This project is particularly suited for **manufacturing units**, **assembly lines**, and **industrial monitoring**, where precision, uptime, and data integrity are critical.

---

## 🎯 Features

- 📹 Real-time camera feed integration (RTSP)
- 📊 Live plotting of extracted metrics (distance, angle, state, etc.)
- 📥 CSV logging with timestamp and job tracking
- 🔄 State reset API logic if values remain constant for > 2 minutes
- 📁 View and download processed CSV data
- 📦 Full-stack application (React + FastAPI)
- 🧠 Smart event triggers for test resets
- 📈 Insight generation based on captured values
- 💾 Folder structure management for recordings and analytics

---

## 🚀 Use Cases

- Real-time **production line monitoring**
- **Maintenance prediction** through sensor/visual data
- **Quality assurance** via camera-based measurements
- **Workforce efficiency analytics**
- Automated alerts when anomalies or stagnation are detected

---

## 🖥️ Frontend Setup (React)

```bash
cd mrv_frontend

npm install --legacy-peer-deps --ignore-scripts

npm install

npm run dev
````

> Your frontend will now be live at `http://localhost:5173`

---

## ⚙️ Backend Setup (FastAPI)

```bash
cd backend

pip install -r requirements.txt

uvicorn app:app --reload
```

* This will start your FastAPI backend which handles:

  * Recordings
  * CSV generation
  * API calls
  * Insights processing
  * State monitoring

---

## 📦 Additional Backend Scripts

To serve static files (CSV viewer, download links):

```bash
uvicorn main:app --reload
```

For hardware-connected RTSP video camera streaming and live processing:

```bash
python live_main.py
```

> Make sure your camera is connected and RTSP URL is configured properly in the `.env` or config file.

---

## 🎥 Demo (Video walkthrough)

https://github.com/user-attachments/assets/48543ee9-8a0b-4548-8e0e-d5ff693d6e1c

---

## 🧠 Insights Logic

We intelligently monitor the following parameters:

1. ⏱️ **Inactivity Detection:** If machine output values (distance, angle, or state) remain **constant for over 2 minutes**, we auto-trigger a `reset_test` API to ensure fresh test recording.
2. 🧮 **CSV Analytics:** The backend stores readings as structured CSV logs. These can be viewed, downloaded, or used for further analysis.
3. 📈 **Real-Time Plotting:** Users can visualize performance as the camera feeds in live metrics.

---

## 🗂️ Folder Structure

```
MRV/
├── backend/
│   ├── app.py
│   ├── main.py
│   ├── live_main.py
│   ├── utils/
│   └── ...
├── mrv_frontend/
│   └── ...
└── README.md
```

---

## ✅ Tech Stack

* **Frontend:** React, TailwindCSS, Vite
* **Backend:** FastAPI, Uvicorn, OpenCV, Pandas
* **Others:** CSV Logging, Real-time Plotting, RTSP Streaming

---

## 👨‍💻 Author

**Aryan Shirke**
AI/ML & Full-Stack Developer
🔗 [Portfolio](https://aryanshirke.me) • [Upwork](https://www.upwork.com/freelancers/ShirkeAryan) • [GitHub](https://github.com/HiBorn4)

---

## 📬 Want to Collaborate or Deploy MRV?

Feel free to contact me for:

* Custom factory/assembly-line integrations
* Advanced machine learning-based alerts
* Enterprise-grade deployment

> 📩 Email: [aryan.shirke@example.com](mailto:aryan.shirke223@gmail.com)
