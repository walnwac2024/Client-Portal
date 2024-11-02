/** @type {import('next').NextConfig} */
// next.config.js
const withPWA = require("next-pwa");

module.exports = withPWA({
  pwa: {
    dest: "public", // The folder where the generated service worker and other PWA files will be stored
    disable: process.env.NODE_ENV === "development", // Disable PWA in development
  },
});

const nextConfig = {
    images: {
        domains: ['assets.aceternity.com'], // Add your external image domains here
    },
    typescript: {
        ignoreBuildErrors: true,
      },
}

module.exports = nextConfig

