import { messaging } from "./firebase.js";
import Notification from "../models/Notification.js";

export async function sendNotification({ userId, type, token, title, message, email, phone }) {
  try {
    // Save to DB
    await Notification.create({ userId, type, title, message, status: 'pending' });

    switch (type) {
      case 'push':
        await messaging.send({ token, notification: { title, body: message } });
        break;

      case 'email':
        // Use nodemailer / sendgrid API
        console.log(`Email sent to ${email}: ${title} - ${message}`);
        break;

      case 'sms':
        // Use Twilio / other SMS provider
        console.log(`SMS sent to ${phone}: ${message}`);
        break;

      case 'in-app':
        // Save notification in DB to display in the frontend
        break;
    }

    // Update DB status to "sent"
    await Notification.updateOne({ userId, type, message }, { status: 'sent' });
    console.log(`✅ ${type.toUpperCase()} notification sent to User ${userId}`);
  } catch (error) {
    console.error(`❌ Failed to send ${type} notification`, error);
    await Notification.updateOne({ userId, type, message }, { status: 'failed' });
  }
}
