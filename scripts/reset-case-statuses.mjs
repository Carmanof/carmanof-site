import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-03-25";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
}

if (!dataset) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_DATASET");
}

if (!token) {
  throw new Error("Missing SANITY_API_WRITE_TOKEN");
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const target = process.argv[2] || "video";

const TARGETS = {
  video: ["videoCase"],
  photo: ["photoCase"],
  all: ["videoCase", "photoCase"],
};

if (!TARGETS[target]) {
  throw new Error(`Unknown target "${target}". Use one of: video, photo, all`);
}

async function resetType(documentType) {
  const ids = await client.fetch(
    `
      *[_type == $documentType]{
        _id
      }
    `,
    { documentType },
  );

  if (!ids.length) {
    console.log(`[reset-case-statuses] No documents found for ${documentType}`);
    return;
  }

  console.log(
    `[reset-case-statuses] Found ${ids.length} documents for ${documentType}`,
  );

  const transaction = client.transaction();

  for (const item of ids) {
    transaction.patch(item._id, {
      set: {
        isPublished: false,
      },
      unset: ["isFeatured"],
    });
  }

  await transaction.commit();

  console.log(
    `[reset-case-statuses] Reset complete for ${documentType}: ${ids.length} docs updated`,
  );
}

async function main() {
  console.log(`[reset-case-statuses] Start: ${target}`);

  for (const documentType of TARGETS[target]) {
    await resetType(documentType);
  }

  console.log("[reset-case-statuses] Done");
}

main().catch((error) => {
  console.error("[reset-case-statuses] Failed:", error);
  process.exit(1);
});
