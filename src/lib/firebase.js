import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDHduvHXuQj6A45vk0-RK2Q-q1sHhikRgA",
  authDomain: "udetracker-abe66.firebaseapp.com",
  projectId: "udetracker-abe66",
  storageBucket: "udetracker-abe66.firebasestorage.app",
  messagingSenderId: "922148318915",
  appId: "1:922148318915:web:48a1191a77f4553970fc76",
  measurementId: "G-07SLWVWJ96"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
// Notice we are NOT using the long AI Studio string here anymore!
export const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);