// config/seo.ts

export const SEO_CONFIG = {
  siteUrl: "https://carmanof.ru",

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
  return `${SEO_CONFIG.siteUrl}${path}`;
}
