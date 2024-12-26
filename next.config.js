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
  output: 'export',
};

// Merge both configurations
module.exports = withPWA(nextConfig);
