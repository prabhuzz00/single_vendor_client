// Firebase configuration and initialization
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Default configuration (fallback)
const defaultFirebaseConfig = {
  apiKey: "AIzaSyAxuLaOvT0JNCCoHVCQE_Jqi1Q062rtqi4",
  authDomain: "stickersrhino-8a7f5.firebaseapp.com",
  projectId: "stickersrhino-8a7f5",
  storageBucket: "stickersrhino-8a7f5.firebasestorage.app",
  messagingSenderId: "575196464508",
  appId: "1:575196464508:web:be4bab5f575e3ee59050f9",
  measurementId: "G-D4YN48WVCM",
};

let firebaseConfig = defaultFirebaseConfig;

// Fetch Firebase config from backend
async function fetchFirebaseConfig() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/setting/firebase/config`
    );
    if (response.ok) {
      const config = await response.json();
      if (config.enabled) {
        return {
          apiKey: config.apiKey,
          authDomain: config.authDomain,
          projectId: config.projectId,
          storageBucket: config.storageBucket,
          messagingSenderId: config.messagingSenderId,
          appId: config.appId,
          measurementId: config.measurementId,
        };
      }
    }
  } catch (error) {
    console.warn("Using default Firebase config:", error.message);
  }
  return defaultFirebaseConfig;
}

// Initialize Firebase
let app;
let auth;

async function initializeFirebase() {
  if (getApps().length === 0) {
    firebaseConfig = await fetchFirebaseConfig();
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } else {
    app = getApps()[0];
    auth = getAuth(app);
  }
  return { app, auth };
}

// For synchronous imports, use default config initially
if (typeof window !== "undefined" && getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);

  // Update with backend config asynchronously
  fetchFirebaseConfig().then((config) => {
    if (JSON.stringify(config) !== JSON.stringify(firebaseConfig)) {
      console.log("Firebase config updated from backend");
    }
  });
} else if (getApps().length > 0) {
  app = getApps()[0];
  auth = getAuth(app);
}

export { auth, app, initializeFirebase };
