// components/TableHeader.js
import React from "react";

const TableHeader = () => {
  const headers = [
    "Sr No",
    "Job No",
    "Start Date",
    "End Date",
    "CSV Name",
    "Tech Manager",
    "Tech Engineer",
    "Actions",
  ];

  return (
    <thead className="bg-gradient-to-r from-gray-200 to-gray-300 font-georama">
      <tr>
        {headers.map((header, index) => (
          <th
            key={index}
            className="px-4 py-2 font-semibold text-left text-gray-800 border-b border-gray-300"
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
