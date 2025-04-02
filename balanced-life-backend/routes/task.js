import express from "express";
import Task from "../models/Task.js";

const router = express.Router(); // ✅ Create an Express router

// ✅ Create a new task
router.post("/", async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get all tasks (for debugging/admin purposes)
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find();
        console.log("Fetched all tasks:", tasks);
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get tasks by user ID (Updated with validation)
router.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const tasks = await Task.find({ userId });

        if (tasks.length === 0) {
            return res.status(404).json({ message: "No tasks found for this user" });
        }

        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Update task by ID
router.put("/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Delete task by ID
router.delete("/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/sync", async (req, res) => {
    const { userId } = req.body;
  
    try {
      const tasks = await Task.find({ userId }); // Fetch tasks for the user
      res.json({ tasks });
    } catch (error) {
      console.error("Error syncing tasks:", error);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });
  
export default router; // ✅ ES Module export
