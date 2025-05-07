"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { navLinks } from "../constant/constant";
import { HiBars3BottomRight } from "react-icons/hi2";

type Props = {
  openNav: () => void;
};

const Nav = ({ openNav }: Props) => {
  const [navBg, setNavBg] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setNavBg(window.scrollY >= 90);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed w-full transition-all duration-200 h-[12vh] z-[1000] ${
        navBg ? "bg-blue-950 shadow-md" : "bg-transparent"
      }`}
    >
      {/* Navbar */}
      <div className="flex items-center h-full justify-between w-[90%] xl:w-[80%] mx-auto">
        {/* LOGO */}
        <Link href="/" className="flex items-center">
          <Image
            src="/ABM Logo-01.png"
            alt="ABM Tours and Safaris Ltd."
            width={180}
            height={180}
            priority
          />
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.url}
              className="relative group text-white text-lg font-medium"
            >
              {link.label}
              <span className="absolute left-0 bottom-[-4px] w-full h-[3px] bg-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
          ))}
        </div>

        {/* Book Now Button (Always Visible) */}

        <Link href="/BookNow">
          <button className="px-4 sm:px-6 md:px-8 py-2 whitespace-nowrap text-white text-sm sm:text-base bg-amber-600 hover:bg-amber-700 rounded-lg cursor-pointer md:ml-4">
            Book Now
          </button>
        </Link>

        {/* Burger Menu (Only Visible on Small Screens) */}
        <HiBars3BottomRight
          onClick={openNav}
          className="w-8 h-8 cursor-pointer text-white md:hidden"
        />
      </div>
    </div>
  );
};

export default Nav;
