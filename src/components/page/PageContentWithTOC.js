import React, { useEffect, useRef } from "react";

const PageContentWithTOC = ({ htmlContent }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (!contentRef.current || !htmlContent) return;

    // Add IDs to all headings for anchor links
    const headingElements = contentRef.current.querySelectorAll("h1, h2, h3");

    headingElements.forEach((heading, index) => {
      const text = heading.textContent.trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();

      heading.id = `section-${index}-${id}`;
      heading.classList.add("scroll-mt-24"); // Add scroll margin for fixed header
    });

    // Wrap tables in scrollable containers for mobile responsiveness
    const tables = contentRef.current.querySelectorAll("table");
    tables.forEach((table) => {
      // Check if table is not already wrapped
      if (table.parentElement.classList.contains("table-wrapper")) return;

      const wrapper = document.createElement("div");
      wrapper.className = "table-wrapper overflow-x-auto -mx-4 sm:mx-0 mb-4";
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
      table.classList.add("min-w-full");
    });
  }, [htmlContent]);

  return (
    <div
      ref={contentRef}
      className="dynamic-page-content"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default PageContentWithTOC;
