import Head from "next/head";
import { ToastContainer } from "react-toastify";

//internal import

import Navbar from "@layout/navbar/Navbar";
import Footer from "@layout/footer/Footer";
import NavBarTop from "./navbar/NavBarTop";
import FooterTop from "@layout/footer/FooterTop";
import MobileFooter from "@layout/footer/MobileFooter";
// FeatureCard removed per request
import CookieBanner from "@components/common/CookieBanner";

const Layout = ({ title, description, children }) => {
  return (
    <>
      <ToastContainer />

      <div className="font-sans">
        <Head>
          <title>
            {title
              ? `StickersRhino | ${title}`
              : "StickersRhino - Custom Stickers & Decals Online"}
          </title>
          {description && <meta name="description" content={description} />}
          <link rel="icon" href="/favicon.png" />
        </Head>
        {/* <NavBarTop /> */}
        <Navbar />
        <div className="bg-gray-50">{children}</div>
        <MobileFooter />
        <div className="w-full">
          <div className="border-t border-gray-100 w-full">
            <Footer />
          </div>
        </div>

        {/* Cookie Consent Banner */}
        <CookieBanner />
      </div>
    </>
  );
};

export default Layout;
