import Head from "next/head";
import dynamic from "next/dynamic";
import { ToastContainer } from "react-toastify";

//internal import

const Navbar = dynamic(() => import("@layout/navbar/Navbar"), { ssr: true });
const Footer = dynamic(() => import("@layout/footer/Footer"), { ssr: true });
const MobileFooter = dynamic(() => import("@layout/footer/MobileFooter"), {
  ssr: true,
});
const CookieBanner = dynamic(() => import("@components/common/CookieBanner"), {
  ssr: false,
});

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
