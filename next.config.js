// const nextTranslate = require("next-translate-plugin");
// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: process.env.ANALYZE === "true",
// });

// // Temporarily disable PWA due to compatibility issues
// // const withPWAInit = require("next-pwa");
// // const withPWA = withPWAInit({
// //   dest: "public",
// //   register: true,
// //   buildExcludes: [/middleware-manifest\.json$/],
// //   scope: "/",
// //   sw: "service-worker.js",
// //   skipWaiting: true,
// //   disable: process.env.NODE_ENV === "development",
// // });

// const config = {
//   reactStrictMode: true,
//   compress: true,
//   poweredByHeader: false,
//   compiler: {
//     removeConsole: process.env.NODE_ENV === "production",
//   },
//   webpack: (config, { isServer }) => {
//     // Add fallback for scheduler module
//     if (!isServer) {
//       config.resolve.fallback = {
//         ...config.resolve.fallback,
//         "scheduler/tracing": false,
//       };
//     }

//     return config;
//   },
//   async headers() {
//     return [
//       {
//         source: "/:path*",
//         headers: [
//           {
//             key: "Cache-Control",
//             value: "public, max-age=0, must-revalidate",
//           },
//         ],
//       },
//     ];
//   },
//   i18n: {
//     // These are all the locales you want to support in
//     // your application
//     locales: ["en", "es", "fr", "de"],
//     // This is the default locale you want to be used when visiting
//     // a non-locale prefixed path e.g. `/hello`
//     defaultLocale: "en",
//     // This is a list of locale domains and the default locale they
//     // should handle (these are only required when setting up domain routing)
//   },

//   // images: {
//   //   domains: [
//   //     "images.unsplash.com",
//   //     "img.icons8.com",
//   //     "i.ibb.co",
//   //     "i.postimg.cc",
//   //     "fakestoreapi.com",
//   //     "res.cloudinary.com",
//   //     "lh3.googleusercontent.com",
//   //     "res.cloudinary.com",
//   //     "lh3.googleusercontent.com",
//   //     "",
//   //     "images.dashter.com",
//   //   ],
//   // },
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "**",
//       },
//     ],
//     formats: ["image/avif", "image/webp"],
//     minimumCacheTTL: 60,
//     // Provide device sizes so Next.js can generate appropriately sized images
//     deviceSizes: [320, 420, 768, 1024, 1200, 1600],
//     imageSizes: [16, 32, 48, 64, 96, 128, 256, 512],
//   },
// };

// module.exports = withBundleAnalyzer(nextTranslate(config));

const nextTranslate = require("next-translate-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "localhost",
      "api.stickersrhino.com",
      "stickersrhino.com",
      "res.cloudinary.com",
    ],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

module.exports = nextTranslate(nextConfig);
