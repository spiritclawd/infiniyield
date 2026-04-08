import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Optimize for Vercel
  experimental: {
    optimizePackageImports: ['starkzap', 'starknet', 'zustand'],
  },
  
  // Environment variables exposed to browser
  // Contract addresses are public (on-chain, no secrets)
  env: {
    NEXT_PUBLIC_NETWORK: process.env.NEXT_PUBLIC_NETWORK || 'sepolia',
    NEXT_PUBLIC_VAULT_CONTRACT:    process.env.NEXT_PUBLIC_VAULT_CONTRACT    || '0x00a60e55f58d72744f099f6dbbfdbaadd0b87f3fa0618e069299bced33b59c80',
    NEXT_PUBLIC_WBTC_CONTRACT:     process.env.NEXT_PUBLIC_WBTC_CONTRACT     || '0x067643f9a0722a3717ddf9469d266c739ebb8d1d365807888989e70b88937595',
    NEXT_PUBLIC_IY_TOKEN_CONTRACT: process.env.NEXT_PUBLIC_IY_TOKEN_CONTRACT || '0x035f1980ee1d948641d2cebb74c6dafee595f6b817874ef24f631a8a9d34b6ee',
    NEXT_PUBLIC_TREASURY_ADDRESS:  process.env.NEXT_PUBLIC_TREASURY_ADDRESS  || '0x01c5e682f44ef485c44db5aa1ddb842dc2ec9c7de05e3e65d8b13464a96dd8e8',
  },

  // Output: export for static hosting (GitHub Pages / any CDN)
  output: 'export',
  trailingSlash: true,
  basePath: '/infiniyield',
  assetPrefix: '/infiniyield',
  
  // Headers handled by vercel.json / hosting layer (not compatible with output: 'export')
};

export default nextConfig;
