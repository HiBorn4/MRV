// Pages/ActiveTestTable.js
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Actions from "./Actions";
import ConfirmationModal from "./ConfirmationModal";
import UpdateRecordModal from "./UpdateRecordModal";

const ActiveTestTable = ({
  status,
  elapsedTime,
  formatElapsed,
  activeTest,
  onActiveTestDeleted,
}) => {
  if (!activeTest) {
    return (
      <div className="p-4 mb-4 bg-white border border-gray-200 shadow-lg rounded-xl">
        <h2 className="mb-3 text-lg font-bold text-gray-700">
          Current Test (Active)
        </h2>
        <p className="text-gray-500">No active test found.</p>
      </div>
    );
  }

  const isRunning = status === "running";

  // Local state for modals
  const [showViewModal, setShowViewModal] = useState(false);
  const [csvContent, setCsvContent] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ---------- ACTION HANDLERS ----------
  const handleStop = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/stop");
      toast.success(res.data.message);
    } catch (err) {
      toast.error("Failed to stop script");
    }
  };
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };
  
  const handleView = async () => {
    if (!activeTest.uuid) {
      toast.error("No UUID found for this record.");
      return;
    }
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/view/${activeTest.uuid}`,
        { responseType: "text" }
      );
      console.log("View API response:", res.data);  // <-- Now you can see the result
      setCsvContent(res.data);
      setShowViewModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load CSV from server.");
    }
  };
  
  
  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:5000/record/${activeTest.uuid}`);
      toast.success("Active test deleted successfully");
      onActiveTestDeleted && onActiveTestDeleted();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting active test");
    }
    setShowDeleteConfirm(false);
  };
  
  const handleEdit = () => {
    setShowEditModal(true);
  };
  
  const submitEditForm = async (updatedRecord) => {
    try {
      await axios.put(`http://127.0.0.1:5000/record/${activeTest.uuid}`, updatedRecord);
      toast.success("Record updated successfully!");
      Object.assign(activeTest, updatedRecord);
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update record");
    }
  };
  

  // Destructure safe fields
  const {
    job_no = "N/A",
    start_date = "N/A",
    end_date = "N/A",
    csv_name = "N/A",
    tech_manager = "N/A",
    tech_engineer = "N/A",
  } = activeTest || {};

  return (
    <div className="p-4 mb-4 bg-white border border-gray-200 shadow-lg rounded-xl font-georama">
      <h2 className="mb-3 text-lg font-bold text-gray-700">
        Current Test (Active)
      </h2>
      <table className="w-full text-sm border-separate table-auto border-spacing-0">
        <thead className="bg-gradient-to-r from-gray-200 to-gray-300">
          <tr>
            <th className="px-4 py-2 font-semibold text-gray-800 border-b border-gray-300">
              Job No
            </th>
            <th className="px-4 py-2 font-semibold text-gray-800 border-b border-gray-300">
              Start Date
            </th>
            <th className="px-4 py-2 font-semibold text-gray-800 border-b border-gray-300">
              End Date
            </th>
            <th className="px-4 py-2 font-semibold text-gray-800 border-b border-gray-300">
              CSV Name
            </th>
            <th className="px-4 py-2 font-semibold text-gray-800 border-b border-gray-300">
              Tech Manager
            </th>
            <th className="px-4 py-2 font-semibold text-gray-800 border-b border-gray-300">
              Tech Engineer
            </th>
            <th className="px-4 py-2 font-semibold text-gray-800 border-b border-gray-300">
              Status
            </th>
            <th className="px-4 py-2 font-semibold text-gray-800 border-b border-gray-300">
              Elapsed Time
            </th>
            <th className="px-4 py-2 font-semibold text-gray-800 border-b border-gray-300">
              Stop
            </th>
            <th className="px-4 py-2 font-semibold text-gray-800 border-b border-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="transition-colors bg-white hover:bg-gray-50">
            <td className="px-4 py-2 border-b border-gray-200">{job_no}</td>
            <td className="px-4 py-2 border-b border-gray-200">{start_date}</td>
            <td className="px-4 py-2 border-b border-gray-200">{end_date}</td>
            <td className="px-4 py-2 border-b border-gray-200">{csv_name}</td>
            <td className="px-4 py-2 border-b border-gray-200">{tech_manager}</td>
            <td className="px-4 py-2 border-b border-gray-200">{tech_engineer}</td>
            <td className="px-4 py-2 border-b border-gray-200">
              {status === "running" && (
                <span className="px-2 py-1 text-green-800 bg-green-100 rounded-full">
                  Running
                </span>
              )}
              {status === "stopped" && (
                <span className="px-2 py-1 text-red-800 bg-red-100 rounded-full">
                  Stopped
                </span>
              )}
              {status === "unknown" && (
                <span className="px-2 py-1 text-gray-800 bg-gray-100 rounded-full">
                  Unknown
                </span>
              )}
            </td>
            <td className="px-4 py-2 border-b border-gray-200">
              {formatElapsed(elapsedTime)}
            </td>
            <td className="px-4 py-2 border-b border-gray-200">
              <button
                onClick={handleStop}
                disabled={!isRunning}
                className={`px-4 py-1 font-semibold text-white rounded-lg transition-colors ${
                  isRunning
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Stop
              </button>
            </td>
            <td className="px-4 py-2 border-b border-gray-200">
              <Actions
                onView={handleView}
                onDelete={handleDelete}
                onDownload={() => {
                  if (!activeTest.uuid) {
                    toast.error("No UUID found for download.");
                    return;
                  }
                  window.open(
                    `http://127.0.0.1:5000/view/${activeTest.uuid}`,
                    "_blank"
                  );
                }}
                onEdit={handleEdit}
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* VIEW CSV Modal */}
      {showViewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-2xl p-4 bg-white rounded-lg shadow-lg">
            <h3 className="mb-2 text-lg font-bold">CSV Content</h3>
            <pre className="p-2 overflow-auto bg-gray-100 rounded max-h-96">
              {csvContent}
            </pre>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 font-semibold text-white bg-gray-600 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT (Update) Modal */}
      {showEditModal && (
        <UpdateRecordModal
          isOpen={showEditModal}
          record={activeTest}
          onClose={() => setShowEditModal(false)}
          onSubmit={submitEditForm}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Confirm Delete"
        message="Are you sure you want to delete this active test?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default ActiveTestTable;
