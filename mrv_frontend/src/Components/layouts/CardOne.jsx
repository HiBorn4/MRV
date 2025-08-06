import React from "react";
import { Card } from "../ui/Card";
import { EntryField } from "../ui/EntryField";
import { DateField } from "../ui/DateField";
import { modelProjectsOptions, testActuatorOptions } from "../../constants/dropdownOptions";

export const CardOne = ({
  modelName,
  setModelName,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  testActuator,
  setTestActuator,
  maxLoad,
  setMaxLoad,
  minLoad,
  setMinLoad,
  maxDisp,
  setMaxDisp,
  minDisp,
  setMinDisp,
  testObjective,
  setTestObjective,
  testBackground,
  setTestBackground,
}) => {
  return (
    <Card>
      <div className="space-y-3">
        {/* Model / Project */}
        <EntryField
          label="Model / Project"
          placeholder="Enter Details here"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
          options={modelProjectsOptions}
        />

        {/* Start Date and End Date */}
        {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"> */}
          <DateField
            label="Start Date"
            placeholder="YYYY-MM-DD"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <DateField
            label="End Date"
            placeholder="YYYY-MM-DD"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        {/* </div> */}

        {/* Test Actuator */}
        <EntryField
          label="Test Actuator"
          placeholder="Enter Details here"
          value={testActuator}
          onChange={(e) => setTestActuator(e.target.value)}
          options={testActuatorOptions}
        />

        {/* Load Section */}
        <div className="bg-[#D9D9D9] rounded-xl p-4">
          <p className="flex justify-center mb-4 text-sm font-bold font-georama">Load</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <EntryField
              label="Max"
              value={maxLoad}
              onChange={(e) => setMaxLoad(e.target.value)}
            />
            <EntryField
              label="Min"
              value={minLoad}
              onChange={(e) => setMinLoad(e.target.value)}
            />
          </div>
        </div>

        {/* Disp Section */}
        <div className="bg-[#D9D9D9] rounded-xl p-4">
          <p className="flex justify-center mb-4 text-sm font-bold font-georama">Disp</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <EntryField
              label="Max"
              value={maxDisp}
              onChange={(e) => setMaxDisp(e.target.value)}
            />
            <EntryField
              label="Min"
              value={minDisp}
              onChange={(e) => setMinDisp(e.target.value)}
            />
          </div>
        </div>

        {/* Test Objective */}
        <EntryField
          label="Test Objective"
          placeholder="Enter Details here"
          value={testObjective}
          onChange={(e) => setTestObjective(e.target.value)}
        />

        {/* Test Background */}
        <EntryField
          label="Test Background"
          placeholder="Enter Details here"
          value={testBackground}
          onChange={(e) => setTestBackground(e.target.value)}
        />
      </div>
    </Card>
  );
};
