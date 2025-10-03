// components/Footer.js
import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section: About & Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Balanced Life</h2>
            <p className="text-gray-400 text-sm">
              Helping women manage life efficiently with tasks, wellness, and
              insights—all in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/dashboard" className="hover:text-pink-400">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/tasks" className="hover:text-pink-400">
                  Tasks
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-pink-400">
                  About Us
                </a>
              </li>
              <li>
                <a href="/profile" className="hover:text-pink-400">
                  Profile
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Connect With Us</h3>
            <p className="text-gray-400 text-sm mb-4">
              123 Balanced St, Wellness City, LifeState
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-pink-400">
                <FaFacebookF />
              </a>
              <a href="#" className="hover:text-pink-400">
                <FaTwitter />
              </a>
              <a href="#" className="hover:text-pink-400">
                <FaInstagram />
              </a>
              <a href="#" className="hover:text-pink-400">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Balanced Life. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
