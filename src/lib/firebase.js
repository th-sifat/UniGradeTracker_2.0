import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "possible-signer-5pt51",
  appId: "1:566964121484:web:2bf34c0384c384f87bf0a9",
  apiKey: "AIzaSyB6cIBVzOI8XfWWxIkUI4jxEuOoBqZ12sc",
  authDomain: "possible-signer-5pt51.firebaseapp.com",
  storageBucket: "possible-signer-5pt51.firebasestorage.app",
  messagingSenderId: "566964121484",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);

// The setup tool created a named database "ai-studio-unigradetracker2-1ad5836b-bd1d-46f7-856b-ebbb3e9e7af1"
export const db = getFirestore(app, "ai-studio-unigradetracker2-1ad5836b-bd1d-46f7-856b-ebbb3e9e7af1");
export const auth = getAuth(app);
