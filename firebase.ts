import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAkFImHeUGnlC9fDyCbu470P5uYkKsDhkg",
  authDomain: "personal-book-reading-tracker.firebaseapp.com",
  databaseURL:
    "https://personal-book-reading-tracker-default-rtdb.firebaseio.com",
  projectId: "personal-book-reading-tracker",
  storageBucket: "personal-book-reading-tracker.firebasestorage.app",
  messagingSenderId: "36914128884",
  appId: "1:36914128884:web:70b26c00b6117c377bfba1",
  measurementId: "G-GZF8V597M4",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const messaging = getMessaging(app);

export const generateToken = async () => {
  const permission = await Notification.requestPermission();
  if (permission == "granted") {
    console.log(permission);
    const token = await getToken(messaging, {
      vapidKey:
        "BMPcVeoKnKgAYXCFVoIgIUGGepJtgvZWPxMeiU8hHOnvpM-V6wTF3YlNsu7pKvjuEylmIafrnJK1n04gnrfthwo",
    });
    console.log(token);
  }
};
