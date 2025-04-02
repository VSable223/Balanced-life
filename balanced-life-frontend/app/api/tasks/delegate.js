import dbConnect from "../../../utils/dbConnect";
import Task from "../../../models/Task";
import { suggestDelegation } from "../../../utils/aiTaskDelegation";
import mongoose from "mongoose";
//not in use
export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { taskId } = req.body;

  if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ error: "Invalid or missing Task ID" });
  }

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    let assignedUser;
    try {
      assignedUser = await suggestDelegation(task);
    } catch (delegationError) {
      console.error("AI Delegation Error:", delegationError);
      return res.status(500).json({
        error: "AI delegation failed",
        details: delegationError.message,
      });
    }

    if (!assignedUser) {
      return res.status(200).json({ message: "No suitable delegate found" });
    }

    task.assignedTo = assignedUser;
    task.autoDelegated = true;
    await task.save();

    return res.status(200).json({
      message: "Task auto-delegated successfully",
      assignedTo: assignedUser,
      task,
    });
  } catch (error) {
    console.error("Task Delegation Error:", error);
    res.status(500).json({
      error: "Task delegation failed",
      details: error.message,
    });
  }
}