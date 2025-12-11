import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone output to include all node_modules
  output: 'standalone',

  // Mark fyers-api-v3 as a server-side external package
  // This prevents Next.js from trying to bundle it
  serverExternalPackages: ['fyers-api-v3'],

  // Empty turbopack config to acknowledge Turbopack is being used
  turbopack: {},
};

export default nextConfig;
