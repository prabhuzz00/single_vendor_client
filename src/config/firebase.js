// Firebase configuration and initialization
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAxuLaOvT0JNCCoHVCQE_Jqi1Q062rtqi4",
  authDomain: "stickersrhino-8a7f5.firebaseapp.com",
  projectId: "stickersrhino-8a7f5",
  storageBucket: "stickersrhino-8a7f5.firebasestorage.app",
  messagingSenderId: "575196464508",
  appId: "1:575196464508:web:be4bab5f575e3ee59050f9",
  measurementId: "G-D4YN48WVCM",
};

// Initialize Firebase only if it hasn't been initialized
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth, app };
