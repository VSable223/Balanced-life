"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Navbar from "../components/Navbar";
import withAuth from "../components/withAuth";
import { FaRunning, FaMusic, FaBed, FaTint, FaHeart, FaSpa } from "react-icons/fa";

// Utility to convert hex color to rgba
const hexToRgba = (hex, alpha = 0.2) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        // Fetch tasks
        const tasksRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
        if (!tasksRes.ok) throw new Error(`Error: ${tasksRes.status}`);
        const tasksData = await tasksRes.json();
        setTasks(tasksData.tasks || []);

        // Fetch report (Completed vs Pending)
        const reportRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/report/${userId}`, {
          method: "GET",
        });
        const reportData = await reportRes.json();
        setReport(reportData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userId]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

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

  const priorityColors = {
    High: "#FF4D4D",
    Medium: "#FFA500",
    Low: "#4CAF50",
  };

  // ✅ Only keep Completion Pie Data
  const completionPieData = [
    { name: "Completed", value: report?.summary?.completed || 0 },
    { name: "Pending", value: report?.summary?.pending || 0 },
  ];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white">
      <Navbar />

      {/* Greeting & Quote */}
      <div className="text-center mt-8">
        <h2 className="text-4xl font-semibold">{getGreeting()}, {session?.user?.name}!</h2>
        <p className="text-gray-200 italic mt-2">"{randomQuote}"</p>
      </div>

      {/* Task Flow */}
      <section className="p-6 mt-6">
        <h3 className="text-2xl font-semibold">Task Flow (Incomplete Tasks)</h3>
        <div className="mt-4 flex flex-col items-center space-y-6">
          {tasks.length > 0 ? (
            tasks.filter((task) => !task.completed).map((task, idx) => (
              <div
                key={idx}
                className="px-6 py-4 rounded-lg shadow-md text-center w-3/4 border border-white/30"
                style={{
                  backgroundColor: hexToRgba(priorityColors[task.priority] || "#ffffff", 0.2),
                  borderLeft: `6px solid ${priorityColors[task.priority] || "#ffffff"}`,
                }}
              >
                <h4 className="text-lg font-bold">{task.title}</h4>
                <p>📅 Deadline: <span className="font-medium">{task.deadline ? new Date(task.deadline).toLocaleString() : "No deadline"}</span></p>
                <p>🔥 Priority: <span className="font-medium">{task.priority}</span></p>
                <p>⏳ Time Required: <span className="font-medium">{task.duration ? `${task.duration} min` : "Not specified"}</span></p>
              </div>
            ))
          ) : (
            <p className="text-gray-300">No incomplete tasks available.</p>
          )}
        </div>
      </section>

      {/* Report Section */}
      <section className="p-6">
        <h3 className="text-2xl font-semibold text-center">Summary Report</h3>
        <div className="flex justify-center mt-6">
          <div className="bg-black/30 p-4 rounded-lg shadow-lg">
            <h4 className="text-xl font-semibold text-center mb-4">Completion Status</h4>
            <PieChart width={800} height={500}>
              <Pie data={completionPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150}>
                <Cell fill="#4CAF50" /> {/* Completed */}
                <Cell fill="#FF4D4D" /> {/* Pending */}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>
      </section>

      {/* Self-Care Activities */}
      <section className="p-6">
        <h3 className="text-2xl font-semibold text-center">Recommended Self-Care Activities</h3>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
          {selfCareActivities.map((activity, idx) => (
            <div key={idx} className="p-6 bg-black/40 rounded-lg flex flex-col items-center shadow-lg hover:scale-105 transition-transform">
              {activity.icon}
              <h4 className="mt-2 text-lg font-semibold">{activity.title}</h4>
              <p className="text-gray-300 text-sm mt-1 text-center">{activity.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default withAuth(Dashboard);
