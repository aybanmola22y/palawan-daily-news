import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@csstools/css-calc"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
