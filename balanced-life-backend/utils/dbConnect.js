import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is undefined. Check your .env file!");
  process.exit(1); // Stop execution if no MongoDB URI
}

let isConnected = false; // Track connection status

const dbConnect = async () => {
  if (isConnected) {
    console.log("✅ Using existing MongoDB connection.");
    return;
  }

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log("✅ MongoDB connected successfully.");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Exit on failure
  }
};

export default dbConnect;

