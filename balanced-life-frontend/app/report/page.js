"use client";

import { useState, useEffect } from "react";
import {
  FaHome,
} from "react-icons/fa";
export default function TaskReportPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function fetchTaskReport() {
      try {
        const response = await fetch("http://3000/api/tasks/report");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching task report:", error);
      }
    }
    fetchTaskReport();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-500 to-pink-500 text-white">
      {/* Page Header */}
      <div className="bg-purple-800 text-white text-center py-6 shadow-md">
        <a href="/dashboard" className="hover:text-yellow-300 flex items-right">
        <h1 className="text-3xl font-bold"><FaHome className="mr-1" /></h1>
                  </a>
        <h1 className="text-3xl font-bold">Task Report</h1>
      </div>

      {/* Task Report Table */}
      <div className="container mx-auto px-6 py-8">
        <div className="overflow-x-auto">
          <table className="min-w-full border border-purple-300 shadow-lg">
            <thead className="bg-purple-700 text-white">
              <tr>
                <th className="px-4 py-3 border border-purple-400">Task Description</th>
                <th className="px-4 py-3 border border-purple-400">Task Status</th>
                <th className="px-4 py-3 border border-purple-400">Hours Spent</th>
                <th className="px-4 py-3 border border-purple-400">Comments</th>
              </tr>
            </thead>
            <tbody className="bg-white text-gray-900">
              {tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <tr key={index} className="text-center border border-purple-300">
                    <td className="px-4 py-3 border border-purple-300">{task.description}</td>
                    <td className="px-4 py-3 border border-purple-300">{task.status}</td>
                    <td className="px-4 py-3 border border-purple-300">{task.hoursSpent}</td>
                    <td className="px-4 py-3 border border-purple-300">{task.comments}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center px-4 py-6 text-purple-700">
                    No tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
