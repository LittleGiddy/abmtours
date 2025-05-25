'use client';

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GiHamburgerMenu } from "react-icons/gi";
import { Disclosure } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";
import {
  MdOutlineLogout,
  MdOutlineLocationOn,
  MdOutlineMapsHomeWork,
  MdOutlineTravelExplore,
  MdOutlineBookmarkBorder,
  MdSpaceDashboard,
  MdOutlinePhotoLibrary, // Added icon for Gallery
} from "react-icons/md";
import { BiMessageSquareDots } from "react-icons/bi";
import { IoMdStarOutline } from "react-icons/io";

function SideNavbar() {
  return (
    <Disclosure as="nav">
      {({ open }) => (
        <div>
          {/* Hamburger Button */}
          <Disclosure.Button className="absolute bg-amber-100 top-4 right-4 z-30 inline-flex items-center peer justify-center rounded-md p-2 text-gray-800 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white group">
            {open ? (
              <RxCross2 className="block md:hidden h-6 w-6" aria-hidden="true" />
            ) : (
              <GiHamburgerMenu className="block md:hidden h-6 w-6" aria-hidden="true" />
            )}
          </Disclosure.Button>

          {/* Sidebar */}
          <div
            className={`p-6 w-1/2 h-screen bg-white z-20 fixed top-0 transition-all duration-300 ease-in-out ${
              open ? "left-0" : "-left-96"
            } lg:left-0 lg:w-60`}
          >
            <div className="flex flex-col justify-start items-center">
              {/* Logo + Title */}
              <div className="flex flex-col items-center gap-2 mb-4 border-b border-gray-100 pb-4 w-full">
                <Image
                  src="/ABMLOGO.png"
                  alt="Logo"
                  width={48}
                  height={48}
                  className="mx-auto"
                  priority
                />
                <h1 className="text-base cursor-pointer font-bold text-blue-900">
                  Admin Panel
                </h1>
              </div>

              {/* Navigation Items */}
              <div className="my-4 border-b border-gray-100 pb-4 w-full">
                <MenuItem icon={<MdSpaceDashboard/>} label="Dashboard" path="/admin/Dashboard" />
                <MenuItem icon={<MdOutlineBookmarkBorder />} label="Bookings" path="#" />
                <MenuItem icon={<IoMdStarOutline />} label="Popular Destinations" path="#" />
                <MenuItem icon={<BiMessageSquareDots />} label="Messages" path="/admin/Messages" />
                <MenuItem icon={<MdOutlineMapsHomeWork />} label="Desired Place" path="#" />
                <MenuItem icon={<MdOutlineTravelExplore />} label="Tours and Safaris" path="#" />
                <MenuItem icon={<MdOutlineLocationOn />} label="Destinations" path="#" />
                <MenuItem icon={<MdOutlinePhotoLibrary />} label="Gallery" path="#" />
              </div>

              {/* Logout */}
              <div className="my-4 w-full">
                <MenuItem
                  icon={<MdOutlineLogout />}
                  label="Logout"
                  path="/admin-login/login"
                  extraClasses="border border-gray-200"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Disclosure>
  );
}

// Reusable menu item component
const MenuItem = ({ icon, label, path, extraClasses = "" }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(path);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto ${extraClasses}`}
    >
      <div className="text-2xl text-gray-600 group-hover:text-white">{icon}</div>
      <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
        {label}
      </h3>
    </div>
  );
};

export default SideNavbar;

