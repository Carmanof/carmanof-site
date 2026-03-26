import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-03-25";

if (!projectId) {
  throw new Error(
    "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID",
  );
}

if (!dataset) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SANITY_DATASET");
}

/**
 * Основной клиент для серверных запросов сайта.
 * Используем CDN, потому что актуальность данных теперь контролируется
 * через Next.js revalidation и теги в fetch-слое.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

/**
 * Отдельный клиент без CDN.
 * Нужен для точек, где важнее абсолютная свежесть данных, чем скорость,
 * например для slug-списков и некоторых служебных запросов.
 */
export const clientNoCdn = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
});
