import React from "react";
import { UserCircle } from "lucide-react";
import mahindraBeam from "../../assets/MahindraBeam.png";
import mai_logo  from "../../assets/MAI_Logo.png";

const Header = () => {
  return (
    <>
      {/* The Header */}
      <header className="w-full px-3 py-3 bg-black shadow-md">
        {/* Main header content */}
        <div className="flex items-center justify-between mx-auto max-w-9xl">
          {/* Logo Container */}
          <div className="w-32 h-10">
            <img
              src={mai_logo}
              alt="Logo"
              className="object-contain w-16 mt-2 ml-2 f-16"
            />
          </div>

          {/* User Icon */}
          <div className="flex items-center">
            <UserCircle className="w-8 h-8 text-white cursor-pointer hover:text-gray-300" />
          </div>
        </div>
      </header>

      {/* Mahindra Beam just below the header */}
      <div className="flex">
        <img
          src={mahindraBeam}
          alt="Mahindra Beam"
          className="object-contain w-1/2"
        />
      </div>
    </>
  );
};

export default Header;
