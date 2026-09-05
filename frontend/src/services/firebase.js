import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBId1TGIa9WAISgm9P0uG8swSd9HyqKNHU",
  authDomain: "farmer-60954.firebaseapp.com",
  projectId: "farmer-60954",
  storageBucket: "farmer-60954.firebasestorage.app",
  messagingSenderId: "1060826552601",
  appId: "1:1060826552601:web:6fbc573a105f914e9ecd88",
  measurementId: "G-G77D91GRFG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics (Browser environment check ke sath)
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// Named Exports
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;