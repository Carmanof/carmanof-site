import type { MetadataRoute } from "next";

const SITE_URL = "https://carmanof.ru";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio/", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`, // теперь корректно
    host: SITE_URL,
  };
}
