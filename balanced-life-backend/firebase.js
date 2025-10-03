import admin from "firebase-admin";

// Parse Firebase config from environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin;
