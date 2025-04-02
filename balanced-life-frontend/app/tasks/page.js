"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import withAuth from "../components/withAuth";
import {
  FaHome,
  FaTasks,
  FaInfoCircle,
  FaUserAlt,
  FaChevronDown,
} from "react-icons/fa";

function TasksPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state for adding a new task
  const [formData, setFormData] = useState({
    title: "",
    category: "work", // Default category
    priority: "Medium", // Options: High, Medium, Low
    deadline: "",
    duration: "", // In minutes
    isSelfCare: false,
  });
  
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Get userId from session (provided via NextAuth callbacks)
  const userId = session?.user?.id;

  // Fetch tasks for the user (assumes GET /api/tasks returns { tasks: [...] })
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    async function fetchTasks() {
      try {
        // Fetch Tasks
        const tasksRes = await fetch("http://localhost:5000/api/tasks/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
        if (!tasksRes.ok) throw new Error(`Error: ${tasksRes.status}`);
        const tasksData = await tasksRes.json();
        setTasks(tasksData.tasks || []);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        setTasks(data.tasks || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, [userId]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Add new task using POST to your backend (Express)
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!userId) return;
    // Include userId in the payload
    const payload = { ...formData, userId };
    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
      // Reset form
      setFormData({
        title: "",
        category: "work",
        priority: "Medium",
        deadline: "",
        duration: "",
        isSelfCare: false,
      });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTasks((prev) => prev.filter((task) => task._id !== taskId));
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Prioritize a task (update priority, for example)
 const handlePrioritizeTask = async (taskId) => {
  try {
    const res = await fetch(`http://localhost:5000/api/ai/task-prioritization`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId }),
    });

    // ✅ Parse response only once
    const data = await res.json();

    if (res.ok) {
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, priority: data.result.priority } : task
        )
      );
    } else {
      console.error("Failed to prioritize task:", data);
    }
  } catch (error) {
    console.error("Error prioritizing task:", error);
  }
};

  

  // Reusable Navbar Component (same as Dashboard)
  const Navbar = () => (
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

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Your Tasks</h2>
        
        {/* New Task Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Add New Task</h3>
          <form onSubmit={handleAddTask} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:space-x-4"> 
              <input
                type="text"
                name="title"
                placeholder="Task Title"
                value={formData.title}
                onChange={handleChange}
                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-900"
                required
              />
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-900"
                required
              />
            </div>
            <textarea
              name="description"
              placeholder="Task Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-900"
              rows="3"
            ></textarea>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-900 mb-4 sm:mb-0"
              >
                <option value="work">Work</option>
                <option value="family">Family</option>
                <option value="personal">Personal</option>
                <option value="health">Health</option>
                <option value="self-care">Self-Care</option>
              </select>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-900 mb-4 sm:mb-0"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
              <input
                type="number"
                name="duration"
                placeholder="Duration (min)"
                value={formData.duration}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-900 mb-4 sm:mb-0"
                required
              />
              <div className="flex items-center mb-4 sm:mb-0">
                <input
                  type="checkbox"
                  name="isSelfCare"
                  checked={formData.isSelfCare}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-gray-900 dark:text-white">Self-Care Task</span>
              </div>
              <button
                type="submit"
                className="bg-pink-600 hover:bg-pink-700 transition-colors text-white px-6 py-3 rounded-lg shadow-md"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>

        {/* Tasks List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Your Tasks</h3>
          {loading ? (
            <p>Loading tasks...</p>
          ) : tasks.length > 0 ? (
            <ul className="space-y-4">
              {tasks.map((task) => (
                <li
                  key={task._id}
                  className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow flex flex-col sm:flex-row justify-between items-start sm:items-center transition-transform hover:scale-105"
                >
                  <div className="text-left mb-4 sm:mb-0">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{task.title}</h4>
                    <p className="text-gray-700 dark:text-gray-300">{task.description}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Category: {task.category}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Due: {new Date(task.deadline).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Duration: {task.duration} min</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Priority: {task.priority}</p>
                    {task.isSelfCare && <p className="text-sm text-green-600 dark:text-green-300">Self-Care Task</p> }
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="bg-red-500 hover:bg-red-600 transition-colors text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handlePrioritizeTask(task._id)}
                      className="bg-green-500 hover:bg-green-600 transition-colors text-white px-4 py-2 rounded"
                    >
                      Prioritize
                    </button>
                    {/* Placeholder for update or Google Calendar integration */}  
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tasks available.</p>
          )}
        </div>
      </div>
      <footer className="p-4 bg-black/50 backdrop-blur-md text-center text-sm mt-8">
        © {new Date().getFullYear()} BalancedLife. All rights reserved.
      </footer>
    </div>
  );
}

export default withAuth(TasksPage);
