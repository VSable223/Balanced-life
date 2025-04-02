import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// ✅ Load environment variables
dotenv.config();

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is undefined. Check your .env file!");
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Import models (ensure these are Mongoose models)
import Task from "./models/Task.js";
import User from "./models/User.js";


 // 🚨 Move this to models/ if it's a Mongoose model

// ✅ Import routes
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/task.js";
import googleRoutes from "./routes/google.js";
import userRoutes from  "./routes/userRoutes.js";

app.use("/api/users", userRoutes);
// ✅ Import utils
import firebase from './utils/firebase.js';

// ✅ Import cron jobs if used

// ✅ Routes Setup
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/google", googleRoutes);



// ✅ API: Root
app.get("/", (req, res) => {
  res.send("Balanced Life Backend is running!");
});

// ✅ API: Get All Users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ API: Get All Tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
import notificationRoutes from './routes/notificationRoutes.js';
app.use('/api/notifications', notificationRoutes);


// ✅ API: AI-Based Task Delegation
import { suggestDelegation } from "./utils/aiTaskDelegation.js";

app.post("/api/ai/task-delegation", async (req, res) => {
  try {
    const result = await suggestDelegation(req.body);
    res.json({ success: true, assignedTo: result });
  } catch (err) {
    res.status(500).json({ error: "Task delegation failed", details: err.message });
  }
});


// ✅ API: AI-Based Task Prioritization
import { prioritizeTasks } from "./utils/aiTaskPrioritization.js";
app.post("/api/ai/task-prioritization", async (req, res) => {
  try {
    const result = await prioritizeTasks(req.body);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ API: Balance Analyzer
import { generateWeeklyReport } from "./utils/balanceAnalyzer.js";
app.post("/api/ai/balance-analyzer", async (req, res) => {
  try {
    const result = await generateWeeklyReport(req.body);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ API: Focus Scheduler
import { suggestFocusTime } from "./utils/focusScheduler.js";
app.post("/api/ai/focus-scheduler", async (req, res) => {
  try {
    const result = await suggestFocusTime(req.body);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ API: Self-Care Reminder
import { sendSelfCareReminders } from "./utils/selfCareReminder.js";
app.post("/api/self-care/reminder", async (req, res) => {
  try {
    const result = await sendSelfCareReminders(req.body);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ API: Send Email Service
import { emailService } from "./utils/emailService.js";
app.post("/api/email/send", async (req, res) => {
  try {
    const result = await emailService(req.body);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ API: Firebase Notification Trigger
app.post("/api/firebase/notify", async (req, res) => {
  try {
    const result = await firebase(req.body);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
 