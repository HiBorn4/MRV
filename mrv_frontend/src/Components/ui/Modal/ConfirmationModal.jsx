import React, { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { startTest, sendTestRecords } from "../../services/api";

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  testDetails = {} 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      // 1) Send all test details to your backend (if needed)
      await sendTestRecords(testDetails);

      // 2) Trigger 'startTest' without passing jobNo
      await startTest();

      // Then finish up
      setTimeout(() => {
        setIsLoading(false);
        onConfirm();
      }, 3000);
    } catch (error) {
      console.error("Error starting test:", error);
      setIsLoading(false);
    }
  };
  

  // Exactly match the keys you're passing in:
  const {
    Model,
    "Start Date": StartDate,
    "End Date": EndDate,
    Actuator,
    "Max Load": MaxLoad,
    "Min Load": MinLoad,
    "Max Displacement": MaxDisp,
    "Min Displacement": MinDisp,
    "Test Objective": TestObjective,
    "Test Background": TestBackground,
    "Job No": JobNo,
    Customer,
    Frequency,
    Target,
    Instructions,
    "Critical Failures": CriticalFailures,
    "Test Engineer": TestEngineer,
    "Test Engineer Man Hours": TestEngineerManHours,
    "Team Leader": TeamLeader,
    "Contract Manpower": ContractManpower,
    "Component Observation": ComponentObservation,
    "Checked By": CheckedBy,
    "Technical Manager": TechnicalManager,

    // For LoadCell and LVDT:
    LoadCell = {},
    LVDT = {},
  } = testDetails;

  // Build main test details in a 2D array for table rendering
  const mainTestDetails = [
    ["Model / Project", Model],
    ["Start Date", StartDate],
    ["End Date", EndDate],
    ["Test Actuator", Actuator],
    ["Max Load", MaxLoad],
    ["Min Load", MinLoad],
    ["Max Displacement", MaxDisp],
    ["Min Displacement", MinDisp],
    ["Test Objective", TestObjective],
    ["Test Background", TestBackground],
    ["Job Number", JobNo],
    ["Customer", Customer],
    ["Frequency", Frequency],
    ["Target", Target],
    ["Instructions", Instructions],
    ["Critical Failures", CriticalFailures],
    ["Test Engineer", TestEngineer],
    ["Test Engineer Man Hours", TestEngineerManHours],
    ["Team Leader", TeamLeader],
    ["Contract Manpower", ContractManpower],
    ["Component Observation", ComponentObservation],
    ["Checked By", CheckedBy],
    ["Technical Manager", TechnicalManager],
  ];

  // Build LoadCell table
  const loadCellDetails = [
    ["Sensitivity", LoadCell.Sensitivity],
    ["P", LoadCell.P],
    ["I", LoadCell.I],
    ["D", LoadCell.D],
    ["Polarity", LoadCell.Polarity],
    ["Offset", LoadCell.Offset],
    ["Shunt Check", LoadCell["Shunt Check"]],
  ];

  // Build LVDT table
  const lvdtDetails = [
    ["Sensitivity", LVDT.Sensitivity],
    ["P", LVDT.P],
    ["I", LVDT.I],
    ["D", LVDT.D],
    ["Polarity", LVDT.Polarity],
    ["Offset", LVDT.Offset],
    ["Shunt Check", LVDT["Shunt Check"]],
  ];

  // Helper: decide if we should show the LoadCell table
  const showLoadCellTable = Object.values(LoadCell).some((val) => val !== null && val !== undefined && val !== "");
  
  // Helper: decide if we should show the LVDT table
  const showLVDTTable = Object.values(LVDT).some((val) => val !== null && val !== undefined && val !== "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-5xl p-6 bg-white shadow-2xl rounded-xl"
      >
        {/* Close Button */}
        <button
          className="absolute p-2 text-gray-500 top-3 right-3 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Modal Title */}
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">
          Confirm Test Details
        </h2>

        {/* Scrollable Area */}
        <div className="p-4 overflow-y-auto border rounded-lg shadow-inner bg-gray-50 max-h-[70vh]">
          {/* Main Test Details */}
          <h3 className="mb-2 text-lg font-bold text-gray-700 underline underline-offset-4">
            Main Test Details
          </h3>
          <table className="w-full mb-6 text-sm border border-gray-300 table-auto">
            <thead className="bg-gray-200 border-b border-gray-300">
              <tr>
                <th className="px-3 py-2 font-semibold text-left text-gray-700">Label</th>
                <th className="px-3 py-2 font-semibold text-left text-gray-700">Value</th>
              </tr>
            </thead>
            <tbody>
              {mainTestDetails.map(([label, value]) => (
                <tr key={label} className="border-b last:border-none">
                  <td className="w-1/2 px-3 py-2 font-medium text-gray-700">{label}</td>
                  <td className="w-1/2 px-3 py-2 text-gray-800">
                    {/* If value is null or empty, show 'N/A' */}
                    {value || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* LoadCell Settings (only if at least one entry is present) */}
          {showLoadCellTable && (
            <>
              <h3 className="mb-2 text-lg font-bold text-gray-700 underline underline-offset-4">
                LoadCell Settings
              </h3>
              <table className="w-full mb-6 text-sm border border-gray-300 table-auto">
                <thead className="bg-gray-200 border-b border-gray-300">
                  <tr>
                    <th className="px-3 py-2 font-semibold text-left text-gray-700">Label</th>
                    <th className="px-3 py-2 font-semibold text-left text-gray-700">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {loadCellDetails.map(([label, value]) => (
                    <tr key={label} className="border-b last:border-none">
                      <td className="w-1/2 px-3 py-2 font-medium text-gray-700">{label}</td>
                      <td className="w-1/2 px-3 py-2 text-gray-800">
                        {value || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* LVDT Settings (only if at least one entry is present) */}
          {showLVDTTable && (
            <>
              <h3 className="mb-2 text-lg font-bold text-gray-700 underline underline-offset-4">
                LVDT Settings
              </h3>
              <table className="w-full text-sm border border-gray-300 table-auto">
                <thead className="bg-gray-200 border-b border-gray-300">
                  <tr>
                    <th className="px-3 py-2 font-semibold text-left text-gray-700">Label</th>
                    <th className="px-3 py-2 font-semibold text-left text-gray-700">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {lvdtDetails.map(([label, value]) => (
                    <tr key={label} className="border-b last:border-none">
                      <td className="w-1/2 px-3 py-2 font-medium text-gray-700">{label}</td>
                      <td className="w-1/2 px-3 py-2 text-gray-800">
                        {value || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* If nothing was provided at all: */}
          {Object.keys(testDetails).length === 0 && (
            <p className="mt-4 text-center text-gray-500">
              No test details provided.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            className="px-4 py-2 text-gray-700 transition bg-gray-200 rounded-lg hover:bg-gray-300"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 text-white transition rounded-lg ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Starting..." : "Confirm & Start"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmationModal;
