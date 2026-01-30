# Table of Contents Feature

## Overview

This feature automatically generates a clickable table of contents sidebar for custom pages, similar to Sticker Mule's privacy policy layout. The TOC appears on the left side of the page on desktop devices and allows users to quickly navigate between different sections.

## Implementation

### Components Created

1. **PageTableOfContents.js** - `src/components/page/PageTableOfContents.js`
   - Automatically extracts H1, H2, and H3 headers from HTML content
   - Creates clickable navigation links
   - Highlights the current section as you scroll
   - Sticky positioning for easy access

2. **PageContentWithTOC.js** - `src/components/page/PageContentWithTOC.js`
   - Adds IDs to all headers for anchor linking
   - Handles the dynamic HTML content rendering

### Pages Updated

1. **Dynamic Pages** - `src/pages/pages/[slug].js`
   - Uses `PageTableOfContents` component
   - Works automatically with any custom page created in the admin panel
   - Extracts headers from the HTML content dynamically

2. **Privacy Policy** - `src/pages/privacy-policy.js`
   - Custom TOC component with predefined sections
   - All sections have IDs and scroll-to functionality

3. **Terms & Conditions** - `src/pages/terms-and-conditions.js`
   - Custom TOC component with predefined sections
   - All sections have IDs and scroll-to functionality

## Features

### Desktop View

- **Left Sidebar TOC**: Shows on screens >= 1024px (lg breakpoint)
- **Sticky Navigation**: Stays visible as you scroll
- **Active Highlighting**: Current section highlighted in green
- **Smooth Scrolling**: Animated scroll to sections on click

### Mobile View

- TOC is hidden on mobile devices (< 1024px) to save space
- Content takes full width on smaller screens

### Styling

- **Active state**: Green color (#10b981) with green border and background
- **Hover state**: Gray background on hover
- **Typography**: Small, uppercase "On This Page" heading
- **Indentation**: H2 and H3 headers are indented for hierarchy

## How It Works

### For Dynamic Pages (/pages/[slug])

1. Page content is fetched from the API
2. `PageTableOfContents` component parses the HTML
3. Automatically extracts all H1, H2, H3 headers
4. Creates IDs from header text (lowercase, hyphenated)
5. Renders clickable navigation

### For Static Pages (Privacy Policy, Terms)

1. Sections are manually defined in an array
2. Each section has an ID and display text
3. Corresponding divs in the content have matching IDs
4. TOC renders from the predefined list

## Adding TOC to New Pages

### Option 1: Dynamic TOC (Recommended for Custom Pages)

```jsx
import PageTableOfContents from "@components/page/PageTableOfContents";
import PageContentWithTOC from "@components/page/PageContentWithTOC";

<div className="flex flex-col lg:flex-row gap-8">
  <aside className="hidden lg:block lg:w-64 flex-shrink-0">
    <PageTableOfContents htmlContent={yourHtmlContent} />
  </aside>
  <div className="flex-1 max-w-4xl prose prose-lg">
    <PageContentWithTOC htmlContent={yourHtmlContent} />
  </div>
</div>;
```

### Option 2: Static TOC (For Predefined Sections)

```jsx
// Define sections
const sections = [
  { id: "section-one", text: "Section One Title" },
  { id: "section-two", text: "Section Two Title" },
];

// Add IDs to your content
<div id="section-one" className="scroll-mt-24">
  <h2>Section One Title</h2>
  {/* content */}
</div>;

// Use the TOC component pattern from privacy-policy.js or terms-and-conditions.js
```

## Customization

### Change Colors

Edit the active state colors in the TOC component:

- Current: `text-emerald-600 border-emerald-600 bg-emerald-50`
- Change to your brand colors as needed

### Adjust Scroll Offset

The scroll offset is controlled by:

- `scroll-mt-24` class on content sections (adjusts scroll padding)
- `yOffset = -100` in the scrollToSection function
- `rect.top <= 150` in the scroll detection

### Change Visibility Breakpoint

Modify the `lg:block` class to show/hide at different screen sizes:

- `md:block` - Show at 768px+
- `xl:block` - Show at 1280px+

## Browser Support

- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Falls back gracefully - page still readable without TOC

## Testing Checklist

- [ ] TOC appears on desktop view (>= 1024px)
- [ ] TOC hidden on mobile/tablet (< 1024px)
- [ ] Clicking TOC items scrolls to correct section
- [ ] Active section highlights correctly while scrolling
- [ ] Smooth scroll animation works
- [ ] Works with both hardcoded and dynamic content
- [ ] No console errors

## Future Enhancements

- Add mobile drawer/toggle for TOC on smaller screens
- Add progress indicator showing how far through the page
- Support for nested heading levels (H4, H5, H6)
- Collapse/expand sections in TOC
- Print-friendly TOC version
