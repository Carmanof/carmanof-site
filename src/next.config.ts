import type { NextConfig } from "next";

const MAIN_DOMAIN = "carmanof.ru";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // важно: убираем нестабильные experimental optimizations
  experimental: {},

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.carmanof.ru" }],
        destination: `https://${MAIN_DOMAIN}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;