import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  trailingSlash: false,

  images: {
    unoptimized: true,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
};

export default nextConfig;
