// Единый канонический домен проекта (SEO source of truth)
export const SITE_URL = "https://carmanof.ru";

/**
 * Возвращает базовый URL сайта для runtime задач:
 * - metadata
 * - sitemap
 * - og tags
 * - canonical
 *
 * ВАЖНО: не должен случайно отдавать vercel.app в production SEO.
 */
export function getSiteUrl() {
  // 1. Явный override (если ты сам задаёшь staging/preview домен)
  const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (envSiteUrl) {
    return normalizeUrl(envSiteUrl);
  }

  // 2. Dev окружение (только локально)
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  // 3. Production fallback (единственно правильный SEO-домен)
  return SITE_URL;
}

/**
 * Нормализация URL:
 * - добавляет https если забыли
 * - убирает лишние пробелы
 */
function normalizeUrl(url: string) {
  const clean = url.trim();

  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }

  return `https://${clean}`;
}
