const admin = require("firebase-admin");
const path = require("path");

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    const serviceAccount = require("./serviceAccountKey.json");
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase initialized with service account JSON");
  } catch (error) {
    if (process.env.FIREBASE_PRIVATE_KEY) {
      try {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
          }),
        });
        console.log("✅ Firebase initialized with environment variables");
      } catch (initError) {
        console.error("❌ Firebase initialization error:", initError.message);
      }
    } else {
      console.error(
        "❌ Firebase initialization failed. Please provide service account credentials."
      );
    }
  }
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
