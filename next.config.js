// next.config.js
const withPWA = require("next-pwa")({
  dest: "public", // The folder where the generated service worker and other PWA files will be stored
  // Optionally disable PWA in development mode
  // disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  images: {
    domains: ['assets.aceternity.com'], // Add your external image domains here
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // output: 'export',
  async headers() {
    return [
      {
        source: "/api/upload",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "POST" },
          { key: "Access-Control-Allow-Headers", value: "content-type" },
        ],
      },
    ];
  },
};

// Merge both configurations
module.exports = withPWA(nextConfig);
