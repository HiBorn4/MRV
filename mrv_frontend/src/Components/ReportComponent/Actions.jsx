// components/Actions.js
import React from "react";
import {
  HiDownload,
  HiEye,
  HiOutlineTrash,
  HiOutlinePencil,
} from "react-icons/hi";

const Actions = ({ onDelete, onView, onDownload, onEdit }) => {
  return (
    <div className="flex items-center space-x-1">
      <button
        onClick={onView}
        className="p-2 text-gray-700 transition-colors duration-200 hover:text-black"
        aria-label="View"
      >
        <HiEye size={18} />
      </button>
      <button
        onClick={onDelete}
        className="p-2 text-gray-700 transition-colors duration-200 hover:text-black"
        aria-label="Delete"
      >
        <HiOutlineTrash size={18} />
      </button>
      <button
        onClick={onDownload}
        className="p-2 text-gray-700 transition-colors duration-200 hover:text-black"
        aria-label="Download"
      >
        <HiDownload size={18} />
      </button>
      <button
        onClick={onEdit}
        className="p-2 text-gray-700 transition-colors duration-200 hover:text-black"
        aria-label="Edit"
      >
        <HiOutlinePencil size={18} />
      </button>
    </div>
  );
};

export default Actions;
