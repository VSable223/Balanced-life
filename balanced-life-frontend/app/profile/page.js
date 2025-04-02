"use client";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [darkMode, setDarkMode] = useState(false);
  const [selfCareReminder, setSelfCareReminder] = useState(false);

  if (status === "loading") {
    return <div className="text-center mt-10 text-xl">Loading...</div>;
  }

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} min-h-screen flex flex-col items-center`}>
      
      {/* Navbar */}
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-purple-500 text-white py-4 px-6 flex justify-between items-center shadow-md"
      >
        <h1 className="text-2xl font-bold">Balanced Life</h1>
        <a href="/dashboard" className="hover:text-yellow-300 flex items-center">
                     Dashboard
                  </a>
        <button onClick={() => signOut()} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition">
          Logout
        </button>
      </motion.div>

      {/* Profile Card */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mt-10 bg-gradient-to-r from-purple-400 to-pink-500 p-6 rounded-2xl shadow-xl w-[90%] md:w-1/2"
      >
        <h2 className="text-center text-3xl font-bold text-white mb-4">Profile</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-white font-semibold">Name:</label>
            <input 
              type="text"
              value={session?.user?.name || "N/A"}
              readOnly
              className="w-full px-4 py-2 rounded-lg bg-white text-gray-900 shadow-md"
            />
          </div>

          <div>
            <label className="block text-white font-semibold">Email:</label>
            <input 
              type="text"
              value={session?.user?.email || "N/A"}
              readOnly
              className="w-full px-4 py-2 rounded-lg bg-white text-gray-900 shadow-md"
            />
          </div>
        </div>

        {/* Settings */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold">Enable Self-Care Reminder</span>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelfCareReminder(!selfCareReminder)}
              className={`w-10 h-6 flex items-center rounded-full transition ${selfCareReminder ? "bg-yellow-400" : "bg-gray-400"}`}
            >
              <motion.div 
                className="w-5 h-5 bg-white rounded-full shadow-md"
                animate={{ x: selfCareReminder ? 20 : 0 }}
              />
            </motion.button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white font-semibold">Enable Dark Mode</span>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)}
              className={`w-10 h-6 flex items-center rounded-full transition ${darkMode ? "bg-yellow-400" : "bg-gray-400"}`}
            >
              <motion.div 
                className="w-5 h-5 bg-white rounded-full shadow-md"
                animate={{ x: darkMode ? 20 : 0 }}
              />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
