import { emailService } from "./emailService.js";
import User from "../models/User.js";
import dbConnect from "./dbConnect.js";

export async function sendSelfCareReminders() {
  await dbConnect();

  const users = await User.find({ "selfCareReminders.enabled": true });

  for (const user of users) {
    if (!user.email) {
      console.warn(`❌ Skipping user ${user.name} - Missing email`);
      continue;
    }
  
    const emailContent = `
      <h2>🌸 Daily Self-Care Reminder 🌸</h2>
      <p>Hello ${user.name},</p>
      <p>Take some time for yourself today! Here are your self-care suggestions:</p>
      <ul>${user.selfCareReminders.activities.map(activity => `<li>${activity}</li>`).join("")}</ul>
      <p>💖 Stay balanced, stay happy! 😊</p>
    `;
  
    try {
      await emailService(user.email, "Your Daily Self-Care Reminder", emailContent);
      console.log(`✅ Reminder email sent to ${user.email}`);
    } catch (error) {
      console.error(`❌ Failed to send email to ${user.email}:`, error);
    }
  }
  
}
