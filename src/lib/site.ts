export function getSiteUrl() {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (env) {
    return normalize(env);
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  return "https://carmanof.ru";
}

function normalize(url: string) {
  const clean = url.trim();

  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }

  return `https://${clean}`;
}
