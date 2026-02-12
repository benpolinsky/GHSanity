/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Make environment variables available in the browser
    NEXT_GH_TOKEN: process.env.NEXT_GH_TOKEN,
  },
  // Configure webpack to handle SVG files
  experimental: {
    turbo: {},
  },
};

export default nextConfig;
