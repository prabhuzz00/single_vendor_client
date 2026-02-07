import { useState, useEffect } from "react";
import SettingServices from "@services/SettingServices";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { FiPhone, FiLock, FiCheck } from "react-icons/fi";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import Layout from "@layout/Layout";
import { notifyError, notifySuccess } from "@utils/toast";
import {
  initializeRecaptcha,
  sendOTP,
  verifyOTP,
  getIdToken,
} from "@utils/phoneAuth";
import CustomerServices from "@services/CustomerServices";

const PhoneSignin = () => {
  const router = useRouter();
  const redirectUrl = useSearchParams().get("redirectUrl");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCodes, setCountryCodes] = useState([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Enter phone, 2: Enter OTP
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [recaptchaInitialized, setRecaptchaInitialized] = useState(false);

  useEffect(() => {
    // fetch available country codes from store settings
    (async () => {
      try {
        const settings = await SettingServices.getStoreSetting();
        const codes = settings?.phone_country_codes || [];
        setCountryCodes(codes);
        if (codes && codes.length > 0) {
          setSelectedCountryCode(codes[0].code || "+");
        }
      } catch (err) {
        // ignore
      }
    })();

    // Initialize reCAPTCHA when component mounts
    if (step === 1 && !recaptchaInitialized) {
      const initRecaptcha = async () => {
        try {
          // Clear any existing verifier first
          if (window.recaptchaVerifier) {
            try {
              window.recaptchaVerifier.clear();
            } catch (e) {}
          }

          const verifier = initializeRecaptcha("recaptcha-container");
          await verifier.render();
          setRecaptchaInitialized(true);
        } catch (error) {
          console.error("Failed to initialize reCAPTCHA:", error);
          notifyError(
            "Failed to initialize reCAPTCHA. Please refresh the page.",
          );
        }
      };

      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        initRecaptcha();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [step, recaptchaInitialized]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Compose full phone number using selected country code + phoneNumber
      const raw = phoneNumber.replace(/^\+/, "").replace(/\s+/g, "");
      const fullPhone = selectedCountryCode + raw;

      if (!fullPhone.startsWith("+")) {
        notifyError(
          "Phone number must include country code (e.g., +1234567890)",
        );
        setLoading(false);
        return;
      }

      if (raw.length < 6) {
        notifyError("Please enter a valid phone number");
        setLoading(false);
        return;
      }

      // Send OTP via Firebase
      const result = await sendOTP(fullPhone, window.recaptchaVerifier);
      setConfirmationResult(result);
      setStep(2);
      notifySuccess("OTP sent successfully! Check your phone.");
    } catch (error) {
      console.error("Error sending OTP:", error);

      // Handle specific Firebase errors
      if (error.code === "auth/invalid-phone-number") {
        notifyError("Invalid phone number format");
      } else if (error.code === "auth/too-many-requests") {
        notifyError("Too many requests. Please try again later.");
      } else if (error.code === "auth/quota-exceeded") {
        notifyError("SMS quota exceeded. Please try again later.");
      } else if (error.code === "auth/internal-error") {
        notifyError(
          "Firebase configuration error. Please check Firebase Console settings.",
        );
      } else if (error.code === "auth/captcha-check-failed") {
        notifyError("reCAPTCHA verification failed. Please try again.");
      } else {
        notifyError(error.message || "Failed to send OTP. Please try again.");
      }

      // Reset reCAPTCHA on error
      setRecaptchaInitialized(false);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!otp || otp.length !== 6) {
        notifyError("Please enter a valid 6-digit OTP");
        setLoading(false);
        return;
      }

      // Verify OTP with Firebase
      const result = await verifyOTP(otp, confirmationResult);

      // Get Firebase ID token
      const firebaseToken = await getIdToken();

      // Send Firebase token to backend for authentication
      const response = await CustomerServices.loginWithPhone({
        phoneNumber,
        firebaseToken,
        firebaseUid: result.user.uid,
      });

      // Use NextAuth to create session with all user data from backend
      const signInResult = await signIn("credentials", {
        redirect: false,
        email: response.email,
        token: response.token,
        _id: response._id,
        name: response.name,
        phone: response.phone,
        image: response.image || "",
        address: response.address || "",
        isPhoneAuth: true,
      });

      if (signInResult?.error) {
        notifyError(signInResult.error);
      } else if (signInResult?.ok) {
        notifySuccess("Successfully signed in!");

        // Check if user profile is incomplete (name or address missing)
        const isProfileIncomplete = !response.name || !response.address;

        if (isProfileIncomplete) {
          // Redirect to update profile if profile is incomplete
          router.push("/user/update-profile?fromPhoneAuth=true");
        } else {
          // Redirect to intended page if profile is complete
          const url = redirectUrl ? "/checkout" : "/user/dashboard";
          router.push(url);
        }
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);

      if (error.code === "auth/invalid-verification-code") {
        notifyError("Invalid OTP. Please check and try again.");
      } else if (error.code === "auth/code-expired") {
        notifyError("OTP has expired. Please request a new one.");
        setStep(1);
        setOtp("");
        setRecaptchaInitialized(false);
      } else {
        notifyError(error.message || "Failed to verify OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtp("");
    setStep(1);
    setRecaptchaInitialized(false);
    notifySuccess("Please send OTP again");
  };

  return (
    <Layout title="Phone Sign In" description="Sign in with phone number">
      <div
        className="mx-auto max-w-screen-2xl px-3 sm:px-10 min-h-screen relative"
        style={{
          backgroundImage: "url(/login_back.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

        <div className="py-4 flex flex-col lg:flex-row w-full relative z-10">
          <div className="w-full sm:p-5 lg:p-8">
            <div className="mx-auto text-left justify-center w-full max-w-lg px-4 py-8 sm:p-10 overflow-hidden align-middle transition-all transform bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl border-2 border-yellow-400">
              <div className="overflow-hidden mx-auto">
                <div className="text-center mb-6">
                  <div className="inline-block mb-4">
                    <Image
                      src="/logo/logo-color2.png"
                      alt="Logo"
                      width={120}
                      height={120}
                      className="mx-auto"
                    />
                  </div>
                  <h2 className="text-3xl font-bold font-serif text-black">
                    {step === 1 ? "Sign In with Phone" : "Enter OTP"}
                  </h2>
                  <p className="text-sm md:text-base text-gray-700 mt-2 mb-8">
                    {step === 1
                      ? "Enter your phone number to receive OTP"
                      : `OTP sent to ${phoneNumber}`}
                  </p>
                </div>

                {step === 1 ? (
                  // Step 1: Phone Number Input
                  <form
                    onSubmit={handleSendOTP}
                    className="flex flex-col justify-center"
                  >
                    <div className="grid grid-cols-1 gap-5">
                      <div className="form-group">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Phone Number (with country code)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <select
                              value={selectedCountryCode}
                              onChange={(e) =>
                                setSelectedCountryCode(e.target.value)
                              }
                              className="bg-transparent outline-none border-none text-sm"
                            >
                              {countryCodes && countryCodes.length > 0 ? (
                                countryCodes.map((c, i) => (
                                  <option key={i} value={c.code}>
                                    {c.name} {c.code}
                                  </option>
                                ))
                              ) : (
                                <option value="+">+</option>
                              )}
                            </select>
                          </div>
                          <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="1234567890"
                            className="w-full pl-36 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors"
                            required
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Include country code (e.g., +1 for US, +91 for India)
                        </p>
                      </div>

                      {/* reCAPTCHA container */}
                      <div className="flex justify-center my-4">
                        <div id="recaptcha-container"></div>
                      </div>

                      <button
                        disabled={loading || !recaptchaInitialized}
                        type="submit"
                        className="w-full text-center py-3 rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-600 transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <img
                              src="/loader/spinner.gif"
                              alt="Loading"
                              width={20}
                              height={20}
                            />
                            <span>Sending OTP...</span>
                          </>
                        ) : (
                          <>
                            <FiPhone className="w-5 h-5" />
                            <span>Send OTP</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  // Step 2: OTP Input
                  <form
                    onSubmit={handleVerifyOTP}
                    className="flex flex-col justify-center"
                  >
                    <div className="grid grid-cols-1 gap-5">
                      <div className="form-group">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Enter 6-digit OTP
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={otp}
                            onChange={(e) =>
                              setOtp(
                                e.target.value.replace(/\D/g, "").slice(0, 6),
                              )
                            }
                            placeholder="6 digti OTP"
                            maxLength={6}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors text-center text-2xl tracking-widest font-bold"
                            required
                          />
                        </div>
                      </div>

                      <button
                        disabled={loading}
                        type="submit"
                        className="w-full text-center py-3 rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-600 transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <img
                              src="/loader/spinner.gif"
                              alt="Loading"
                              width={20}
                              height={20}
                            />
                            <span>Verifying...</span>
                          </>
                        ) : (
                          <>
                            <FiCheck className="w-5 h-5" />
                            <span>Verify OTP</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={loading}
                        className="w-full text-center py-2 text-sm text-gray-600 hover:text-yellow-600 transition-colors disabled:opacity-50"
                      >
                        Didn't receive OTP? Resend
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setStep(1);
                          setOtp("");
                          setRecaptchaInitialized(false);
                        }}
                        className="w-full text-center py-2 text-sm text-gray-600 hover:text-yellow-600 transition-colors"
                      >
                        Change phone number
                      </button>
                    </div>
                  </form>
                )}

                <div className="flex flex-col items-center justify-center mt-6 mb-2">
                  <div className="text-sm text-center text-gray-600">
                    <span>Or sign in with </span>
                    <Link
                      href="/auth/login"
                      className="text-yellow-600 hover:text-yellow-700 underline font-medium"
                    >
                      Email & Password
                    </Link>
                  </div>
                  <div className="text-sm text-center text-gray-600 mt-2">
                    <span>Don't have an account? </span>
                    <Link
                      href="/auth/signup"
                      className="text-yellow-600 hover:text-yellow-700 underline font-medium"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PhoneSignin;
