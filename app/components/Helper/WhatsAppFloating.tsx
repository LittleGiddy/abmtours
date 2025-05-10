"use client";

import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppFloating = () => {
  return (
    <div className="fixed bottom-18 right-4 animate-bounce z-50"> {/* Positioned above ScrollToTop */}
      <a
        href="https://wa.me/+255678991004?text=Hello%20ABM%20TOURS%20%26%20SAFARIS%20LTD%2C%20I%27m%20interested%20in%20your%20services"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-amber-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-amber-500 focus:outline-none cursor-pointer"
      >
        <FaWhatsapp size={32} />
      </a>
    </div>
  );
};

export default WhatsAppFloating;
