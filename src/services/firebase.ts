// Firebase Web Config & Interface wrapper
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "mock-api-key",
  authDomain: "agritrap-59799.firebaseapp.com",
  projectId: "agritrap-59799",
  databaseURL: "https://agritrap-59799-default-rtdb.asia-southeast1.firebasedatabase.app/",
  storageBucket: "agritrap-59799.appspot.com",
  messagingSenderId: "59799",
  appId: "1:59799:web:mockid"
};

// Initialize Firebase App
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db: Database = getDatabase(app);

export { db };

