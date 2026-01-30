import React from "react";
import Link from "next/link";

import Layout from "@layout/Layout";
import useGetSetting from "@hooks/useGetSetting";
import PageHeader from "@components/header/PageHeader";
import CMSkeleton from "@components/preloader/CMSkeleton";
import useUtilsFunction from "@hooks/useUtilsFunction";

const TermAndConditions = () => {
  const { showingTranslateValue } = useUtilsFunction();
  const { storeCustomizationSetting, loading, error } = useGetSetting();

  if (loading) {
    return (
      <Layout
        title="Terms & Conditions"
        description="This is terms and conditions page"
      >
        <PageHeader
          headerBg={storeCustomizationSetting?.term_and_condition?.header_bg}
          title={showingTranslateValue(
            storeCustomizationSetting?.term_and_condition?.title,
          )}
        />
        <div className="bg-white">
          <div className="max-w-screen-2xl mx-auto lg:py-20 py-10 px-3 sm:px-10">
            <div className="max-w-4xl mx-auto">
              <CMSkeleton
                html
                count={15}
                height={15}
                error={error}
                loading={loading}
                data={
                  storeCustomizationSetting?.term_and_condition?.description
                }
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
    <Layout
      title="Terms & Conditions"
      description="This is terms and conditions page"
    >
      <PageHeader
        headerBg={storeCustomizationSetting?.term_and_condition?.header_bg}
        title={showingTranslateValue(
          storeCustomizationSetting?.term_and_condition?.title,
        )}
      />
      <div className="bg-white">
        <div className="max-w-7xl mx-auto lg:py-20 py-10 px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:gap-8">
            {/* Desktop TOC Sidebar */}
            <TermsAndConditionsTOC />

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
                  id="acceptance-of-terms"
                  className="mb-8 lg:mb-12 last:mb-0 scroll-mt-24"
                >
                  <h2 className="text-xl xl:text-2xl xl:leading-7 font-semibold font-serif mb-4 text-black">
                    Acceptance of Terms
                  </h2>
                  <div className="font-sans leading-7 text-gray-700">
                    <p>
                      By accessing and purchasing from LeatherCraft, you accept
                      and agree to be bound by these Terms and Conditions. Our
                      handcrafted leather goods are subject to the following
                      terms.
                    </p>
                  </div>
                </div>

                <div
                  id="product-information"
                  className="mb-8 lg:mb-12 last:mb-0 scroll-mt-24"
                >
                  <h2 className="text-xl xl:text-2xl xl:leading-7 font-semibold font-serif mb-4 text-black">
                    Product Information & Authenticity
                  </h2>
                  <div className="font-sans leading-7 text-gray-700">
                    <p>All leather products featured on our platform are:</p>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                      <li>
                        Handcrafted using genuine leather and traditional
                        techniques
                      </li>
                      <li>
                        Photographed to represent actual colors and textures
                      </li>
                      <li>
                        Subject to natural variations in leather grain and color
                      </li>
                      <li>
                        Priced according to craftsmanship and material quality
                      </li>
                    </ul>
                    <p className="mt-4">
                      We guarantee the authenticity of all our leather materials
                      and craftsmanship.
                    </p>
                  </div>
                </div>

                <div
                  id="ordering-payment"
                  className="mb-8 lg:mb-12 last:mb-0 scroll-mt-24"
                >
                  <h2 className="text-xl xl:text-2xl xl:leading-7 font-semibold font-serif mb-4 text-black">
                    Ordering & Payment
                  </h2>
                  <div className="font-sans leading-7 text-gray-700">
                    <p>
                      <strong>Order Process:</strong>
                    </p>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                      <li>
                        All orders are subject to availability and confirmation
                      </li>
                      <li>Custom orders require additional production time</li>
                      <li>Prices are in USD and include applicable taxes</li>
                      <li>
                        We accept major credit cards and secure payment methods
                      </li>
                    </ul>
                    <p className="mt-4">
                      <strong>Payment Security:</strong> All transactions are
                      encrypted and processed through PCI-compliant payment
                      gateways.
                    </p>
                  </div>
                </div>

                <div
                  id="shipping-delivery"
                  className="mb-8 lg:mb-12 last:mb-0 scroll-mt-24"
                >
                  <h2 className="text-xl xl:text-2xl xl:leading-7 font-semibold font-serif mb-4 text-black">
                    Shipping & Delivery
                  </h2>
                  <div className="font-sans leading-7 text-gray-700">
                    <p>
                      <strong>Production & Shipping Times:</strong>
                    </p>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                      <li>Ready-to-ship items: 1-3 business days processing</li>
                      <li>Custom orders: 2-4 weeks production time</li>
                      <li>International shipping: 7-21 business days</li>
                      <li>Tracking information provided for all orders</li>
                    </ul>
                    <p className="mt-4">
                      Shipping costs are calculated at checkout based on
                      destination and package weight.
                    </p>
                  </div>
                </div>

                <div
                  id="returns-exchanges"
                  className="mb-8 lg:mb-12 last:mb-0 scroll-mt-24"
                >
                  <h2 className="text-xl xl:text-2xl xl:leading-7 font-semibold font-serif mb-4 text-black">
                    Returns & Exchanges
                  </h2>
                  <div className="font-sans leading-7 text-gray-700">
                    <p>
                      <strong>30-Day Return Policy:</strong>
                    </p>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                      <li>Items must be returned in original condition</li>
                      <li>Custom and personalized items are final sale</li>
                      <li>
                        Return shipping costs are customer's responsibility
                      </li>
                      <li>Refunds processed within 7-10 business days</li>
                    </ul>
                    <p className="mt-4">
                      <strong>Defective Products:</strong> We stand behind our
                      craftsmanship. Defective items will be repaired or
                      replaced at our discretion.
                    </p>
                  </div>
                </div>

                <div
                  id="leather-care"
                  className="mb-8 lg:mb-12 last:mb-0 scroll-mt-24"
                >
                  <h2 className="text-xl xl:text-2xl xl:leading-7 font-semibold font-serif mb-4 text-black">
                    Leather Care & Maintenance
                  </h2>
                  <div className="font-sans leading-7 text-gray-700">
                    <p>Our leather products require proper care:</p>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                      <li>Keep away from direct sunlight and heat sources</li>
                      <li>Use leather conditioner periodically</li>
                      <li>Clean with damp cloth and mild soap</li>
                      <li>Store in breathable dust bags provided</li>
                    </ul>
                    <p className="mt-4">
                      Improper care may void warranty coverage.
                    </p>
                  </div>
                </div>

                <div
                  id="intellectual-property"
                  className="mb-8 lg:mb-12 last:mb-0 scroll-mt-24"
                >
                  <h2 className="text-xl xl:text-2xl xl:leading-7 font-semibold font-serif mb-4 text-black">
                    Intellectual Property
                  </h2>
                  <div className="font-sans leading-7 text-gray-700">
                    <p>All content on LeatherCraft is protected:</p>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                      <li>Product designs are original and copyrighted</li>
                      <li>Photography and content may not be reproduced</li>
                      <li>Brand names and logos are registered trademarks</li>
                      <li>Unauthorized commercial use is prohibited</li>
                    </ul>
                  </div>
                </div>

                <div
                  id="user-accounts"
                  className="mb-8 lg:mb-12 last:mb-0 scroll-mt-24"
                >
                  <h2 className="text-xl xl:text-2xl xl:leading-7 font-semibold font-serif mb-4 text-black">
                    User Accounts & Responsibilities
                  </h2>
                  <div className="font-sans leading-7 text-gray-700">
                    <p>When creating an account, you agree to:</p>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                      <li>Provide accurate and current information</li>
                      <li>
                        Maintain account security and password confidentiality
                      </li>
                      <li>
                        Not use the site for illegal or unauthorized purposes
                      </li>
                      <li>
                        Accept responsibility for all activities under your
                        account
                      </li>
                    </ul>
                  </div>
                </div>

                <div
                  id="limitation-liability"
                  className="mb-8 lg:mb-12 last:mb-0 scroll-mt-24"
                >
                  <h2 className="text-xl xl:text-2xl xl:leading-7 font-semibold font-serif mb-4 text-black">
                    Limitation of Liability
                  </h2>
                  <div className="font-sans leading-7 text-gray-700">
                    <p>LeatherCraft shall not be liable for:</p>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                      <li>Indirect, incidental, or consequential damages</li>
                      <li>Natural variations in leather products</li>
                      <li>Shipping delays beyond our control</li>
                      <li>Improper care or misuse of products</li>
                      <li>Third-party services or links</li>
                    </ul>
                  </div>
                </div>

                <div
                  id="privacy-data"
                  className="mb-8 lg:mb-12 last:mb-0 scroll-mt-24"
                >
                  <h2 className="text-xl xl:text-2xl xl:leading-7 font-semibold font-serif mb-4 text-black">
                    Privacy & Data Protection
                  </h2>
                  <div className="font-sans leading-7 text-gray-700">
                    <p>
                      Your privacy is important to us. Please review our{" "}
                      <Link
                        href="/privacy-policy"
                        className="text-yellow-600 hover:text-yellow-700 transition-colors"
                      >
                        Privacy Policy
                      </Link>{" "}
                      for detailed information about how we collect, use, and
                      protect your personal data.
                    </p>
                  </div>
                </div>

                <div
                  id="governing-law"
                  className="mb-8 lg:mb-12 last:mb-0 scroll-mt-24"
                >
                  <h2 className="text-xl xl:text-2xl xl:leading-7 font-semibold font-serif mb-4 text-black">
                    Governing Law & Dispute Resolution
                  </h2>
                  <div className="font-sans leading-7 text-gray-700">
                    <p>
                      These terms are governed by the laws of California. Any
                      disputes shall be resolved through arbitration in San
                      Francisco, CA.
                    </p>
                  </div>
                </div>

                <div
                  id="changes-to-terms"
                  className="mb-8 lg:mb-12 last:mb-0 scroll-mt-24"
                >
                  <h2 className="text-xl xl:text-2xl xl:leading-7 font-semibold font-serif mb-4 text-black">
                    Changes to Terms
                  </h2>
                  <div className="font-sans leading-7 text-gray-700">
                    <p>
                      We reserve the right to modify these terms at any time.
                      Continued use of our services constitutes acceptance of
                      updated terms.
                    </p>
                    <p className="mt-4">
                      <strong>Last Updated:</strong>{" "}
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div
                  id="contact-information"
                  className="mb-8 lg:mb-12 last:mb-0 scroll-mt-24"
                >
                  <h2 className="text-xl xl:text-2xl xl:leading-7 font-semibold font-serif mb-4 text-black">
                    Contact Information
                  </h2>
                  <div className="font-sans leading-7 text-gray-700">
                    <p>For questions about these Terms & Conditions:</p>
                    <ul className="list-none pl-0 mt-3 space-y-2">
                      <li>
                        <strong>Email:</strong> legal@leathercraft.com
                      </li>
                      <li>
                        <strong>Phone:</strong> +1 (555) 123-LEGAL
                      </li>
                      <li>
                        <strong>Address:</strong> Legal Department, LeatherCraft
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

// Table of Contents Component for Terms and Conditions
const TermsAndConditionsTOC = () => {
  const [activeId, setActiveId] = React.useState("");
  const [isVisible, setIsVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);

  const sections = [
    { id: "acceptance-of-terms", text: "Acceptance of Terms" },
    { id: "product-information", text: "Product Information & Authenticity" },
    { id: "ordering-payment", text: "Ordering & Payment" },
    { id: "shipping-delivery", text: "Shipping & Delivery" },
    { id: "returns-exchanges", text: "Returns & Exchanges" },
    { id: "leather-care", text: "Leather Care & Maintenance" },
    { id: "intellectual-property", text: "Intellectual Property" },
    { id: "user-accounts", text: "User Accounts & Responsibilities" },
    { id: "limitation-liability", text: "Limitation of Liability" },
    { id: "privacy-data", text: "Privacy & Data Protection" },
    { id: "governing-law", text: "Governing Law & Dispute Resolution" },
    { id: "changes-to-terms", text: "Changes to Terms" },
    { id: "contact-information", text: "Contact Information" },
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
      {/* Mobile TOC - Horizontal Scroll */}
      <div
        className={`lg:hidden sticky top-16 z-20 bg-white border-b border-gray-200 shadow-md transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
          paddingLeft: "calc(50vw - 50%)",
          paddingRight: "calc(50vw - 50%)",
        }}
      >
        <div className="py-3 px-4">
          <h3 className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
            On This Page
          </h3>
          <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
            <nav className="flex gap-2 pb-1">
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
          </div>{" "}
        </div>{" "}
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

export default TermAndConditions;
