import React from "react";

export const EntryField = ({
  label,
  placeholder = "",
  value,
  onChange,
  options,
}) => {
  return (
    <div className="flex items-center w-full gap-2 m-1">
      <label className="w-1/2 text-sm font-medium text-gray-700 font-georama">
        {label}
      </label>

      {/* If `options` is present and non-empty, show a dropdown; otherwise, show an input. */}
      {options && options.length > 0 ? (
        <select
          className="w-1/2 px-4 py-2 text-sm bg-white border border-black rounded-full focus:outline-none focus:ring-2 focus:ring-black/20"
          value={value}
          onChange={onChange}
        >
          <option value="" disabled>
            {placeholder || "Select an option"}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-1/2 px-4 py-2 text-sm bg-white border border-black rounded-full focus:outline-none focus:ring-2 focus:ring-black/20"
        />
      )}
    </div>
  );
};
