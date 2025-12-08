/**
 * Cookie Consent Management Utilities
 * Helps manage user cookie preferences throughout the application
 */

// Check if user has accepted all cookies
export const hasAcceptedCookies = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("cookiePreference") === "accepted";
};

// Check if user has rejected non-essential cookies
export const hasRejectedCookies = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("cookiePreference") === "rejected";
};

// Check if user has made any cookie preference
export const hasCookiePreference = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("cookiePreference") !== null;
};

// Get cookie preference
export const getCookiePreference = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("cookiePreference");
};

// Reset cookie preference (for testing or user request)
export const resetCookiePreference = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("cookiePreference");
  localStorage.removeItem("cookiePreferenceDate");
};

// Initialize analytics based on cookie consent
export const initializeAnalytics = () => {
  if (hasAcceptedCookies()) {
    // Initialize Google Analytics
    // Example: gtag('consent', 'update', {
    //   'analytics_storage': 'granted',
    //   'ad_storage': 'granted'
    // });

    // Initialize Facebook Pixel
    // Example: fbq('consent', 'grant');

    console.log("Analytics initialized - cookies accepted");
  } else {
    // Only essential cookies
    console.log("Only essential cookies enabled");
  }
};

// Set a cookie with expiry
export const setCookie = (name, value, days = 365) => {
  if (typeof window === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

// Get a cookie value
export const getCookie = (name) => {
  if (typeof window === "undefined") return null;

  const nameEQ = name + "=";
  const ca = document.cookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }

  return null;
};

// Delete a cookie
export const deleteCookie = (name) => {
  if (typeof window === "undefined") return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};
