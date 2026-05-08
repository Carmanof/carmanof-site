import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },

  // КЛЮЧЕВО: фикс static routing
  assetPrefix: "",

  // важно для Vercel edge static handling
  trailingSlash: false,

  skipTrailingSlashRedirect: true,
};

export default nextConfig;
