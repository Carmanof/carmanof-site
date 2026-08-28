// scripts/test-revalidate-payloads.mjs
import dotenv from "dotenv";

dotenv.config({
  path: ".env.test",
});

const BASE_URL = process.env.TEST_BASE_URL;
const SECRET = process.env.SANITY_REVALIDATE_SECRET;

if (!BASE_URL) {
  throw new Error("Не задан TEST_BASE_URL");
}

if (!SECRET) {
  throw new Error("Не задан SANITY_REVALIDATE_SECRET");
}

const payloads = [
  {
    name: "siteSettings",
    body: {
      secret: SECRET,
      _type: "siteSettings",
      _id: "siteSettings",
    },
  },
  {
    name: "videoCase",
    body: {
      secret: SECRET,
      _type: "videoCase",
      _id: "test-video-case-id",
      slug: { current: "test-video-case" },
    },
  },
  {
    name: "photoCase",
    body: {
      secret: SECRET,
      _type: "photoCase",
      _id: "test-photo-case-id",
      slug: { current: "test-photo-case" },
    },
  },
  {
    name: "blogPost",
    body: {
      secret: SECRET,
      _type: "blogPost",
      _id: "test-blog-post-id",
      slug: { current: "test-blog-post" },
    },
  },
];

for (const payload of payloads) {
  try {
    const response = await fetch(`${BASE_URL}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload.body),
    });

    const text = await response.text();

    console.log(`\n[${payload.name}]`);
    console.log("Status:", response.status);
    console.log("Response:", text);
  } catch (error) {
    console.error(`\n[${payload.name}] Ошибка:`, error);
  }
}
