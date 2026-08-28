import type { MetadataRoute } from "next";
import { SEO_CONFIG } from "@/config/seo";

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === "production";
  return {
    rules: [
      {
        userAgent: "*",
        allow: isProduction ? SEO_CONFIG.robots.allow : undefined,
        disallow: isProduction ? SEO_CONFIG.robots.disallow : "/",
      },
    ],
    sitemap: isProduction ? `${SEO_CONFIG.siteUrl}/sitemap.xml` : undefined,
  };
}
