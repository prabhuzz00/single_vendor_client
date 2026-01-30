import React, { useState, useEffect } from "react";

const PageTableOfContents = ({ htmlContent }) => {
  const [headings, setHeadings] = React.useState([]);
  const [activeId, setActiveId] = React.useState("");
  const [isVisible, setIsVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);

  React.useEffect(() => {
    // Extract headings from HTML content
    if (!htmlContent) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    // Get all h1, h2 elements
    const headingElements = doc.querySelectorAll("h1, h2, h3");

    const extractedHeadings = Array.from(headingElements).map(
      (heading, index) => {
        const text = heading.textContent.trim();
        // Create a slug from the heading text
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim();

        return {
          id: `section-${index}-${id}`,
          text,
          level: heading.tagName.toLowerCase(),
        };
      },
    );

    setHeadings(extractedHeadings);
  }, [htmlContent]);

  React.useEffect(() => {
    // Handle scroll to set active heading
    const handleScroll = () => {
      const headingElements = headings.map((heading) =>
        document.getElementById(heading.id),
      );

      let currentActive = "";

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            currentActive = headings[i].id;
            break;
          }
        }
      }

      setActiveId(currentActive);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  React.useEffect(() => {
    // Handle scroll direction for mobile TOC visibility
    const controlMobileTOC = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        // Always show at top of page
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - hide
        setIsVisible(false);
      } else {
        // Scrolling up - show
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
      const yOffset = -100; // Offset for header
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (headings.length === 0) return null;

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
              {headings.map((heading) => (
                <button
                  key={heading.id}
                  onClick={() => scrollToSection(heading.id)}
                  className={`
                    whitespace-nowrap px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex-shrink-0
                    ${
                      activeId === heading.id
                        ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-400"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent"
                    }
                  `}
                >
                  {heading.text}
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
              {headings.map((heading) => (
                <li key={heading.id}>
                  <button
                    onClick={() => scrollToSection(heading.id)}
                    className={`
                      block w-full text-left py-2 px-3 text-sm transition-all duration-200 rounded-md
                      ${heading.level === "h2" ? "pl-3" : ""}
                      ${heading.level === "h3" ? "pl-6" : ""}
                      ${
                        activeId === heading.id
                          ? "text-yellow-700 font-semibold bg-yellow-100 border-l-3 border-yellow-500"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }
                    `}
                  >
                    {heading.text}
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

export default PageTableOfContents;
