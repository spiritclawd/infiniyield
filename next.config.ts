import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Optimize for Vercel
  experimental: {
    optimizePackageImports: ['starkzap', 'starknet'],
  },
  
  // Environment variables exposed to browser
  env: {
    NEXT_PUBLIC_NETWORK: process.env.NEXT_PUBLIC_NETWORK || 'mainnet',
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
