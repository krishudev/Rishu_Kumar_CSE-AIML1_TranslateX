
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth'; // Added Auth import
import { getFirestore } from 'firebase/firestore'; // Added Firestore import

// TODO: Replace with your actual Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  // Use environment variable for Realtime Database URL
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "YOUR_DATABASE_URL", // Required for Realtime DB
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Validate required config fields
const requiredConfigs = ['apiKey', 'authDomain', 'projectId', 'databaseURL']; // Added databaseURL
const missingConfigs = requiredConfigs.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig] || firebaseConfig[key as keyof typeof firebaseConfig]!.startsWith('YOUR_'));

let app;
let database;
let auth;
let firestore;

if (missingConfigs.length > 0) {
    console.warn(`Firebase configuration is incomplete or using placeholders. Missing or placeholder keys: ${missingConfigs.join(', ')}. Firebase services might not work correctly.`);
    // Initialize with placeholders so the app doesn't crash, but functionality will be limited
     app = !getApps().length ? initializeApp({}) : getApp(); // Initialize empty if config is missing
     // Avoid initializing services if config is missing/invalid
     database = null;
     auth = null;
     firestore = null;
} else {
    // Initialize Firebase if config is valid
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    database = getDatabase(app);
    auth = getAuth(app);
    firestore = getFirestore(app);
    console.log("Firebase Initialized Successfully");
}


export { app, database, auth, firestore };
