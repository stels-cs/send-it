import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  experimental: {
    esmExternals: true, // или 'loose'
  },
};

export default nextConfig;
