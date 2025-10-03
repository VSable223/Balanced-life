"use client";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import withAuth from "../components/withAuth";

function TasksPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "work",
    priority: "Medium",
    deadline: "",
    duration: "",
    isSelfCare: false,
    description: "",
  });

  // Fetch tasks for the specific user
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/tasks/sync", {
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

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      category: "work",
      priority: "Medium",
      deadline: "",
      duration: "",
      isSelfCare: false,
      description: "",
    });
    setEditingTask(null);
  };

  // Add or update task
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;

    try {
      if (editingTask) {
        const res = await fetch(`http://localhost:5000/api/tasks/${editingTask._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, userId }),
        });
        if (!res.ok) throw new Error(`Update failed: ${res.status}`);
        const updatedTask = await res.json();
        setTasks((prev) => prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
      } else {
        const res = await fetch("http://localhost:5000/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, userId }),
        });
        if (!res.ok) throw new Error(`Add task failed: ${res.status}`);
        const newTask = await res.json();
        setTasks((prev) => [...prev, newTask]);
      }
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      setCompletedTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  // Edit task
  const handleEditTask = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      category: task.category,
      priority: task.priority,
      deadline: task.deadline ? task.deadline.split("T")[0] : "",
      duration: task.duration,
      isSelfCare: task.isSelfCare,
      description: task.description,
    });
  };

  // Single task prioritize (local)
  const handlePrioritizeTask = (taskId) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task._id === taskId) {
          let newPriority = task.priority;
          if (task.priority === "Low") newPriority = "Medium";
          else if (task.priority === "Medium") newPriority = "High";
          return { ...task, priority: newPriority };
        }
        return task;
      })
    );
  };

  // Mark task as complete
  const handleCompleteTask = async (taskId) => {
    try {
      const taskToComplete = tasks.find((t) => t._id === taskId);
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...taskToComplete, completed: true }),
      });
      if (!res.ok) throw new Error(`Complete task failed: ${res.status}`);
      const updatedTask = await res.json();
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      setCompletedTasks((prev) => [...prev, updatedTask]);
    } catch (err) {
      console.error(err);
    }
  };

 
    // Prioritize all tasks (fetch from backend user-specific)
  const handlePrioritizeAll = async () => {
    try {
      if (!userId) return;
      const res = await fetch("http://localhost:5000/api/ai/task-prioritization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) throw new Error(`Error prioritizing all tasks: ${res.status}`);

      const data = await res.json();

      // ✅ Handle backend response structure safely
      if (data.success && data.tasks) {
        setTasks(data.tasks.filter((t) => !t.completed));
        setCompletedTasks(data.tasks.filter((t) => t.completed));
      } else if (Array.isArray(data)) {
        // If backend just returns an array of tasks
        setTasks(data.filter((t) => !t.completed));
        setCompletedTasks(data.filter((t) => t.completed));
      } else {
        console.error("Unexpected response from prioritization API:", data);
      }
    } catch (err) {
      console.error("PrioritizeAll Error:", err);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">Your Tasks</h2>

        {/* Add/Edit Task Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            {editingTask ? "Edit Task" : "Add New Task"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                name="deadline"
                value={formData.deadline}
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
            />
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
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
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
                {editingTask ? "Update Task" : "Add Task"}
              </button>
            </div>
          </form>
        </div>

        {/* Incomplete Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Incomplete Tasks</h3>
            {tasks.length > 0 && (
              <button
                onClick={handlePrioritizeAll}
                className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-4 py-2 rounded"
              >
                Prioritize All
              </button>
            )}
          </div>
          {loading ? (
            <p>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p>No tasks available.</p>
          ) : (
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
                    {task.isSelfCare && <p className="text-sm text-green-600 dark:text-green-300">Self-Care Task</p>}
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="bg-yellow-500 hover:bg-yellow-600 transition-colors text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>
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
                    <button
                      onClick={() => handleCompleteTask(task._id)}
                      className="bg-purple-600 hover:bg-purple-700 transition-colors text-white px-4 py-2 rounded"
                    >
                      Complete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Completed Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Completed Tasks</h3>
          {completedTasks.length === 0 ? (
            <p>No completed tasks.</p>
          ) : (
            <ul className="space-y-4">
              {completedTasks.map((task) => (
                <li
                  key={task._id}
                  className="p-4 bg-gray-200 dark:bg-gray-600 rounded-lg shadow flex flex-col sm:flex-row justify-between items-start sm:items-center"
                >
                  <div className="text-left">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{task.title}</h4>
                    <p className="text-gray-700 dark:text-gray-300">{task.description}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Category: {task.category}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Due: {new Date(task.deadline).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Duration: {task.duration} min</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Priority: {task.priority}</p>
                    {task.isSelfCare && <p className="text-sm text-green-600 dark:text-green-300">Self-Care Task</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default withAuth(TasksPage);
