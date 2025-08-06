import React from "react";
import { Card } from "../ui/Card";
import { EntryField } from "../ui/EntryField";
import { EntryFieldSmall } from "../ui/EntryFieldSmall";
import { joNoOptions } from "../../constants/dropdownOptions";
import riselogo from "../../assets/RedRiseLogo.png";
export const CardTwo = ({ // Changed from 'export default' to 'export const'
  jobNo,
  setJobNo,
  customer,
  setCustomer,
  frequency,
  setFrequency,
  target,
  setTarget,
  sensitivityforloadcell,
  setSensitivityForLoadCell,
  Pforloadcell,
  setPForLoadCell,
  Iforloadcell,
  setIForLoadCell,
  Dforloadcell,
  setDForLoadCell,
  Polarityforloadcell,
  setPolarityForLoadCell,
  Offsetforloadcell,
  setOffsetForLoadCell,
  ShuntCheckforloadcell,
  setShuntCheckForLoadCell,
  sensitivityforlvdt,
  setSensitivityForLVDT,
  Pforlvdt,
  setPForLVDT,
  Iforlvdt,
  setIForLVDT,
  Dforlvdt,
  setDForLVDT,
  Polarityforlvdt,
  setPolarityForLVDT,
  Offsetforlvdt,
  setOffsetForLVDT,
  ShuntCheckforlvdt,
  setShuntCheckForLVDT,
}) => {
  return (

    <Card>
      <div className="flex justify-center">
        <img
          src={riselogo}
          alt="RedRise Logo"
          className="flex justify-center text-center size-1/2"
        />
      </div>
      <p className="p-2 mb-2 text-xs text-center bg-white rounded-full font-georama">
        Record No: MRV/-------------
      </p>

      <EntryField
        label="Job Number"
        value={jobNo}
        placeholder="Enter Details here"
        onChange={(e) => setJobNo(e.target.value)}
        options={joNoOptions}
      />
      <EntryField
        label="Customer"
        value={customer}
        placeholder="Enter Details here"
        onChange={(e) => setCustomer(e.target.value)}
      />
      <EntryField
        label="Frequency"
        value={frequency}
        placeholder="Enter Details here"
        onChange={(e) => setFrequency(e.target.value)}
      />
      <EntryField
        label="Target"
        value={target}
        placeholder="Enter Details here"
        onChange={(e) => setTarget(e.target.value)}
      />

      {/* 2-Column Layout for LoadCell & LVDT */}
      <div className="grid items-center w-full grid-cols-2 gap-4 my-2">
        <div className="bg-[#D9D9D9] rounded-xl p-2 w-full overflow-hidden mt-3 mb-3">
          <p className="flex justify-center text-sm font-bold text-center font-georama">
            Loadcell
          </p>
          <EntryFieldSmall
            label="Sensitivity"
            value={sensitivityforloadcell}
            onChange={(e) => setSensitivityForLoadCell(e.target.value)}
          />
          <EntryFieldSmall
            label="P"
            value={Pforloadcell}
            onChange={(e) => setPForLoadCell(e.target.value)}
          />
          <EntryFieldSmall
            label="I"
            value={Iforloadcell}
            onChange={(e) => setIForLoadCell(e.target.value)}
          />
          <EntryFieldSmall
            label="D"
            value={Dforloadcell}
            onChange={(e) => setDForLoadCell(e.target.value)}
          />
          <EntryFieldSmall
            label="Polarity"
            value={Polarityforloadcell}
            onChange={(e) => setPolarityForLoadCell(e.target.value)}
          />
          <EntryFieldSmall
            label="Offset"
            value={Offsetforloadcell}
            onChange={(e) => setOffsetForLoadCell(e.target.value)}
          />
          <EntryFieldSmall
            label="Shunt Check"
            value={ShuntCheckforloadcell}
            onChange={(e) => setShuntCheckForLoadCell(e.target.value)}
          />
        </div>

        <div className="bg-[#D9D9D9] rounded-xl p-2 w-full overflow-hidden mt-3 mb-3">
          <p className="flex justify-center text-sm font-bold text-center font-georama">
            LVDT
          </p>
          <EntryFieldSmall
            label="Sensitivity"
            value={sensitivityforlvdt}
            onChange={(e) => setSensitivityForLVDT(e.target.value)}
          />
          <EntryFieldSmall
            label="P"
            value={Pforlvdt}
            onChange={(e) => setPForLVDT(e.target.value)}
          />
          <EntryFieldSmall
            label="I"
            value={Iforlvdt}
            onChange={(e) => setIForLVDT(e.target.value)}
          />
          <EntryFieldSmall
            label="D"
            value={Dforlvdt}
            onChange={(e) => setDForLVDT(e.target.value)}
          />
          <EntryFieldSmall
            label="Polarity"
            value={Polarityforlvdt}
            onChange={(e) => setPolarityForLVDT(e.target.value)}
          />
          <EntryFieldSmall
            label="Offset"
            value={Offsetforlvdt}
            onChange={(e) => setOffsetForLVDT(e.target.value)}
          />
          <EntryFieldSmall
            label="Shunt Check"
            value={ShuntCheckforlvdt}
            onChange={(e) => setShuntCheckForLVDT(e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
};

export default CardTwo;
