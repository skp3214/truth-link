import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // External packages that should not be bundled
  serverExternalPackages: ["@ai-sdk/google"],
  // Reduce build time and prevent multiple parallel builds
  typescript: {
    // Don't type check during build to speed up deployment
    ignoreBuildErrors: false,
  },
  eslint: {
    // Don't run ESLint during build to speed up deployment
    ignoreDuringBuilds: false,
  }
};

export default nextConfig;
