import admin from "firebase-admin";
import fs from "fs";

// Read firebase.json file
const serviceAccount = JSON.parse(fs.readFileSync("firebase.json", "utf-8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Initialize Firebase Messaging
export const messaging = admin.messaging();
export default admin;
