import express from "express";
import Task from "../models/Task.js";
import jwt from "jsonwebtoken";

const router = express.Router(); // ✅ Create an Express router

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Access denied: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Expecting format "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: "Access denied: Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

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
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get tasks by user ID
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

// ✅ Update task
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

// ✅ Delete task
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

// ✅ Sync tasks for a user
router.post("/sync", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const tasks = await Task.find({ userId });
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// ✅ Protected route test
router.get("/my-tasks", verifyToken, async (req, res) => {
  res.json({ message: "Protected route accessed!", user: req.user });
});


// ✅ Report route - Only completed vs pending
router.get("/report/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const tasks = await Task.find({ userId });

    let completed = 0;
    let pending = 0;

    tasks.forEach(task => {
      if (task.completed) {
        completed++;
      } else {
        pending++;
      }
    });

    res.json({
      summary: { completed, pending }
    });
  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).json({ error: err.message });
  }
});


export default router;
