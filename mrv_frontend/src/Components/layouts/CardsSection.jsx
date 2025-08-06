import React, { useState } from "react";
import { CardOne } from "./CardOne";
import { CardTwo } from "./CardTwo";
import { CardThree } from "./CardThree";
import { EntryField } from "../ui/EntryField";
import ConfirmationModal from "../ui/Modal/ConfirmationModal";
import { startTest } from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  testEngineerOptions,
  technicalManagerOptions,
} from "../../constants/dropdownOptions";

export const CardsSection = () => {
  const navigate = useNavigate();

  // -----------------------------
  // States for CardOne
  // -----------------------------
  const [modelName, setModelName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [testActuator, setTestActuator] = useState("");
  const [maxLoad, setMaxLoad] = useState("");
  const [minLoad, setMinLoad] = useState("");
  const [maxDisp, setMaxDisp] = useState("");
  const [minDisp, setMinDisp] = useState("");
  const [testObjective, setTestObjective] = useState("");
  const [testBackground, setTestBackground] = useState("");

  // -----------------------------
  // States for CardTwo
  // -----------------------------
  const [jobNo, setJobNo] = useState("");
  const [customer, setCustomer] = useState("");
  const [frequency, setFrequency] = useState("");
  const [target, setTarget] = useState("");

  // LoadCell
  const [sensitivityforloadcell, setSensitivityForLoadCell] = useState("");
  const [Pforloadcell, setPForLoadCell] = useState("");
  const [Iforloadcell, setIForLoadCell] = useState("");
  const [Dforloadcell, setDForLoadCell] = useState("");
  const [Polarityforloadcell, setPolarityForLoadCell] = useState("");
  const [Offsetforloadcell, setOffsetForLoadCell] = useState("");
  const [ShuntCheckforloadcell, setShuntCheckForLoadCell] = useState("");

  // LVDT
  const [sensitivityforlvdt, setSensitivityForLVDT] = useState("");
  const [Pforlvdt, setPForLVDT] = useState("");
  const [Iforlvdt, setIForLVDT] = useState("");
  const [Dforlvdt, setDForLVDT] = useState("");
  const [Polarityforlvdt, setPolarityForLVDT] = useState("");
  const [Offsetforlvdt, setOffsetForLVDT] = useState("");
  const [ShuntCheckforlvdt, setShuntCheckForLVDT] = useState("");

  // -----------------------------
  // States for CardThree
  // -----------------------------
  const [instructions, setInstructions] = useState("");
  const [criticalFailures, setCriticalFailures] = useState("");
  const [testEngineer, setTestEngineer] = useState("");
  const [checkedBy, setCheckedBy] = useState("");
  const [technicalManager, setTechnicalManager] = useState("");
  const [teamLeader, setTeamLeader] = useState("");
  const [contractManpower, setContractManpower] = useState("");
  const [componentObservation, setComponentObservation] = useState("");
  const [testEngineerManHours, setTestEngineerManHours] = useState("");

  // -----------------------------
  // Additional states
  // -----------------------------
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // -----------------------------
  // Handlers
  // -----------------------------
  const handleStartTest = () => {
    setIsModalOpen(true);
  };

  const confirmStartTest = async () => {
    setIsTestStarted(true);
    setIsModalOpen(false);
  
    try {
      // Pass jobNo to the startTest function
      await startTest();
      setTimeout(() => navigate("/main-report"), 2000);
    } catch (error) {
      console.error("Failed to start test:", error);
      setIsTestStarted(false);
    }
  };
  

  return (
    <section className="w-full max-w-full p-4 mx-auto">
      <div className="grid items-stretch grid-cols-1 gap-6 md:grid-cols-3">
        {/* Card One */}
        <CardOne
          modelName={modelName}
          setModelName={setModelName}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          testActuator={testActuator}
          setTestActuator={setTestActuator}
          maxLoad={maxLoad}
          setMaxLoad={setMaxLoad}
          minLoad={minLoad}
          setMinLoad={setMinLoad}
          maxDisp={maxDisp}
          setMaxDisp={setMaxDisp}
          minDisp={minDisp}
          setMinDisp={setMinDisp}
          testObjective={testObjective}
          setTestObjective={setTestObjective}
          testBackground={testBackground}
          setTestBackground={setTestBackground}
        />

        {/* Card Two */}
        <CardTwo
          jobNo={jobNo}
          setJobNo={setJobNo}
          customer={customer}
          setCustomer={setCustomer}
          frequency={frequency}
          setFrequency={setFrequency}
          target={target}
          setTarget={setTarget}
          // LoadCell
          sensitivityforloadcell={sensitivityforloadcell}
          setSensitivityForLoadCell={setSensitivityForLoadCell}
          Pforloadcell={Pforloadcell}
          setPForLoadCell={setPForLoadCell}
          Iforloadcell={Iforloadcell}
          setIForLoadCell={setIForLoadCell}
          Dforloadcell={Dforloadcell}
          setDForLoadCell={setDForLoadCell}
          Polarityforloadcell={Polarityforloadcell}
          setPolarityForLoadCell={setPolarityForLoadCell}
          Offsetforloadcell={Offsetforloadcell}
          setOffsetForLoadCell={setOffsetForLoadCell}
          ShuntCheckforloadcell={ShuntCheckforloadcell}
          setShuntCheckForLoadCell={setShuntCheckForLoadCell}
          // LVDT
          sensitivityforlvdt={sensitivityforlvdt}
          setSensitivityForLVDT={setSensitivityForLVDT}
          Pforlvdt={Pforlvdt}
          setPForLVDT={setPForLVDT}
          Iforlvdt={Iforlvdt}
          setIForLVDT={setIForLVDT}
          Dforlvdt={Dforlvdt}
          setDForLVDT={setDForLVDT}
          Polarityforlvdt={Polarityforlvdt}
          setPolarityForLVDT={setPolarityForLVDT}
          Offsetforlvdt={Offsetforlvdt}
          setOffsetForLVDT={setOffsetForLVDT}
          ShuntCheckforlvdt={ShuntCheckforlvdt}
          setShuntCheckForLVDT={setShuntCheckForLVDT}
        />

        {/* Card Three */}
        <div className="flex flex-col h-full">
          <CardThree
            instructions={instructions}
            setInstructions={setInstructions}
            criticalFailiurtes={criticalFailures}
            setCriticalFailiurtes={setCriticalFailures}
            testEngineer={testEngineer}
            setTestEngineer={setTestEngineer}
            testEngineerManHours={testEngineerManHours}
            setTestEngineerManHours={setTestEngineerManHours}
            teamLeader={teamLeader}
            setTeamLeader={setTeamLeader}
            contractManpower={contractManpower}
            setContractManpower={setContractManpower}
            componentObservation={componentObservation}
            setComponentObservation={setComponentObservation}
            checkedBy={checkedBy}
            setCheckedBy={setCheckedBy}
            technicalManager={technicalManager}
            setTechnicalManager={setTechnicalManager}
          />

          {/* Additional Fields */}
          <div className="flex p-2 mt-2 border border-black rounded-xl">
            <div className="flex flex-col gap-1 mr-4">
              <EntryField
                label="Test Engineer"
                value={testEngineer}
                placeholder="Enter Details here"
                onChange={(e) => setTestEngineer(e.target.value)}
                options={testEngineerOptions}
              />

              <EntryField
                label="Checked By"
                value={checkedBy}
                placeholder="Enter Details here"
                onChange={(e) => setCheckedBy(e.target.value)}
              />

              <EntryField
                label="Technical Manager"
                value={technicalManager}
                placeholder="Enter Details here"
                onChange={(e) => setTechnicalManager(e.target.value)}
                options={technicalManagerOptions}
              />
            </div>

            {/* Start Test Button */}
            <div className="flex justify-center">
              <button
                onClick={handleStartTest}
                className={`relative px-6 py-3 text-white rounded-md w-32 font-georama text-lg transition-all duration-300 ease-in-out transform 
                  ${
                    isTestStarted
                      ? "bg-yellow-600 hover:bg-yellow-500 hover:shadow-lg hover:shadow-yellow-400/50 active:scale-95"
                      : "bg-green-700 hover:bg-green-600 hover:shadow-lg hover:shadow-green-400/50 active:scale-95"
                  }
                `}
              >
                <span className="relative z-10">
                  {isTestStarted ? "Test Started" : "Start Test"}
                </span>
                <span className="absolute inset-0 transition-opacity duration-300 bg-white rounded-md opacity-10 blur-lg hover:opacity-20"></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmStartTest}
        testDetails={{
          Model: modelName,
          "Start Date": startDate,
          "End Date": endDate,
          Actuator: testActuator,
          "Max Load": maxLoad,
          "Min Load": minLoad,
          "Max Displacement": maxDisp,
          "Min Displacement": minDisp,
          "Test Objective": testObjective,
          "Test Background": testBackground,
          "Job No": jobNo,
          Customer: customer,
          Frequency: frequency,
          Target: target,
          Instructions: instructions,
          "Critical Failures": criticalFailures,
          "Test Engineer": testEngineer,
          "Test Engineer Man Hours": testEngineerManHours,
          "Team Leader": teamLeader,
          "Contract Manpower": contractManpower,
          "Component Observation": componentObservation,
          "Checked By": checkedBy,
          "Technical Manager": technicalManager,
        
          LoadCell: {
            Sensitivity: sensitivityforloadcell,
            P: Pforloadcell,
            I: Iforloadcell,
            D: Dforloadcell,
            Polarity: Polarityforloadcell,
            Offset: Offsetforloadcell,
            "Shunt Check": ShuntCheckforloadcell,
          },
        
          LVDT: {
            Sensitivity: sensitivityforlvdt,
            P: Pforlvdt,
            I: Iforlvdt,
            D: Dforlvdt,
            Polarity: Polarityforlvdt,
            Offset: Offsetforlvdt,
            "Shunt Check": ShuntCheckforlvdt,
          },
        }}
        
      />
    </section>
  );
};

