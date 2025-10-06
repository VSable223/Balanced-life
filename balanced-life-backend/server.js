import dotenv from "dotenv";

// ✅ Load environment variables
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";


console.log("starting server...");

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is undefined. Check your .env file!");
  process.exit(1);
}

const app = express();


const allowedOrigins = [
  "https://balanced-life.vercel.app", // ✅ production frontend
  "http://localhost:3000",            // ✅ for local testing
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // ✅ allow cookies & auth headers
};

// ✅ Apply CORS globally
app.use(cors(corsOptions));

// ✅ Handle preflight requests for all routes
app.options("*", cors(corsOptions));

// ✅ Example route
app.get("/api/test", (req, res) => {
  res.json({ message: "CORS is working!" });
});

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
// ✅ API: Notification Routes 
import notificationRoutes from './routes/notificationRoutes.js';
app.use('/api/notifications', notificationRoutes);




import { prioritizeTasks } from "./utils/aiTaskPrioritization.js";

app.post("/api/ai/task-prioritization", async (req, res) => {
  try {
    const { userId } = req.body;
    const tasks = await prioritizeTasks(userId);

    return res.json({
      success: true,
      tasks,   // ✅ return the sorted tasks here
    });
  } catch (error) {
    console.error("Task prioritization error:", error);
    res.status(500).json({ success: false, error: error.message });
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


// ✅ API: Firebase Notification Trigger (Lazy load after env ready)
app.post("/api/firebase/notify", async (req, res) => {
  try {
    const { default: firebase } = await import("./utils/firebase.js");
    const result = await firebase(req.body);
    res.json({ success: true, result });
  } catch (err) {
    console.error("Firebase notify error:", err);
    res.status(500).json({ error: err.message });
  }
});




// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
 