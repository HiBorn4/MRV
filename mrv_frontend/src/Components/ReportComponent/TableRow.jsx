// components/TableRow.js
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Actions from "./Actions";
import ConfirmationModal from "./ConfirmationModal";
import UpdateRecordModal from "./UpdateRecordModal";

const TableRow = ({ record, srNo, refreshRecords }) => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [csvContent, setCsvContent] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // =========== ACTION HANDLERS ===========
  const handleView = async () => {
    if (!record.uuid) {
      toast.error("No UUID found.");
      return;
    }
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/view/${record.uuid}`,
        { responseType: "text" }
      );
      console.log("View API response:", res.data);  // <-- log your response here
      setCsvContent(res.data);
      setShowViewModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch CSV.");
    }
  };
  
  
  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:5000/record/${record.uuid}`);
      toast.success("Record deleted successfully");
      refreshRecords && refreshRecords();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting record");
    }
    setShowDeleteConfirm(false);
  };
  
  const handleEdit = () => {
    setShowEditModal(true);
  };
  
  const submitEditForm = async (updatedRecord) => {
    try {
      await axios.put(`http://127.0.0.1:5000/record/${record.uuid}`, updatedRecord);
      toast.success("Record updated successfully!");
      setShowEditModal(false);
      refreshRecords && refreshRecords();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update record");
    }
  };
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };
  
  const handleDownload = () => {
    if (!record.uuid) {
      toast.error("No UUID to download.");
      return;
    }
    window.open(`http://127.0.0.1:5000/view/${record.uuid}`, "_blank");
  };
  

  return (
    <>
      <tr className="transition-colors bg-white hover:bg-gray-50 font-georamalight">
        <td className="px-4 py-2 border-b border-gray-200">{srNo}</td>
        <td className="px-4 py-2 border-b border-gray-200">{record.job_no}</td>
        <td className="px-4 py-2 border-b border-gray-200">{record.start_date}</td>
        <td className="px-4 py-2 border-b border-gray-200">{record.end_date}</td>
        <td className="px-4 py-2 border-b border-gray-200">{record.csv_name}</td>
        <td className="px-4 py-2 border-b border-gray-200">{record.tech_manager}</td>
        <td className="px-4 py-2 border-b border-gray-200">{record.tech_engineer}</td>
        <td className="px-4 py-2 border-b border-gray-200">
          <Actions
            onView={handleView}
            onDelete={handleDelete}
            onDownload={() => {
              if (!record.csv_name) {
                toast.error("No CSV to download.");
                return;
              }
              window.open(
                `http://127.0.0.1:5000/view/${record.uuid}`,
                "_blank"
              );
            }}
            onEdit={handleEdit}
          />
        </td>
      </tr>

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
          record={record}
          onClose={() => setShowEditModal(false)}
          onSubmit={submitEditForm}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Confirm Delete"
        message="Are you sure you want to delete this record?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
};

export default TableRow;
