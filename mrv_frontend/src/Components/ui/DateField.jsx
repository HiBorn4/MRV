import React from "react";

export const DateField = ({ label, placeholder = "", onChange, value }) => {
  return (
    <div className="grid items-center w-full grid-cols-2 gap-2 m-2">
      {/* Left half: label */}
      <label className="text-sm font-medium text-gray-700 font-georama">
        {label}
      </label>

      {/* Right half: input */}
      <div className="relative mr-2">
        <input
          type="date"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2 text-sm bg-white border border-black rounded-full  focus:outline-none focus:ring-2 focus:ring-black/20"
        />
      </div>
    </div>
  );
};
