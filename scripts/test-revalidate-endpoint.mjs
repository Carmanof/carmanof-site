// scripts/test-revalidate-endpoint.mjs
import dotenv from "dotenv";

dotenv.config({
  path: ".env.test",
});

const BASE_URL = process.env.TEST_BASE_URL;
const SECRET = process.env.SANITY_REVALIDATE_SECRET;

console.log("BASE_URL:", BASE_URL);
console.log("SECRET loaded:", !!SECRET);

if (!BASE_URL) {
  throw new Error("Не задан TEST_BASE_URL");
}

if (!SECRET) {
  throw new Error("Не задан SANITY_REVALIDATE_SECRET");
}

async function testRequest(name, options) {
  try {
    const response = await fetch(`${BASE_URL}/api/revalidate`, options);
    const text = await response.text();

    console.log(`\n[${name}]`);
    console.log("Status:", response.status);
    console.log("Response:", text);
  } catch (error) {
    console.error(`\n[${name}] Ошибка запроса:`, error);
  }
}

await testRequest("GET request", {
  method: "GET",
});

await testRequest("POST with wrong secret", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    secret: "wrong-secret",
    _type: "siteSettings",
  }),
});

await testRequest("POST with correct secret", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    secret: SECRET,
    _type: "siteSettings",
  }),
});
