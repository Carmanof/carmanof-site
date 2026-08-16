// config/seo.ts

export const SEO_CONFIG = {
  siteUrl: "https://carmanof.ru",

  siteName: "Carmanof",

  defaultTitle: "Шкалы приборов на заказ | Carmanof",
  titleTemplate: "%s | Carmanof",

  description:
    "Шкалы приборов на заказ, пересвет и ремонт приборных панелей. Краснодар, доставка по всей России.",

  locale: "ru_RU",

  robots: {
    allow: "/",
    disallow: ["/studio/", "/api/"],
  },

  openGraphImage: "/og-carmanof-v2-1200x630.png",
};

export function getSiteUrl() {
  return SEO_CONFIG.siteUrl;
}

export function getAbsoluteUrl(path: string = "") {
  return `${SEO_CONFIG.siteUrl}${path}`;
}
