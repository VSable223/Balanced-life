import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  selfCareReminders: {
    enabled: { type: Boolean, default: true },
    time: { type: String, default: "18:00" }, 
    activities: [{ type: String, default: ["Hydration", "Mindfulness", "Stretching"] }],
  },
  settings: {
    notifications: { type: Boolean, default: true },
  },
  achievements: {
    streak: { type: Number, default: 0 },
    taskMilestone: { type: Number, default: 0 },
    selfCareChampion: { type: Boolean, default: false },
  },
});


// Prevents model re-registration issue in Next.js & Express apps
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User; // ✅ Use only ES Module export
