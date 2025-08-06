// CardThree.jsx
import React from "react";
import { Card } from "../ui/Card";
import { EntryField } from "../ui/EntryField";
import {
  testEngineerOptions,
  teamLeaderOptions,
  contractAssociateManpowerOptions,
} from "../../constants/dropdownOptions";

export const CardThree = ({ // Changed from 'export default' to 'export const'
  instructions,
  setInstructions,
  criticalFailiurtes,
  setCriticalFailiurtes,
  testEngineer,
  setTestEngineer,
  teamLeader,
  setTeamLeader,
  contractManpower,
  setContractManpower,
  componentObservation,
  setComponentObservation,
  testEngineerManHours,
  setTestEngineerManHours,
  checkedBy,
  setCheckedBy,
  technicalManager,
  setTechnicalManager,
}) => {
  return (
    <Card>
      <EntryField
        label="Instructions"
        value={instructions}
        placeholder="Enter Details here"
        onChange={(e) => setInstructions(e.target.value)}
      />
      <EntryField
        label="Critical Failures"
        value={criticalFailiurtes}
        placeholder="Enter Details here"
        onChange={(e) => setCriticalFailiurtes(e.target.value)}
      />
      <p className="flex justify-center mt-2 text-lg font-bold text-center font-georama">
        Man Hours Summary
      </p>
      <EntryField
        label="Test Engineer"
        value={testEngineer}
        placeholder="Enter Details here"
        onChange={(e) => setTestEngineer(e.target.value)}
        options={testEngineerOptions}
      />
      <EntryField
        label="Test Engineer Man Hours"
        value={testEngineerManHours}
        placeholder="Enter Details here"
        onChange={(e) => setTestEngineerManHours(e.target.value)}
      />
      <EntryField
        label="Team Leader"
        value={teamLeader}
        placeholder="Enter Details here"
        onChange={(e) => setTeamLeader(e.target.value)}
        options={teamLeaderOptions}
      />
      <EntryField
        label="Contract Manpower"
        value={contractManpower}
        placeholder="Enter Details here"
        onChange={(e) => setContractManpower(e.target.value)}
        options={contractAssociateManpowerOptions}
      />
      <p className="flex justify-center mt-2 text-lg font-bold text-center font-georama">
        Component Observation
      </p>
      <textarea
        value={componentObservation}
        onChange={(e) => setComponentObservation(e.target.value)}
        className="w-full h-20 px-4 py-2 text-sm bg-white border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
      />
    </Card>
  );
};

export default CardThree;
