/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['assets.aceternity.com'], // Add your external image domains here
    },
    typescript: {
        ignoreBuildErrors: true,
      },
}

module.exports = nextConfig

