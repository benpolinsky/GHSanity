/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Make environment variables available in the browser
    NEXT_PUBLIC_GITHUB_TOKEN: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
  },
  // Handle transpilation for external dependencies
  transpilePackages: ['@reach/combobox'],
  // Configure webpack to handle SVG files
  webpack(config) {
    // Add SVG handling
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    return config;
  },
};

export default nextConfig; 