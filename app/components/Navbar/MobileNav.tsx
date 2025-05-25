"use client";
import React from "react";
import Link from "next/link";
import { navLinks } from "../constant/constant"; // Ensure navLinks is imported
import { CgClose } from "react-icons/cg";

type Props = {
  showNav: boolean;
  closeNav: () => void;
};

const MobileNav = ({ showNav, closeNav }: Props) => {
  return (
    <div>
      {/* Overlay - Clicking it closes the menu */}
      {showNav && (
        <div
          className="fixed inset-0 bg-black opacity-70 w-full h-screen z-[1002]"
          onClick={closeNav}
        />
      )}

      {/* Side Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-[80%] sm:w-[60%] bg-amber-600 space-y-6 p-6 z-[1050] text-white flex flex-col justify-center transition-transform duration-500 ease-in-out ${
          showNav ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <CgClose
          onClick={closeNav}
          className="absolute top-4 right-4 sm:w-8 sm:h-8 w-6 h-6 cursor-pointer text-white"
        />

        {/* Navigation Links */}
        {navLinks.map((link) => (
          <Link key={link.id} href={link.url} onClick={closeNav}>
            <p className="text-white text-[20px] border-b-[1.5px] pb-1 border-white sm:text-[30px]">
              {link.label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;
