import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Server-only packages (exclude from client bundle)
  serverExternalPackages: ['fyers-api-v3'],

  // Empty turbopack config to silence warning
  turbopack: {},
};

export default nextConfig;
