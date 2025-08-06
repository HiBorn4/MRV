// components/UpdateRecordModal.js
import React, { useState, useEffect } from "react";
import ConfirmationModal from "./ConfirmationModal";

const UpdateRecordModal = ({ isOpen, record, onClose, onSubmit }) => {
  const [general, setGeneral] = useState({});
  const [loadCell, setLoadCell] = useState({});
  const [lvdt, setLvdt] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (record) {
      // Extract LoadCell and LVDT; the rest go to general
      const { LoadCell, LVDT, ...generalFields } = record;
      setGeneral(generalFields);
      setLoadCell(LoadCell || {});
      setLvdt(LVDT || {});
    }
  }, [record]);

  // Handlers for changes
  const handleGeneralChange = (key, value) => {
    setGeneral((prev) => ({ ...prev, [key]: value }));
  };
  const handleLoadCellChange = (key, value) => {
    setLoadCell((prev) => ({ ...prev, [key]: value }));
  };
  const handleLvdtChange = (key, value) => {
    setLvdt((prev) => ({ ...prev, [key]: value }));
  };

  // When the user clicks Save, we show a confirmation modal
  const handleSave = () => {
    setShowConfirm(true);
  };

  const confirmSave = () => {
    const updatedRecord = {
      ...general,
      LoadCell: loadCell,
      LVDT: lvdt,
    };
    onSubmit(updatedRecord);
    setShowConfirm(false);
    onClose();
  };

  const cancelConfirm = () => {
    setShowConfirm(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto bg-black bg-opacity-50">
        <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
          <h3 className="mb-4 text-2xl font-bold text-center">Edit Record</h3>

          {/* General Information Table */}
          <div className="mb-6">
            <h4 className="mb-2 text-lg font-semibold">General Information</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-collapse border-gray-200">
                <tbody className="divide-y divide-gray-200">
                  {Object.keys(general).map((key) => (
                    <tr key={key} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-700 border border-gray-200">
                        {key}
                      </td>
                      <td className="px-4 py-2 border border-gray-200">
                        <input
                          type="text"
                          value={general[key] || ""}
                          onChange={(e) =>
                            handleGeneralChange(key, e.target.value)
                          }
                          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* LoadCell Information Table */}
          <div className="mb-6">
            <h4 className="mb-2 text-lg font-semibold">LoadCell Information</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-collapse border-gray-200">
                <tbody className="divide-y divide-gray-200">
                  {Object.keys(loadCell).map((key) => (
                    <tr key={key} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-700 border border-gray-200">
                        {key}
                      </td>
                      <td className="px-4 py-2 border border-gray-200">
                        <input
                          type="text"
                          value={loadCell[key] || ""}
                          onChange={(e) =>
                            handleLoadCellChange(key, e.target.value)
                          }
                          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* LVDT Information Table */}
          <div className="mb-6">
            <h4 className="mb-2 text-lg font-semibold">LVDT Information</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-collapse border-gray-200">
                <tbody className="divide-y divide-gray-200">
                  {Object.keys(lvdt).map((key) => (
                    <tr key={key} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-700 border border-gray-200">
                        {key}
                      </td>
                      <td className="px-4 py-2 border border-gray-200">
                        <input
                          type="text"
                          value={lvdt[key] || ""}
                          onChange={(e) =>
                            handleLvdtChange(key, e.target.value)
                          }
                          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 font-semibold text-gray-800 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={showConfirm}
        title="Confirm Update"
        message="Are you sure you want to update this record?"
        onConfirm={confirmSave}
        onCancel={cancelConfirm}
      />
    </>
  );
};

export default UpdateRecordModal;
