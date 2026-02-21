import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import { IoLockOpenOutline } from "react-icons/io5";
import { FiPhoneCall, FiUser } from "react-icons/fi";
import { signOut } from "next-auth/react";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

import { getUserSession } from "@lib/auth";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";

const NavBarTop = () => {
  const userInfo = getUserSession();
  const router = useRouter();
  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();

  const handleLogOut = () => {
    Cookies.remove("couponInfo");
    const rawEnv = process.env.NEXT_PUBLIC_STORE_DOMAIN || "";

    const normalize = (d) => {
      if (!d) return "";
      // remove surrounding quotes and trailing slashes
      return d
        .replace(/^\s*\"|\"\s*$/g, "")
        .replace(/\"/g, "")
        .replace(/\/+$/, "");
    };

    let domain = normalize(rawEnv) || "";

    // If env points to localhost or is empty, prefer current origin when available
    const isLocal = (u) => /localhost|127\.0\.0\.1/.test(u);

    try {
      const origin = typeof window !== "undefined" && window.location?.origin;
      if (!domain || isLocal(domain)) {
        if (origin && !isLocal(origin)) {
          domain = origin;
        } else {
          domain = "https://stickersrhino.com";
        }
      }
    } catch (e) {
      domain = domain || "https://stickersrhino.com";
    }

    signOut({ callbackUrl: domain });
  };

  const handleTokenExpiration = () => {
    if (userInfo) {
      const decoded = jwtDecode(userInfo?.token);
      const expireTime = new Date(decoded?.exp * 1000);
      const currentTime = new Date();

      if (currentTime >= expireTime) {
        handleLogOut();
      }
    }
  };

  useEffect(() => {
    handleTokenExpiration();
  }, [userInfo]);

  const renderNavItem = (href, text) => {
    return (
      <div>
        <Link href={href} className="font-medium hover:text-yellow-600">
          {showingTranslateValue(text)}
        </Link>
        <span className="mx-2">|</span>
      </div>
    );
  };

  return (
    <div className="hidden lg:block bg-yellow-50">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-10">
        <div className="text-gray-700 py-2 font-sans text-xs font-medium border-b border-gray-300 flex justify-between items-center">
          <span className="flex items-center">
            <FiPhoneCall className="mr-2" />
            {showingTranslateValue(
              storeCustomizationSetting?.navbar?.help_text,
            )}
            <a
              href={`tel:${
                storeCustomizationSetting?.navbar?.phone || "+099949343"
              }`}
              className="font-bold text-yellow-600 ml-1"
            >
              {storeCustomizationSetting?.navbar?.phone || "+099949343"}
            </a>
          </span>

          <div className="lg:text-right flex items-center navBar">
            {storeCustomizationSetting?.navbar?.about_menu_status &&
              renderNavItem(
                "/about-us",
                storeCustomizationSetting?.navbar?.about_us,
              )}
            {storeCustomizationSetting?.navbar?.contact_menu_status &&
              renderNavItem(
                "/contact-us",
                storeCustomizationSetting?.navbar?.contact_us,
              )}
            <Link
              href="/user/my-account"
              className="font-medium hover:text-yellow-600"
            >
              {showingTranslateValue(
                storeCustomizationSetting?.navbar?.my_account,
              )}
            </Link>
            <span className="mx-2">|</span>
            {userInfo?.email ? (
              <button
                onClick={handleLogOut}
                className="flex items-center font-medium hover:text-yellow-600"
              >
                <span className="mr-1">
                  <IoLockOpenOutline />
                </span>
                {showingTranslateValue(
                  storeCustomizationSetting?.navbar?.logout,
                )}
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center font-medium hover:text-yellow-600"
              >
                <span className="mr-1">
                  <FiUser />
                </span>
                {showingTranslateValue(
                  storeCustomizationSetting?.navbar?.login,
                )}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(NavBarTop), { ssr: false });
