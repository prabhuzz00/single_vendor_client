// Phone authentication utilities using Firebase
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "@config/firebase";

/**
 * Initialize reCAPTCHA verifier
 * @param {string} containerId - The ID of the container element for reCAPTCHA
 * @returns {RecaptchaVerifier} The initialized reCAPTCHA verifier
 */
export const initializeRecaptcha = async (
  containerId = "recaptcha-container",
) => {
  try {
    // Clear any existing reCAPTCHA if possible (guard against destroyed instances)
    try {
      if (
        window.recaptchaVerifier &&
        typeof window.recaptchaVerifier.clear === "function"
      ) {
        window.recaptchaVerifier.clear();
      }
    } catch (clearErr) {
      // If clearing fails because the verifier is already destroyed, remove the ref and continue.
      console.warn(
        "reCAPTCHA clear() failed, resetting verifier reference:",
        clearErr,
      );
      try {
        delete window.recaptchaVerifier;
      } catch (e) {
        // ignore
      }
    }

    // Wait for grecaptcha to be ready before creating the verifier
    const waitForGrecaptcha = (timeout = 5000) =>
      new Promise((resolve, reject) => {
        const interval = 150;
        let waited = 0;
        const iv = setInterval(() => {
          if (
            window.grecaptcha &&
            typeof window.grecaptcha.render === "function"
          ) {
            clearInterval(iv);
            resolve(true);
          } else if (waited >= timeout) {
            clearInterval(iv);
            reject(new Error("grecaptcha not available"));
          }
          waited += interval;
        }, interval);
      });

    try {
      await waitForGrecaptcha(6000);
    } catch (gcErr) {
      console.warn("grecaptcha not ready after timeout:", gcErr);
      // proceed — RecaptchaVerifier may still work but log for debugging
    }

    // Create the verifier and ensure it's rendered before returning
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: "normal",
        callback: () => {
          // reCAPTCHA solved
        },
        "expired-callback": () => {
          // Response expired
        },
      });

      // Try rendering with a small retry loop to handle grecaptcha race
      const renderWithRetry = async (attempts = 3, delay = 300) => {
        let lastErr;
        for (let i = 0; i < attempts; i++) {
          try {
            // RecaptchaVerifier.render() may return a promise or number
            const r = window.recaptchaVerifier.render();
            if (r && typeof r.then === "function") await r;
            return true;
          } catch (err) {
            lastErr = err;
            await new Promise((r) => setTimeout(r, delay));
            delay *= 1.5;
          }
        }
        throw lastErr;
      };

      await renderWithRetry(4, 250);
    } catch (createErr) {
      console.error(
        "Error creating or rendering RecaptchaVerifier:",
        createErr,
      );
      // Try to clean up a partially created verifier
      try {
        if (
          window.recaptchaVerifier &&
          typeof window.recaptchaVerifier.clear === "function"
        ) {
          window.recaptchaVerifier.clear();
        }
        delete window.recaptchaVerifier;
      } catch (e) {
        // ignore
      }
      throw createErr;
    }

    return window.recaptchaVerifier;
  } catch (error) {
    console.error("Error initializing reCAPTCHA:", error);
    throw error;
  }
};

/**
 * Send OTP to phone number
 * @param {string} phoneNumber - The phone number in E.164 format (e.g., +1234567890)
 * @param {RecaptchaVerifier} recaptchaVerifier - The reCAPTCHA verifier instance
 * @returns {Promise<ConfirmationResult>} The confirmation result
 */
export const sendOTP = async (phoneNumber, recaptchaVerifier) => {
  try {
    // Ensure phone number is in E.164 format
    if (!phoneNumber.startsWith("+")) {
      throw new Error(
        "Phone number must be in E.164 format (e.g., +1234567890)",
      );
    }

    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      recaptchaVerifier,
    );

    // Save confirmation result to window for later use
    window.confirmationResult = confirmationResult;

    return confirmationResult;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

/**
 * Verify OTP code
 * @param {string} code - The OTP code received via SMS
 * @param {ConfirmationResult} confirmationResult - The confirmation result from sendOTP
 * @returns {Promise<UserCredential>} The user credential
 */
export const verifyOTP = async (code, confirmationResult) => {
  try {
    const result = await confirmationResult.confirm(code);
    return result;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

/**
 * Get the current Firebase user
 * @returns {User|null} The current user or null
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
export const signOutUser = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

/**
 * Get Firebase ID token for the current user
 * @returns {Promise<string>} The ID token
 */
export const getIdToken = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user is signed in");
    }
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error("Error getting ID token:", error);
    throw error;
  }
};
