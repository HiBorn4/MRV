import React from "react";
import mai_logo  from "../../assets/MAI_Logo.png";
import Riselogo  from "../../assets/RedRiseLogo.png";

const Footer = () => {
  return (
    <footer className="text-white bg-black">
      {/* Thin red line at the top of the footer */}
      <div className="h-[2px] w-full bg-red-500" />

      {/* Footer Content */}
      <div className="flex items-center justify-between px-4 py-3 mx-auto max-w-8xl">
        {/* Left text */}
        <div className="text-sm font-thin leading-relaxed">
          Proprietary of Mahindra AI <br />
          Copyright 2015-2023 Mahindra &amp; Mahindra
          Ltd. All rights reserved.
        </div>

        {/* Right logo */}
        <div>
          <img
            src={Riselogo}
            alt="MAI Logo"
            className="object-contain w-auto h-12"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
