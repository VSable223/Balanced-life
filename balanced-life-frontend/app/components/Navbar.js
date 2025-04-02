"use client";
// you can use
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };
    checkAuth();

    // Listen for auth changes
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  if (isAuthenticated === null) return null; // Prevent UI flash while checking auth

  return (
    <nav className="bg-blue-600 dark:bg-gray-800 p-4 text-white flex justify-between items-center">
      {/* Logo */}
      <div className="text-xl font-bold">
        <Link href="/dashboard">Balanced Life</Link>
      </div>

      {/* Navbar Links */}
      <div className="hidden md:flex space-x-6">
        <Link href="/dashboard" className="hover:underline">Dashboard</Link>
        <Link href="/tasks" className="hover:underline">Tasks</Link>
        <Link href="/aboutus" className="hover:underline">About Us</Link>
      </div>

      {/* Profile Dropdown */}
      <div className="relative">
        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="focus:outline-none">
          <img src="/profile-icon.png" alt="Profile" className="w-8 h-8 rounded-full" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 shadow-md rounded-md py-2">
            <Link href="/tasks/add" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600">
              Add Task
            </Link>
            <Link href="/tasks/report" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600">
              Task Report
            </Link>
            <Link href="/tasks/weekly" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600">
              Weekly Report
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/login");
              }}
              className="block w-full text-left px-4 py-2 hover:bg-red-500 text-red-600 hover:text-white"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
