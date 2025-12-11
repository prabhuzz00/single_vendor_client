import { useState, useEffect } from "react";

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a cookie preference choice
    const cookiePreference = localStorage.getItem("cookiePreference");

    if (!cookiePreference) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Prevent background scrolling and interaction when banner is visible
  useEffect(() => {
    if (showBanner) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev || "";
      };
    }
  }, [showBanner]);

  // Generate simple session ID
  const generateSessionId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Get or create session ID
  const getSessionId = () => {
    let sessionId = sessionStorage.getItem("cookieSessionId");
    if (!sessionId) {
      sessionId = generateSessionId();
      sessionStorage.setItem("cookieSessionId", sessionId);
    }
    return sessionId;
  };

  // Detect device type
  const getDeviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "tablet";
    }
    if (
      /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua
      )
    ) {
      return "mobile";
    }
    return "desktop";
  };

  // Detect browser
  const getBrowser = () => {
    const ua = navigator.userAgent;
    if (ua.indexOf("Chrome") > -1) return "Chrome";
    if (ua.indexOf("Safari") > -1) return "Safari";
    if (ua.indexOf("Firefox") > -1) return "Firefox";
    if (ua.indexOf("MSIE") > -1 || ua.indexOf("Trident/") > -1) return "IE";
    if (ua.indexOf("Edge") > -1) return "Edge";
    return "Unknown";
  };

  // Detect OS
  const getOS = () => {
    const ua = navigator.userAgent;
    if (ua.indexOf("Win") > -1) return "Windows";
    if (ua.indexOf("Mac") > -1) return "MacOS";
    if (ua.indexOf("Linux") > -1) return "Linux";
    if (ua.indexOf("Android") > -1) return "Android";
    if (ua.indexOf("iOS") > -1) return "iOS";
    return "Unknown";
  };

  // Save consent to database
  const saveCookieConsent = async (consentType, cookiePreferences) => {
    try {
      const consentData = {
        sessionId: getSessionId(),
        consentType,
        cookiePreferences,
        userAgent: navigator.userAgent,
        browser: getBrowser(),
        device: getDeviceType(),
        os: getOS(),
        referrer: document.referrer || "direct",
        pageUrl: window.location.href,
      };

      console.log("Sending cookie consent to API:", consentData);

      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/cookie-consent/`;
      console.log("API URL:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(consentData),
      });

      if (!response.ok) {
        console.error(
          "Failed to save cookie consent. Status:",
          response.status
        );
        const errorText = await response.text();
        console.error("Error response:", errorText);
      } else {
        const result = await response.json();
        console.log("Cookie consent saved successfully:", result);
      }
    } catch (error) {
      console.error("Error saving cookie consent:", error);
    }
  };

  const handleAcceptAll = async () => {
    const cookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };

    // Save preference to localStorage
    localStorage.setItem("cookiePreference", "accepted");
    localStorage.setItem("cookiePreferenceDate", new Date().toISOString());

    // Save to database
    await saveCookieConsent("accepted", cookiePreferences);

    // Enable all cookies/tracking
    // Add your analytics, marketing cookies initialization here
    // Example: gtag('consent', 'update', { ... });

    setShowBanner(false);
  };

  const handleRejectNonEssential = async () => {
    const cookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };

    // Save preference to localStorage
    localStorage.setItem("cookiePreference", "rejected");
    localStorage.setItem("cookiePreferenceDate", new Date().toISOString());

    // Save to database
    await saveCookieConsent("rejected", cookiePreferences);

    // Disable non-essential cookies/tracking
    // Keep only necessary cookies

    setShowBanner(false);
  };

  const handleCustomize = async () => {
    // Optional: Open a detailed cookie settings modal
    // For now, we'll treat it as customized (only necessary)
    const cookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };

    localStorage.setItem("cookiePreference", "customized");
    localStorage.setItem("cookiePreferenceDate", new Date().toISOString());

    // Save to database
    await saveCookieConsent("customized", cookiePreferences);

    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <>
      {/* Backdrop overlay to block background interaction */}
      <div className="fixed inset-0 bg-black bg-opacity-60 z-40" />

      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
        <div className="bg-gray-900 text-white border-t border-gray-800 shadow-2xl rounded-t-xl">
          <div className="max-w-fit mx-auto px-2 sm:px-6 lg:px-2 py-6">
            <div className="grid grid-cols-1 gap-4 items-start">
              {/* Text Content (full width) */}
              <div className="pr-0 md:pr-1">
                <p className="text-sm sm:text-base text-gray-100 leading-relaxed">
                  We use cookies and similar technologies to maintain security,
                  enable site functionality, and improve our site. We also use
                  cookies for marketing purposes and to provide personalized
                  content and advertising. You can reject all non-strictly
                  necessary cookies by clicking the corresponding consent
                  option. You may also customize your cookie settings or accept
                  all cookies to continue using the site. By accepting or
                  continuing to use the site you agree to our
                  <a
                    href="/privacy-policy"
                    className="text-yellow-400 hover:text-yellow-300 underline font-medium mx-1"
                  >
                    Privacy Policy
                  </a>
                  and our
                  <a
                    href="/terms-and-conditions"
                    className="text-yellow-400 hover:text-yellow-300 underline font-medium mx-1"
                  >
                    Terms of Use
                  </a>
                  .
                </p>
              </div>

              {/* Action Buttons: three buttons in a single horizontal row below text */}
              <div className="w-full flex items-center justify-end mt-3">
                <div className="flex flex-row gap-3 md:gap-4 items-center px-2">
                  <button
                    onClick={handleCustomize}
                    className="px-4 py-2 bg-white bg-opacity-95 text-gray-900 text-sm font-medium rounded-md border border-gray-200 hover:bg-opacity-100 transition"
                  >
                    Customize Cookie Settings
                  </button>

                  <button
                    onClick={handleRejectNonEssential}
                    className="px-4 py-2 bg-white bg-opacity-95 text-gray-900 text-sm font-medium rounded-md border border-gray-200 hover:bg-opacity-100 transition"
                  >
                    Reject Non-Strictly Necessary Cookies
                  </button>

                  <button
                    onClick={handleAcceptAll}
                    className="px-5 py-2 bg-yellow-400 text-gray-900 text-sm font-semibold rounded-md hover:bg-yellow-300 transition shadow-md"
                  >
                    Accept All Cookies
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline styles for animation */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.35s ease-out;
        }

        @media (max-width: 640px) {
          .fixed.bottom-0 {
            max-height: 90vh;
            overflow-y: auto;
          }
        }
      `}</style>
    </>
  );
};

export default CookieBanner;
