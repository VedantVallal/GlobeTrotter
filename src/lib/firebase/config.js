import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDuq1EfdOxm-ehSV6cpH6e0Fhgs1sCbODE",
  authDomain: "globetrotter1.firebaseapp.com",
  projectId: "globetrotter1",
  storageBucket: "globetrotter1.firebasestorage.app",
  messagingSenderId: "992568084053",
  appId: "1:992568084053:web:58693d02841b132bda76dc",
  measurementId: "G-NH43HBWDR4"
};

// Initialize Firebase once across client/server & hot reloading
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Analytics only in browser
let analytics = null;
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics, isSupported }) => {
    isSupported().then((yes) => {
      if (yes) {
        analytics = getAnalytics(app);
      }
    });
  }).catch(() => {
    // Ignore analytics unsupported environments
  });
}

export { app, auth, db, storage, analytics, firebaseConfig };
