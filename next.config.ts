import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Prevent linting warnings from blocking production deployments on Vercel
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Enforce strict TypeScript compilation
    ignoreBuildErrors: false,
  },
};

export default nextConfig;

