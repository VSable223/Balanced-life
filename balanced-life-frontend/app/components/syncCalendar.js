"use client";
// not in use
import axios from "axios";
import { useSession, signIn } from "next-auth/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Loader, CheckCircle, XCircle } from "lucide-react";

export default function SyncCalendar() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState(""); // success | error

  const syncTasks = async () => {
    setLoading(true);
    setStatusMessage("");
    setStatusType("");

    try {
      await axios.post("/api/tasks/sync");
      setStatusMessage("Tasks successfully synced to Google Calendar!");
      setStatusType("success");
    } catch (error) {
      console.error("Sync error:", error);
      setStatusMessage("An error occurred while syncing. Please try again.");
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center bg-white p-6 rounded-lg shadow-md">
      {status === "loading" ? (
        <div className="flex items-center justify-center">
          <Loader className="animate-spin w-5 h-5 text-gray-500" />
        </div>
      ) : session ? (
        <button
          onClick={syncTasks}
          className={`flex items-center justify-center px-5 py-2.5 rounded-lg text-white font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
          }`}
          disabled={loading}
          title="Sync your tasks with Google Calendar"
        >
          {loading ? (
            <Loader className="animate-spin mr-2 w-5 h-5" />
          ) : (
            "Sync with Google Calendar 📅"
          )}
        </button>
      ) : (
        <button
          onClick={() => signIn("google")}
          className="bg-green-500 text-white px-5 py-2.5 rounded-lg hover:bg-green-600 transition"
          title="Sign in with Google to sync tasks"
        >
          Sign in with Google
        </button>
      )}

      {statusMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 flex items-center justify-center text-sm ${
            statusType === "success" ? "text-green-600" : "text-red-600"
          }`}
          aria-live="polite"
        >
          {statusType === "success" ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <XCircle className="w-5 h-5 mr-2" />
          )}
          {statusMessage}
        </motion.div>
      )}
    </div>
  );
}
