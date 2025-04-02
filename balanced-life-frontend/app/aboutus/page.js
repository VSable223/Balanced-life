"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  FaHome,
  FaTasks,
  FaInfoCircle,
  FaUserAlt,
  FaChevronDown,
} from "react-icons/fa";

// Navbar Component (Same as Dashboard)
const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-black/50 backdrop-blur-md shadow-lg">
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl font-bold tracking-wide text-yellow-300">BalancedLife</h1>
      </div>
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 mt-2 sm:mt-0">
        <a href="/dashboard" className="hover:text-yellow-300 flex items-center transition-colors">
          <FaHome className="mr-1" /> Dashboard
        </a>
        <a href="/tasks" className="hover:text-yellow-300 flex items-center transition-colors">
          <FaTasks className="mr-1" /> Tasks
        </a>
        <a href="/aboutus" className="hover:text-yellow-300 flex items-center transition-colors">
          <FaInfoCircle className="mr-1" /> About Us
        </a>
      </div>
      <div className="relative mt-2 sm:mt-0">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-1 bg-black/40 px-3 py-2 rounded-full hover:bg-black/60 transition"
        >
          <FaUserAlt className="text-xl" />
          <FaChevronDown className={`transition-transform ${dropdownOpen ? "rotate-180" : "rotate-0"}`} />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-black/70 backdrop-blur-md shadow-md rounded-lg py-2 z-10">
            <a href="/profile" className="block px-4 py-2 hover:bg-black/50 transition-colors">Profile Information</a>
            <a href="/report" className="block px-4 py-2 hover:bg-black/50 transition-colors">Task Report</a>
            <button onClick={() => signOut()} className="w-full text-left px-4 py-2 hover:bg-red-500 transition-colors">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-700 to-pink-500 text-white">
      {/* Navbar */}
      <Navbar />

      <div className="container mx-auto px-6 py-12">
        {/* Mission & Vision */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Mission & Vision</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Our mission is to empower women to manage their daily lives efficiently using AI-powered insights and productivity tools.
            We envision a future where balance and well-being are seamlessly integrated into everyday tasks.
          </p>
        </section>

        {/* Success Stories */}
        <section className="bg-white text-black rounded-lg shadow-lg p-6 mb-12">
          <h2 className="text-3xl font-semibold text-center mb-6">Success Stories</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 border-l-4 border-purple-600">
              <p>"Balanced Life has transformed the way I manage my daily tasks. I feel more in control of my schedule than ever!"</p>
              <span className="block mt-2 font-semibold">- Sarah M.</span>
            </div>
            <div className="p-4 border-l-4 border-pink-600">
              <p>"The AI insights and productivity tracking have helped me achieve my goals faster! Highly recommend."</p>
              <span className="block mt-2 font-semibold">- Emily R.</span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-6">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-white text-black rounded-lg shadow-md">✅ AI Task Scheduling</div>
            <div className="p-6 bg-white text-black rounded-lg shadow-md">✅ Well-being Tracking</div>
            <div className="p-6 bg-white text-black rounded-lg shadow-md">✅ Integrated Reminders</div>
          </div>
        </section>

        {/* Address & Contact Info */}
        <section className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-4">Contact Us</h2>
          <p>Email: <a href="mailto:support@balancedlife.com" className="underline">support@balancedlife.com</a></p>
          <p>Phone: <a href="tel:+1234567890" className="underline">+1 234 567 890</a></p>
          <p>Address: 123 Wellness Street, Productivity City</p>
        </section>

        {/* Social Media Icons */}
        <section className="flex justify-center gap-6 text-lg">
          <a href="#" className="hover:text-gray-300">🔗 Facebook</a>
          <a href="#" className="hover:text-gray-300">🔗 Twitter</a>
          <a href="#" className="hover:text-gray-300">🔗 Instagram</a>
          <a href="#" className="hover:text-gray-300">🔗 LinkedIn</a>
        </section>
      </div>
    </div>
  );
}
