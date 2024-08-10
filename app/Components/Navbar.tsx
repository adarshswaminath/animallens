import React from "react";
import { HiMenuAlt1 } from "react-icons/hi";
import Link from "next/link";

export default function Navbar() {
  const menuItems = (
    <>
      <li>
        <Link href="/">Home</Link>
      </li>
      <li>
        <Link href="/image-upload">Upload</Link>
      </li>
      <li>
        <Link href="/profile">Profile</Link>
      </li>
      <li>
        <a className="flex items-center justify-center  bg-gray-900 rounded-full w-32 text-white hover:text-gray-900">
          Sign Up
        </a>
      </li>
    </>
  );

  return (
    <div>
      <div className="navbar lg:px-20">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn bg-transparent shadow-none border-none hover:bg-transparent lg:hidden"
            >
              <HiMenuAlt1 className="text-2xl" />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-[#FFE7CF] rounded-box z-[1] mt-3 w-52 p-2 text-gray-900 shadow"
            >
              {menuItems}
            </ul>
          </div>
          <a className="text-4xl font-bold lg:text-6xl font-whisper">petcare</a>
        </div>
        <div className="navbar-end hidden lg:flex items-center">
          <ul className="menu menu-horizontal px-1">{menuItems}</ul>
        </div>
      </div>
      {/* hr line */}
      <div className="lg:px-16">
        <hr className="border-gray-900 h-3" />
      </div>
    </div>
  );
}
