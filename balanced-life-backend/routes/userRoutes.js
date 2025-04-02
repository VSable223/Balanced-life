import express from "express";
import User from "../models/User.js";
import Task from "../models/Task.js";

const router = express.Router();

// Update Settings
router.put("/settings/:userId", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { settings: req.body },
      { new: true }
    );
    res.json(user.settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Achievements
router.get("/achievements/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.json(user.achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Balance Insights (Tasks vs SelfCare)
router.get("/insights/:userId", async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.params.userId });
    const taskCount = tasks.filter((t) => !t.isSelfCare).length;
    const selfCareCount = tasks.filter((t) => t.isSelfCare).length;
    res.json({ taskCount, selfCareCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
