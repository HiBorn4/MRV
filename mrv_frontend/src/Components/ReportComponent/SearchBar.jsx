// components/SearchBar.js
import React from 'react';
import { FiSearch, FiArrowLeft } from 'react-icons/fi';

const SearchBar = () => {
  return (
    <div className="flex flex-col justify-between mb-6 md:flex-row md:items-center">
      {/* Title and Back Button */}
      <div className="flex items-center mb-4 md:mb-0">
        <button
          onClick={() => window.history.back()}
          className="p-2 mr-3 rounded-full hover:bg-gray-200 focus:outline-none"
          aria-label="Back"
        >
          <FiArrowLeft className="text-gray-600" size={20} />
        </button>
        <h2 className="text-3xl font-bold text-gray-800 font-georama">
          Records
        </h2>
      </div>
      
      {/* Search Input */}
      <div className="relative w-full md:w-1/3">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <FiSearch className="text-gray-500" size={20} />
        </span>
        <input
          type="text"
          placeholder="Search records..."
          className="w-full py-2 pl-10 pr-4 transition duration-200 ease-in-out border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default SearchBar;
