"use client";

import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { FaHome, FaTasks, FaInfoCircle, FaUserAlt, FaChevronDown } from "react-icons/fa";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-customPurple/50 backdrop-blur-md shadow-lg">
      {/* Logo */}
      <h1 className="text-3xl font-bold tracking-wide text-yellow-300">BalancedLife</h1>

      {/* Navigation Links */}
      <div className="flex space-x-6 mt-2 sm:mt-0">
        <Link href="/dashboard" className="hover:text-yellow-300 flex items-center">
          <FaHome className="mr-1" /> Dashboard</Link>
        <Link href="/tasks" className="hover:text-yellow-300 flex items-center">
         <FaTasks className="mr-1" /> Tasks </Link>
        <Link href="/aboutus" className="hover:text-yellow-300 flex items-center">
          <FaInfoCircle className="mr-1" /> About Us</Link>
        
      </div>

      {/* Profile Dropdown */}
      <div className="relative mt-2 sm:mt-0" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-1 bg-black/40 px-3 py-2 rounded-full hover:bg-white/60"
        >
          <FaUserAlt className="text-xl" />
          <FaChevronDown
            className={`transition-transform ${dropdownOpen ? "rotate-180" : "rotate-0"}`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-black/70 backdrop-blur-md shadow-md rounded-lg py-2 z-50">
            <Link href="/profile" className="block px-4 py-2 hover:bg-pink-500 /50">
              Profile
            </Link>
            <Link href="/report" className="block px-4 py-2 hover:bg-pink-500 /50">
              Task Report
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full text-left px-4 py-2 hover:bg-red-500"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
