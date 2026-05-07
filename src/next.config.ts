import type { NextConfig } from "next";

const MAIN_DOMAIN = "carmanof.ru";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,

    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },

  experimental: {
    optimizePackageImports: ["@portabletext/react"],
  },

  async redirects() {
    return [
      // 1. ВСЕ vercel preview → основной домен
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: ".*vercel\\.app",
          },
        ],
        destination: `https://${MAIN_DOMAIN}/:path*`,
        permanent: true,
      },

      // 2. www → без www
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: `www\\.${MAIN_DOMAIN}`,
          },
        ],
        destination: `https://${MAIN_DOMAIN}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
