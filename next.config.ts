import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos"
      },
      {
        protocol: "https",
        hostname: "shop.4401.live",
        pathname: "/**"
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
