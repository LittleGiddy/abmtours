// app/admin/SIdeNavbar/SIdeNavbar.jsx
'use client';

import React from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { GiHamburgerMenu } from "react-icons/gi";
import { Disclosure } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";
import {
  MdOutlineLogout,
  MdOutlineMapsHomeWork,
  MdOutlineTravelExplore,
  MdOutlineBookmarkBorder,
  MdSpaceDashboard,
  MdOutlinePhotoLibrary,
  MdOutlineAdminPanelSettings,
} from "react-icons/md";
import { BiMessageSquareDots } from "react-icons/bi";
import { IoMdStarOutline } from "react-icons/io";
import { MdOutlineFileUpload } from "react-icons/md";

const navItems = [
  { icon: <MdSpaceDashboard />, label: "Dashboard", path: "/admin/Dashboard" },
  { icon: <MdOutlineBookmarkBorder />, label: "Bookings", path: "/admin/Bookings" },
  { icon: <IoMdStarOutline />, label: "Reviews", path: "/admin/reviews" },
  { icon: <MdOutlinePhotoLibrary />, label: "Gallery", path: "/admin/gallery" },
  { icon: <BiMessageSquareDots />, label: "Messages", path: "/admin/Messages" },
  { icon: <MdOutlineTravelExplore />, label: "Tours and Safaris", path: "/admin/packages" },
  { icon: <MdOutlineFileUpload />, label: "Import PDF", path: "/admin/import-pdf" },
  { icon: <MdOutlineMapsHomeWork />, label: "Destinations", path: "/admin/destinations" },
  { icon: <MdOutlineAdminPanelSettings />, label: "Setup", path: "/admin/setup" },
];

function SIdeNavbar() {
  const pathname = usePathname();

  return (
    <Disclosure as="nav">
      {({ open, close }) => (
        <div>
          {/* Hamburger Button – only visible while the sidebar is pinned closed (< lg) */}
          <Disclosure.Button className="absolute top-4 right-4 z-40 lg:hidden inline-flex items-center justify-center rounded-md p-2.5 bg-gray-900 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white shadow-lg">
            {open ? (
              <RxCross2 className="h-6 w-6" aria-hidden="true" />
            ) : (
              <GiHamburgerMenu className="h-6 w-6" aria-hidden="true" />
            )}
          </Disclosure.Button>

          {/* Overlay for mobile drawer */}
          {open && (
            <div
              className="fixed inset-0 bg-black/40 z-30 lg:hidden"
              onClick={() => close()}
            />
          )}

          {/* Sidebar */}
          <div
            className={`fixed inset-y-0 left-0 z-40 w-[75%] max-w-xs lg:w-60 bg-white shadow-xl transition-transform duration-300 ease-in-out transform ${
              open ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 overflow-y-auto`}
          >
            <div className="flex flex-col min-h-full">
              {/* Logo + Title */}
              <div className="flex flex-col items-center gap-2 px-4 py-6 border-b border-gray-100 w-full">
                <Image
                  src="/ABMLOGO.png"
                  alt="Logo"
                  width={52}
                  height={52}
                  className="mx-auto"
                  priority
                />
                <h1 className="text-lg font-bold text-blue-900 text-center">
                  Admin Panel
                </h1>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 px-3 py-4">
                {navItems.map((item) => (
                  <MenuItem
                    key={`${item.label}-${item.path}`}
                    icon={item.icon}
                    label={item.label}
                    path={item.path}
                    active={pathname === item.path}
                  />
                ))}
              </div>

              {/* Logout */}
              <div className="px-3 py-4 border-t border-gray-100">
                <MenuItem
                  icon={<MdOutlineLogout />}
                  label="Logout"
                  path="/admin-login"
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
const MenuItem = ({ icon, label, path, active = false }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(path);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex mb-1.5 justify-start items-center gap-4 pl-5 p-2.5 rounded-md group cursor-pointer hover:shadow-sm transition-colors ${
        active
          ? "bg-amber-600 text-white shadow-sm"
          : "hover:bg-gray-900 hover:text-white"
      }`}
    >
      <div
        className={`text-2xl ${
          active ? "text-white" : "text-gray-600 group-hover:text-white"
        }`}
      >
        {icon}
      </div>
      <h3
        className={`text-sm font-semibold ${
          active
            ? "text-white"
            : "text-gray-800 group-hover:text-white"
        }`}
      >
        {label}
      </h3>
    </div>
  );
};

export default SIdeNavbar;