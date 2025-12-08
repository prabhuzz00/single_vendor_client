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
export const initializeRecaptcha = (containerId = "recaptcha-container") => {
  try {
    // Clear any existing reCAPTCHA
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }

    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: "normal",
      callback: (response) => {
        // reCAPTCHA solved - allow signInWithPhoneNumber
        console.log("reCAPTCHA verified");
      },
      "expired-callback": () => {
        // Response expired. Ask user to solve reCAPTCHA again.
        console.log("reCAPTCHA expired");
      },
    });

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
        "Phone number must be in E.164 format (e.g., +1234567890)"
      );
    }

    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      recaptchaVerifier
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
