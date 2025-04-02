import { getSession } from "next-auth/react";
import dbConnect from "../../../utils/dbConnect";
import Task from "../../../models/Task";
import { updateGoogleEvent } from "../../../utils/googleCalendar";
// not in use
export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const session = await getSession({ req });
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    const { taskId, updatedTask } = req.body;

    try {
      const task = await Task.findOne({ _id: taskId, userId: session.user.id });

      if (!task) return res.status(404).json({ error: "Task not found or unauthorized" });

      // Update fields only if provided in updatedTask
      Object.assign(task, updatedTask);

      await task.save();

      if (task.googleEventId) {
        await updateGoogleEvent(session.accessToken, task.googleEventId, task);
      }

      res.status(200).json({ message: "Task updated and calendar event modified", task });
    } catch (error) {
      console.error("Task Update Error:", error);
      res.status(500).json({ error: error.message || "Failed to update task" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}