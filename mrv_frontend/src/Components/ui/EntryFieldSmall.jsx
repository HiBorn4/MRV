import React from "react";

export const EntryFieldSmall = ({ label, placeholder = "", onChange, value }) => {
  return (
    <div className="flex items-center w-full gap-2 m-1">
      <label className="w-1/2 text-sm font-medium text-gray-700 font-georama">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-1/2 px-4 py-1 text-sm bg-white border border-black rounded-full  focus:outline-none focus:ring-2 focus:ring-black/20"
      />
    </div>
  );
};
