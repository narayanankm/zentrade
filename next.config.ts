import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone output to include all node_modules
  output: 'standalone',

  // Configure webpack to handle fyers-api-v3 as external
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mark fyers-api-v3 as external so it's loaded from node_modules
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('fyers-api-v3');
      }
    }
    return config;
  },

  // Empty turbopack config to silence warning
  turbopack: {},
};

export default nextConfig;
