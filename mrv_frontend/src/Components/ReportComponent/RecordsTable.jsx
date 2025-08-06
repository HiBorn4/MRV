// Pages/RecordsTable.js
import React, { useState } from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

const RecordsTable = ({ records = [], refreshRecords }) => {
  if (records.length === 0) {
    return (
      <div className="p-6 bg-white border border-gray-200 shadow-lg rounded-xl">
        <h2 className="mb-3 text-lg font-bold text-gray-700">
          vious Tests
        </h2>
        <p className="text-gray-500">No records found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 shadow-lg rounded-xl">
      <h2 className="mb-3 text-lg font-bold text-gray-700">
        All Previous Tests
      </h2>
      <table className="w-full text-sm border-separate border-spacing-0">
        <TableHeader />
        <tbody>
          {records.map((record, index) => (
            <TableRow
              key={record.id}
              record={record}
              srNo={index + 1}
              refreshRecords={refreshRecords}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecordsTable;
