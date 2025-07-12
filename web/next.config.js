/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },

  // ❌ REMOVE this if present
  // output: 'export',

  // ✅ Place `transpilePackages` at the root level, not under `experimental`
  transpilePackages: ['@coinbase/wallet-sdk'],
};

module.exports = nextConfig;
