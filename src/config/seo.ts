export const SEO_CONFIG = {
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL || "https://carmanof.ru",

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

export function getSiteUrl() {
  return SEO_CONFIG.siteUrl;
}

export function getAbsoluteUrl(path: string = "") {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || "https://carmanof.ru";

  return `${base}${path}`;
}