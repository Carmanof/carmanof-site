import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type SanityWebhookBody = {
  _type?: string;
  slug?: {
    current?: string;
  };
};

/**
 * Секрет должен совпадать с тем, который будет указан в Sanity webhook.
 */
const secret = process.env.SANITY_REVALIDATE_SECRET;

/**
 * Точечный тег конкретной статьи.
 * Должен совпадать с логикой в fetchers.ts.
 */
function getBlogPostTag(slug: string) {
  return `blogPost:${slug}`;
}

/**
 * Маппинг типов документов Sanity на теги Next.js.
 * Эти теги должны совпадать с теми, которые уже используются в fetchers.ts.
 */
function getTagsByType(type?: string): string[] {
  switch (type) {
    case "siteSettings":
      return ["settings"];

    case "videoCase":
      return ["videoCases"];

    case "photoCase":
      return ["photoCases"];

    case "blogPost":
      return ["blogPosts", "blogPost", "blogSlugs"];

    default:
      return [];
  }
}

export async function POST(req: NextRequest) {
  if (!secret) {
    return NextResponse.json(
      { ok: false, message: "Missing SANITY_REVALIDATE_SECRET" },
      { status: 500 },
    );
  }

  try {
    /**
     * parseBody() проверяет подпись webhook.
     */
    const { isValidSignature, body } = await parseBody<SanityWebhookBody>(
      req,
      secret,
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { ok: false, message: "Invalid signature" },
        { status: 401 },
      );
    }

    const docType = body?._type;
    const slug = body?.slug?.current;
    const tags = getTagsByType(docType);

    /**
     * Tag-based revalidation:
     * сбрасывает кэш всех fetch-запросов, помеченных соответствующими тегами.
     *
     * "max" — безопасный режим для текущей версии Next.js,
     * чтобы сборка не падала из-за сигнатуры функции.
     */
    for (const tag of tags) {
      revalidateTag(tag, "max");
    }

    /**
     * Для blogPost дополнительно сбрасываем точечный тег конкретной статьи.
     * Это позволяет обновлять slug-страницу более адресно.
     */
    if (docType === "blogPost" && slug) {
      revalidateTag(getBlogPostTag(slug), "max");
    }

    /**
     * Path-based revalidation:
     * дополнительно помечаем связанные страницы на пересборку
     * при следующем запросе.
     */
    if (docType === "blogPost") {
      revalidatePath("/blog");

      if (slug) {
        revalidatePath(`/blog/${slug}`);
      }
    }

    if (docType === "videoCase") {
      revalidatePath("/");
      revalidatePath("/cases");
      revalidatePath("/cases/video");
    }

    if (docType === "photoCase") {
      revalidatePath("/");
      revalidatePath("/cases");
      revalidatePath("/cases/photo");
    }

    if (docType === "siteSettings") {
      revalidatePath("/");
    }

    return NextResponse.json({
      ok: true,
      revalidated: true,
      type: docType ?? null,
      slug: slug ?? null,
      tags:
        docType === "blogPost" && slug ? [...tags, getBlogPostTag(slug)] : tags,
      now: Date.now(),
    });
  } catch (error) {
    console.error("[sanity-revalidate] failed:", error);

    return NextResponse.json(
      { ok: false, message: "Revalidation failed" },
      { status: 500 },
    );
  }
}
