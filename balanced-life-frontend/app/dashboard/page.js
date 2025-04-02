"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import withAuth from "../components/withAuth";
import {
  FaHome,
  FaTasks,
  FaInfoCircle,
  FaUserAlt,
  FaChevronDown,
  FaRunning,
  FaMusic,
  FaBed,
  FaTint,
  FaHeart,
  FaSpa,
} from "react-icons/fa";

function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Get userId from session
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchData() {
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

        // Fetch Weekly Report
        const reportRes = await fetch("http://localhost:5000/api/ai/balance-analyzer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
        
        const responseText = await reportRes.text(); // Read response as text
        console.log("Response:", responseText);
        
        if (!reportRes.ok) {
          throw new Error(`Error: ${reportRes.status} - ${responseText}`);
        }
        
        const reportData = JSON.parse(responseText); // Parse JSON manually
        setReport(reportData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userId]);

  // Dynamic Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Motivational Quotes
  const quotes = [
    "Small daily improvements are the key to success.",
    "Believe in yourself and all that you are.",
    "Success is the sum of small efforts repeated daily.",
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  const selfCareActivities = [
    { icon: <FaTint className="text-blue-400 text-3xl" />, title: "Stay Hydrated", description: "Drink at least 8 glasses of water daily." },
    { icon: <FaRunning className="text-green-400 text-3xl" />, title: "Exercise", description: "Move your body for at least 30 minutes." },
    { icon: <FaMusic className="text-purple-400 text-3xl" />, title: "Listen to Music", description: "Relax with your favorite tunes." },
    { icon: <FaBed className="text-yellow-400 text-3xl" />, title: "Take a Nap", description: "Recharge with a short power nap." },
    { icon: <FaHeart className="text-red-400 text-3xl" />, title: "Practice Gratitude", description: "Reflect on things you're thankful for." },
    { icon: <FaSpa className="text-pink-400 text-3xl" />, title: "Meditation", description: "Calm your mind with deep breathing." },
  ];


  // Weekly Report Data for Pie Chart
  const pieData = report
    ? Object.entries(report).map(([key, value]) => ({ name: key, value }))
    : [];

  // Task Priority Colors
  const priorityColors = {
    High: "#FF4D4D",
    Medium: "#FFA500",
    Low: "#4CAF50",
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white">
      {/* Navbar */}
      <nav className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-black/50 backdrop-blur-md shadow-lg">
        <h1 className="text-3xl font-bold tracking-wide text-yellow-300">BalancedLife</h1>
        <div className="flex space-x-6">
          <a href="/dashboard" className="hover:text-yellow-300 flex items-center">
            <FaHome className="mr-1" /> Dashboard
          </a>
          <a href="/tasks" className="hover:text-yellow-300 flex items-center">
            <FaTasks className="mr-1" /> Tasks
          </a>
          <a href="/aboutus" className="hover:text-yellow-300 flex items-center">
            <FaInfoCircle className="mr-1" /> About Us
          </a>
        </div>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-1 bg-black/40 px-3 py-2 rounded-full hover:bg-black/60"
          >
            <FaUserAlt className="text-xl" />
            <FaChevronDown className={`transition-transform ${dropdownOpen ? "rotate-180" : "rotate-0"}`} />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-black/70 backdrop-blur-md shadow-md rounded-lg py-2">
              <a href="/profile" className="block px-4 py-2 hover:bg-black/50">Profile</a>
              <a href="/report" className="block px-4 py-2 hover:bg-black/50">Task Report</a>
              <button onClick={() => signOut()} className="w-full text-left px-4 py-2 hover:bg-red-500">Logout</button>
            </div>
          )}
        </div>
      </nav>

      {/* Greeting & Quote */}
      <div className="text-center mt-8">
        <h2 className="text-4xl font-semibold">{getGreeting()}, {session?.user?.name}!</h2>
        <p className="text-gray-200 italic mt-2">"{randomQuote}"</p>
      </div>

      {/* Task Flowchart */}
      <section className="p-6 mt-6">
        <h3 className="text-2xl font-semibold">Task Flow</h3>
        <div className="mt-4 flex flex-col items-center space-y-6">
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <div
                key={index}
                className="px-6 py-3 rounded-md shadow-md text-center w-3/4"
                style={{ backgroundColor: priorityColors[task.priority] || "#ffffff" }}
              >
                <h4 className="text-lg font-bold">{task.title}</h4>
                <p>📅 Deadline: {task.deadline}</p>
                <p>🔥 Priority: {task.priority}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-300">No tasks available.</p>
          )}
        </div>
      </section>

      {/* Self-Care Activities */}
      <section className="p-6">
        <h3 className="text-2xl font-semibold text-center">Recommended Self-Care Activities</h3>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
          {selfCareActivities.map((activity, index) => (
            <div key={index} className="p-6 bg-black/40 rounded-lg flex flex-col items-center shadow-lg hover:scale-105 transition-transform">
              {activity.icon}
              <h4 className="mt-2 text-lg font-semibold">{activity.title}</h4>
              <p className="text-gray-300 text-sm mt-1 text-center">{activity.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Weekly Report (Pie Chart) */}
      <section className="p-6">
        <h3 className="text-2xl font-semibold">Weekly Report</h3>
        {report ? (
          <PieChart width={400} height={300}>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={["#FF4D4D", "#FFA500", "#4CAF50"][index % 3]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        ) : (
          <p className="text-gray-300 mt-4">No report available.</p>
        )}
      </section>
    </div>
  );
}

export default withAuth(Dashboard);
