// scripts/test-page-freshness.mjs
import dotenv from "dotenv";

dotenv.config({
  path: ".env.test",
});

const BASE_URL = process.env.TEST_BASE_URL;
const SECRET = process.env.SANITY_REVALIDATE_SECRET;
const PAGE_PATH = process.env.TEST_PAGE_PATH || "/";

if (!BASE_URL) {
  throw new Error("Не задан TEST_BASE_URL");
}

if (!SECRET) {
  throw new Error("Не задан SANITY_REVALIDATE_SECRET");
}

function extractUsefulInfo(html) {
  return {
    length: html.length,
    hasNoDataMarker: html.includes("fallback"),
    preview: html.slice(0, 300),
  };
}

async function fetchPage() {
  const response = await fetch(`${BASE_URL}${PAGE_PATH}`, {
    method: "GET",
    cache: "no-store",
  });

  const html = await response.text();

  return {
    status: response.status,
    info: extractUsefulInfo(html),
  };
}

async function triggerRevalidate() {
  const response = await fetch(`${BASE_URL}/api/revalidate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      secret: SECRET,
      _type: "siteSettings",
      _id: "siteSettings",
    }),
  });

  return {
    status: response.status,
    text: await response.text(),
  };
}

console.log("\n[1] Читаем страницу ДО revalidate...");
const before = await fetchPage();
console.log(before);

console.log("\n[2] Триггерим revalidate...");
const revalidate = await triggerRevalidate();
console.log(revalidate);

console.log("\n[3] Ждём 3 секунды...");
await new Promise((resolve) => setTimeout(resolve, 3000));

console.log("\n[4] Читаем страницу ПОСЛЕ revalidate...");
const after = await fetchPage();
console.log(after);

console.log("\n[5] Сравнение");
console.log(
  JSON.stringify(before.info) === JSON.stringify(after.info)
    ? "Страница выглядит одинаково"
    : "Есть изменения в ответе страницы",
);
