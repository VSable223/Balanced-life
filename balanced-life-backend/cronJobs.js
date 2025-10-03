import cron from "node-cron";
import axios from "axios";

// Run every Sunday at 8 AM
cron.schedule("0 8 * * 0", async () => {
  console.log("⏳ Sending weekly reports...");
  await axios.post("http://localhost:5000/api/report");
});




// Run every day at 6 PM
cron.schedule("0 18 * * *", async () => {
  console.log("⏳ Sending daily self-care reminders...");
  await axios.post("http://localhost:5000/api/sendSelfCareReminder");
});

export default {}; // Export an empty object or your actual module
