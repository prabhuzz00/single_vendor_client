import React, { useRef, useEffect } from "react";

import Layout from "@layout/Layout";
import useGetSetting from "@hooks/useGetSetting";
import PageHeader from "@components/header/PageHeader";
import CMSkeleton from "@components/preloader/CMSkeleton";
import useUtilsFunction from "@hooks/useUtilsFunction";
import PageTableOfContents from "@components/page/PageTableOfContents";

const PrivacyPolicy = () => {
  const { storeCustomizationSetting, loading, error } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();

  if (loading) {
    return (
      <Layout title="Privacy Policy" description="This is privacy policy page">
        <PageHeader
          headerBg={storeCustomizationSetting?.privacy_policy?.header_bg}
          title={showingTranslateValue(
            storeCustomizationSetting?.privacy_policy?.title,
          )}
        />
        <div className="bg-white">
          <div className="max-w-screen-2xl mx-auto lg:py-20 py-10 px-4 sm:px-10">
            <div className="max-w-4xl mx-auto">
              <CMSkeleton
                html
                count={15}
                height={15}
                error={error}
                loading={loading}
                data={storeCustomizationSetting?.privacy_policy?.description}
              />
              <br />
              <CMSkeleton count={15} height={15} loading={loading} />
              <br />
              <CMSkeleton count={15} height={15} loading={loading} />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Privacy Policy" description="This is privacy policy page">
      <PageHeader
        headerBg={storeCustomizationSetting?.privacy_policy?.header_bg}
        title={showingTranslateValue(
          storeCustomizationSetting?.privacy_policy?.title,
        )}
      />
      <div className="bg-white">
        <div className="max-w-7xl mx-auto lg:py-20 py-10 px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:gap-8">
            {/* Desktop TOC Sidebar */}
            <PrivacyPolicyTOC />

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="max-w-3xl mx-auto lg:mx-0 prose prose-lg">
                <style jsx global>{`
                  .prose table {
                    display: block;
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                  }
                `}</style>
                <div
                  id="information-we-collect"
                  className="mb-8 lg:mb-12 last:mb-0 scroll-mt-24"
                >
                  <h2 className="text-xl xl:text-2xl xl:leading-7 font-semibold font-serif mb-4 text-black">
                    Information We Collect
                  </h2>
                  <div className="font-sans leading-7 text-gray-700">
                    <p>When you use our leather goods platform, we collect:</p>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                      <li>
                        Personal information (name, email, shipping address)
                      </li>
                      <li>Payment information for order processing</li>
                      <li>Product preferences and browsing history</li>
                      <li>Customer service interactions and feedback</li>
                      <li>Device and usage information for analytics</li>
                    </ul>
                  </div>
                </div>

                <div
                  id="how-we-use"
                  className="mb-8 lg:mb-12 last:mb-0 scroll-mt-24"
                >
                  <h2 className="text-xl xl:text-2xl xl:leading-7 font-semibold font-serif mb-4 text-black">
                    How We Use Your Information
                  </h2>
                  <div className="font-sans leading-7 text-gray-700">
                    <p>We use your information to:</p>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                      <li>Process and fulfill your leather product orders</li>
                      <li>Provide personalized product recommendations</li>
                      <li>Send order confirmations and shipping updates</li>
                      <li>Improve our leather craftsmanship and services</li>
                      <li>Communicate about promotions and new collections</li>
                      <li>Ensure secure transactions and prevent fraud</li>
                    </ul>
                  </div>
                </div>

                <div
                  id="data-protection"
                  className="mb-8 lg:mb-12 last:mb-0 scroll-mt-24"
                >
                  <h2 className="text-xl xl:text-2xl xl:leading-7 font-semibold font-serif mb-4 text-black">
                    Data Protection & Security
                  </h2>
                  <div className="font-sans leading-7 text-gray-700">
                    <p>
                      We implement robust security measures to protect your
                      data:
                    </p>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                      <li>SSL encryption for all data transmissions</li>
                      <li>Secure payment processing with PCI compliance</li>
                      <li>Regular security audits and monitoring</li>
                      <li>Limited employee access to personal data</li>
                      <li>Data anonymization for analytics purposes</li>
                    </ul>
                  </div>
                </div>

                <div
                  id="cookies-tracking"
                  className="mb-8 lg:mb-12 last:mb-0 scroll-mt-24"
                >
                  <h2 className="text-xl xl:text-2xl xl:leading-7 font-semibold font-serif mb-4 text-black">
                    Cookies & Tracking
                  </h2>
                  <div className="font-sans leading-7 text-gray-700">
                    <p>We use cookies to enhance your shopping experience:</p>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                      <li>Session cookies for cart functionality</li>
                      <li>Analytics cookies to improve our website</li>
                      <li>Preference cookies for personalized content</li>
                      <li>Marketing cookies for relevant promotions</li>
                    </ul>
                    <p className="mt-4">
                      You can control cookie settings through your browser
                      preferences.
                    </p>
                  </div>
                </div>

                <div
                  id="third-party"
                  className="mb-8 lg:mb-12 last:mb-0 scroll-mt-24"
                >
                  <h2 className="text-xl xl:text-2xl xl:leading-7 font-semibold font-serif mb-4 text-black">
                    Third-Party Services
                  </h2>
                  <div className="font-sans leading-7 text-gray-700">
                    <p>
                      We work with trusted partners to provide our services:
                    </p>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                      <li>Payment processors (Stripe, PayPal)</li>
                      <li>Shipping carriers (UPS, FedEx, DHL)</li>
                      <li>Analytics providers (Google Analytics)</li>
                      <li>Marketing platforms (Mailchimp)</li>
                      <li>Customer support tools</li>
                    </ul>
                    <p className="mt-4">
                      These partners only receive necessary information to
                      perform their services.
                    </p>
                  </div>
                </div>

                <div
                  id="your-rights"
                  className="mb-8 lg:mb-12 last:mb-0 scroll-mt-24"
                >
                  <h2 className="text-xl xl:text-2xl xl:leading-7 font-semibold font-serif mb-4 text-black">
                    Your Rights & Choices
                  </h2>
                  <div className="font-sans leading-7 text-gray-700">
                    <p>You have the right to:</p>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                      <li>Access and download your personal data</li>
                      <li>Correct inaccurate information</li>
                      <li>Request deletion of your account and data</li>
                      <li>Opt-out of marketing communications</li>
                      <li>Restrict certain data processing</li>
                      <li>Data portability to other services</li>
                    </ul>
                    <p className="mt-4">
                      Contact our privacy team at privacy@leathercraft.com to
                      exercise these rights.
                    </p>
                  </div>
                </div>

                <div
                  id="data-retention"
                  className="mb-8 lg:mb-12 last:mb-0 scroll-mt-24"
                >
                  <h2 className="text-xl xl:text-2xl xl:leading-7 font-semibold font-serif mb-4 text-black">
                    Data Retention
                  </h2>
                  <div className="font-sans leading-7 text-gray-700">
                    <p>We retain your information only as long as necessary:</p>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                      <li>Order data: 7 years for tax and legal purposes</li>
                      <li>Account information: Until account deletion</li>
                      <li>Marketing preferences: Until opt-out</li>
                      <li>Analytics data: 26 months anonymized</li>
                      <li>Customer service records: 3 years</li>
                    </ul>
                  </div>
                </div>

                <div
                  id="international-transfers"
                  className="mb-8 lg:mb-12 last:mb-0 scroll-mt-24"
                >
                  <h2 className="text-xl xl:text-2xl xl:leading-7 font-semibold font-serif mb-4 text-black">
                    International Data Transfers
                  </h2>
                  <div className="font-sans leading-7 text-gray-700">
                    <p>
                      As a global leather goods retailer, your data may be
                      transferred internationally with appropriate safeguards:
                    </p>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                      <li>EU-US Privacy Shield compliance</li>
                      <li>Standard contractual clauses</li>
                      <li>Adequacy decisions where applicable</li>
                      <li>Encrypted data transfers</li>
                    </ul>
                  </div>
                </div>

                <div
                  id="policy-updates"
                  className="mb-8 lg:mb-12 last:mb-0 scroll-mt-24"
                >
                  <h2 className="text-xl xl:text-2xl xl:leading-7 font-semibold font-serif mb-4 text-black">
                    Policy Updates
                  </h2>
                  <div className="font-sans leading-7 text-gray-700">
                    <p>
                      We may update this policy to reflect changes in our
                      practices or legal requirements. Significant changes will
                      be communicated via email or website notification.
                    </p>
                    <p className="mt-4">
                      <strong>Last Updated:</strong>{" "}
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div
                  id="contact-us"
                  className="mb-8 lg:mb-12 last:mb-0 scroll-mt-24"
                >
                  <h2 className="text-xl xl:text-2xl xl:leading-7 font-semibold font-serif mb-4 text-black">
                    Contact Us
                  </h2>
                  <div className="font-sans leading-7 text-gray-700">
                    <p>For privacy-related questions or concerns:</p>
                    <ul className="list-none pl-0 mt-3 space-y-2">
                      <li>
                        <strong>Email:</strong> privacy@leathercraft.com
                      </li>
                      <li>
                        <strong>Phone:</strong> +1 (555) 123-LEATHER
                      </li>
                      <li>
                        <strong>Address:</strong> Privacy Team, LeatherCraft
                        Ltd., 123 Artisan Street, Craftville, CA 94102
                      </li>
                    </ul>
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

// Table of Contents Component for Privacy Policy
const PrivacyPolicyTOC = () => {
  const [activeId, setActiveId] = React.useState("");
  const [isVisible, setIsVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);

  const sections = [
    { id: "information-we-collect", text: "Information We Collect" },
    { id: "how-we-use", text: "How We Use Your Information" },
    { id: "data-protection", text: "Data Protection & Security" },
    { id: "cookies-tracking", text: "Cookies & Tracking" },
    { id: "third-party", text: "Third-Party Services" },
    { id: "your-rights", text: "Your Rights & Choices" },
    { id: "data-retention", text: "Data Retention" },
    { id: "international-transfers", text: "International Data Transfers" },
    { id: "policy-updates", text: "Policy Updates" },
    { id: "contact-us", text: "Contact Us" },
  ];

  React.useEffect(() => {
    const handleScroll = () => {
      const headings = sections.map((section) => ({
        id: section.id,
        element: document.getElementById(section.id),
      }));

      let currentActive = "";
      for (let i = headings.length - 1; i >= 0; i--) {
        const { id, element } = headings[i];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            currentActive = id;
            break;
          }
        }
      }
      setActiveId(currentActive);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    // Handle scroll direction for mobile TOC visibility
    const controlMobileTOC = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlMobileTOC);
    return () => window.removeEventListener("scroll", controlMobileTOC);
  }, [lastScrollY]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <>
      <div
        className={`lg:hidden sticky top-16 z-20 bg-white border-b border-gray-200 shadow-sm transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
          paddingLeft: "calc(50vw - 50%)",
          paddingRight: "calc(50vw - 50%)",
        }}
      >
        <div className="py-4 px-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
            On This Page
          </h3>
          <div className="overflow-x-auto -mx-4 px-4">
            <nav className="flex gap-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`
                    whitespace-nowrap px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex-shrink-0
                    ${
                      activeId === section.id
                        ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-400"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent"
                    }
                  `}
                >
                  {section.text}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop TOC - Vertical Sidebar */}
      <div className="hidden lg:block lg:w-64 flex-shrink-0">
        <div className="sticky top-24">
          <nav className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-xs font-bold text-gray-900 mb-4 uppercase tracking-wider">
              On This Page
            </h3>
            <ul className="space-y-1">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={`
                      block w-full text-left py-2 px-3 text-sm transition-all duration-200 rounded-md
                      ${
                        activeId === section.id
                          ? "text-yellow-700 font-semibold bg-yellow-100 border-l-3 border-yellow-500"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }
                    `}
                  >
                    {section.text}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
