const DEFAULT_SITE_URL = "https://carmanof.ru";

export const SEO_CONFIG = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL,

  siteName: "Carmanof",

  defaultTitle: "Carmanof",
  titleTemplate: "%s | Carmanof",

  description:
    "Ремонт, восстановление и доработка приборных панелей. Примеры работ, подход и удобный способ связи.",

  locale: "ru_RU",

  robots: {
    allow: "/",
    disallow: ["/studio/", "/api/"],
  },

  openGraphImage: "/og-image.jpg",
};

// =========================
// SINGLE SOURCE OF TRUTH HELPERS
// =========================

export function getSiteUrl() {
  return SEO_CONFIG.siteUrl;
}

export function getAbsoluteUrl(path: string = "") {
  const base = SEO_CONFIG.siteUrl;

  if (!path) return base;

  // защита от двойных слэшей
  if (path.startsWith("/")) {
    return `${base}${path}`;
  }

  return `${base}/${path}`;
}
