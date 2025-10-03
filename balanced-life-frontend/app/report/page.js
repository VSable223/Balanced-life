"use client";

import { useState, useEffect } from "react";
import { FaHome, FaStar } from "react-icons/fa";
import { useSession } from "next-auth/react";
import withAuth from "../components/withAuth";

function TaskReportPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (!res.ok) throw new Error(`Error fetching tasks: ${res.status}`);

        const data = await res.json();
        // Split into incomplete and completed tasks
        setTasks(data.tasks.filter((t) => !t.completed));
        setCompletedTasks(data.tasks.filter((t) => t.completed));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [userId]);

  const renderTask = (task) => (
    <div
      key={task._id}
      className="border rounded-lg p-4 mb-3 bg-white shadow-md text-gray-900 hover:scale-105 transition-transform duration-200"
    >
      <p><strong>Title:</strong> {task.title}</p>
      <p><strong>Description:</strong> {task.description}</p>
      <p><strong>Duration:</strong> {task.duration} min</p>
      <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
      <p><strong>Priority:</strong> {task.priority}</p>
      {task.isSelfCare && <p className="text-green-600">Self-Care Task</p>}
    </div>
  );

  const renderStars = (count) => {
    return Array.from({ length: count }).map((_, i) => (
      <FaStar key={i} className="text-yellow-400 text-xl mr-1 animate-pulse" />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white">
      {/* Header */}
      <div className="bg-purple-800 text-center py-6 shadow-md flex items-center justify-center relative">
        <a
          href="/dashboard"
          className="absolute left-6 top-6 hover:text-yellow-300 flex items-center"
        >
          <FaHome className="mr-2 text-2xl" />
          <span>Dashboard</span>
        </a>
        <h1 className="text-3xl font-bold">Task Report</h1>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Tasks Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Incomplete Tasks */}
          <div className="bg-red-50 p-6 rounded-2xl shadow-lg text-gray-900">
            <h2 className="text-2xl font-semibold mb-4">⏳ Incomplete Tasks</h2>
            {tasks.length === 0 ? <p>No incomplete tasks!</p> : tasks.map(renderTask)}
          </div>

          {/* Completed Tasks */}
          <div className="bg-blue-50 p-6 rounded-2xl shadow-lg text-gray-900">
            <h2 className="text-2xl font-semibold mb-4">✅ Completed Tasks</h2>
            {completedTasks.length === 0 ? <p>No completed tasks yet.</p> : completedTasks.map(renderTask)}
          </div>
        </div>

        {/* Rewards Section */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">🏆 Rewards</h2>
          <p className="mb-4">
            You've completed {completedTasks.length} {completedTasks.length === 1 ? "task" : "tasks"}!
          </p>
          <div className="flex justify-center">{renderStars(completedTasks.length)}</div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(TaskReportPage);
