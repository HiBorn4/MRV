// RecordsButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineDocumentReport } from "react-icons/hi";

const RecordsButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to the MainReportRenderFile component route
    navigate('/main-report');
  };

  return (
    <button
      onClick={handleClick}
      className="relative bg-[#E31837] py-2 px-6 rounded-full font-georamalight text-white flex items-center space-x-2 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gradient-to-r from-[#E31837] to-[#FF5733] hover:shadow-lg hover:shadow-red-500/50 active:scale-95"
    >
      <HiOutlineDocumentReport className="text-lg transition-transform duration-300 group-hover:rotate-12"/>
      <span className="relative z-10">Records</span>
      <span className="absolute inset-0 transition-opacity duration-300 bg-white rounded-full opacity-10 blur-lg group-hover:opacity-20"></span>
    </button>
  );
};

export default RecordsButton;
