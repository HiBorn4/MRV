// Pages/MainReportRenderFile.js
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import axios from "axios";
import SearchBar from "./SearchBar";
import ActiveTestTable from "./ActiveTestTable";
import RecordsTable from "./RecordsTable";

const MainReportRenderFile = () => {
  const [scriptStatus, setScriptStatus] = useState("unknown");
  const [elapsedTime, setElapsedTime] = useState(0);

  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [error, setError] = useState("");

  const [activeTest, setActiveTest] = useState(null);

  useEffect(() => {

    const socket = io("http://127.0.0.1:5000");

    socket.on("connect", () => {
      toast.success("Socket connected!");
      console.log("Socket connected to backend");
    });

    socket.on("script_status", (data) => {
      console.log("Received script_status:", data); // to verify
      setScriptStatus(data.status.toLowerCase());
    });
    

    socket.on("elapsed_time", (data) => {
      setElapsedTime(data.seconds);
      // console.log("Elapsed time:", data.seconds); 
    });

    // 2) Fetch the records once
    fetchAllRecords();

    // Cleanup
    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchAllRecords = async () => {
    try {
      setLoadingRecords(true);
      const response = await axios.get("http://127.0.0.1:5000/records");
      // Suppose the response is an array of records
      if (Array.isArray(response.data) && response.data.length > 0) {
        setRecords(response.data);
        // The first record is the “active” one
        setActiveTest(response.data[0]);
      } else {
        setRecords([]);
        setActiveTest(null);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch records from server.");
      toast.error("Could not load records.");
    } finally {
      setLoadingRecords(false);
    }
  };

  // Helper: Convert seconds -> HH:MM:SS
  const formatElapsed = (secs) => {
    if (!secs || secs < 1) return "00:00:00";
    const hours = Math.floor(secs / 3600).toString().padStart(2, "0");
    const minutes = Math.floor((secs % 3600) / 60).toString().padStart(2, "0");
    const seconds = (secs % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <div className="p-4 shadow-sm">
        {/* <h1 className="text-2xl font-bold text-gray-700 font-georama">Records</h1> */}
        <SearchBar />
      </div>

      {/* Active Test Table */}
      <div className="container p-4 mx-auto max-w-[95%] flex justify-center">
        <ActiveTestTable
          status={scriptStatus}
          elapsedTime={elapsedTime}
          formatElapsed={formatElapsed}
          activeTest={activeTest}
          onActiveTestDeleted={() => {
            // If deleted, just remove it from the records array
            // so it disappears from the UI.
            setRecords((prev) => prev.slice(1));
            // And no longer “activeTest”
            setActiveTest(null);
          }}
        />
      </div>

      {/* Existing Records Table (all except the first one) */}
      <div className="container flex-grow max-w-[95%] p-4 mx-auto">
        {loadingRecords ? (
          <p>Loading records...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <RecordsTable
            // pass the array minus the "first" item
            records={records.slice(1)}
            refreshRecords={fetchAllRecords}
          />
        )}
      </div>
    </div>
  );
};

export default MainReportRenderFile;
