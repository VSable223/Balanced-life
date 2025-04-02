import dbConnect from "../../../utils/dbConnect";
import { suggestFocusTime } from "../../../utils/focusScheduler";
//not in use
export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { userId } = req.query;
    try {
      const tasksWithFocusTime = await suggestFocusTime(userId);
      res.status(200).json(tasksWithFocusTime);
    } catch (error) {
      res.status(500).json({ error: "Failed to get focus time suggestions" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}




import { useEffect, useState } from "react";
import axios from "axios";
import TaskItem from "../components/TaskItem";

export default function Dashboard({ user }) {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const { data } = await axios.get(`/api/tasks/focus?userId=${user._id}`);
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Today's Focus Sessions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((task) => (
          <TaskItem key={task._id} task={task} onUpdated={fetchTasks} />
        ))}
      </div>
    </div>
  );
}