import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: { root: process.cwd() },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos"
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "cbu01.alicdn.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "static.nike.com",
        pathname: "/**",
      },
    ]
  }
};

export default nextConfig;
