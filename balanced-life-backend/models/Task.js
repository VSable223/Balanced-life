import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  category: String, // work, family, personal, health, self-care
  priority: String, // high, medium, low
  deadline: Date,
  duration: Number, // in minutes
  completed: { type: Boolean, default: false },
  completedAt: Date, // Store completion time
  isSelfCare: { type: Boolean, default: false },
});

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
