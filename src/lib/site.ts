// config/site.ts

export const SITE_URL = "https://carmanof.ru";

export function getSiteUrl() {
  // Только dev может переопределять
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  // production всегда фиксирован
  return SITE_URL;
}
