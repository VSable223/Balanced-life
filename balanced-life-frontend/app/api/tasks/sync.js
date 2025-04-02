import { getSession } from "next-auth/react";
import dbConnect from "../../../utils/dbConnect";
import Task from "../../../models/Task";
import { createGoogleEvent } from "../../../utils/googleCalendar";
// not in use
export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const session = await getSession({ req });
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    try {
      const tasks = await Task.find({ userId: session.user.id, completed: false }).sort({ deadline: 1 });

      for (const task of tasks) {
        await createGoogleEvent(session.accessToken, task);
      }

      res.status(200).json({ message: "Tasks synced to Google Calendar" });
    } catch (error) {
      console.error("Task Sync Error:", error);
      res.status(500).json({ error: "Failed to sync tasks" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}