import type { MetadataRoute } from "next";
import { getBlogPostSlugs } from "@/sanity/lib/fetchers";
import { SEO_CONFIG } from "@/config/seo";
import { blogArticles } from "@/data/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SEO_CONFIG.siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SEO_CONFIG.siteUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SEO_CONFIG.siteUrl}/cases`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SEO_CONFIG.siteUrl}/cases/video`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SEO_CONFIG.siteUrl}/cases/photo`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SEO_CONFIG.siteUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...["services", "delivery", "about", "contacts"].map((path) => ({
      url: `${SEO_CONFIG.siteUrl}/${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${SEO_CONFIG.siteUrl}/consent`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const cmsSlugs = await getBlogPostSlugs();
  const blogSlugs = [...new Set([...cmsSlugs.map((item) => item.slug), ...blogArticles.map((item) => item.slug)])];

  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${SEO_CONFIG.siteUrl}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages];
}
