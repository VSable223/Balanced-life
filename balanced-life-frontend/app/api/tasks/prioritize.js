import dbConnect from "../../../utils/dbConnect";
import { prioritizeTasks } from "../../../utils/aiTaskPrioritization";
// not in use
export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { userId } = req.query;
    try {
      const prioritizedTasks = await prioritizeTasks(userId);
      res.status(200).json(prioritizedTasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to prioritize tasks" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}