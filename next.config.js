/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Removed "output: export" to enable SSR mode for Render deployment
  // output: "export",
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configure images for proper rendering
  images: {
    domains: ['localhost', 'tytvilur.manus.space'],
    // Only use unoptimized for local static exports
    // unoptimized: true,
  },
  // Remove custom webpack config that disables optimization
  // This allows proper CSS processing in production
};

module.exports = nextConfig;
