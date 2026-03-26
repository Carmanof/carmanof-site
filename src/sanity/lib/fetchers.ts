import { client, clientNoCdn } from "./client";
import {
  siteSettingsQuery,
  videoCasesQuery,
  photoCasesQuery,
  blogPostsQuery,
  blogPostBySlugQuery,
  blogPostSlugsQuery,
} from "./queries";

/* =========================
   TYPES
========================= */

export type SiteSettings = {
  phone?: string;
  email?: string;
  telegram?: string;
  vk?: string;
} | null;

export type SanityImageAsset = {
  _id?: string;
  url?: string;
};

export type BlogImage = {
  alt?: string;
  asset?: SanityImageAsset;
};

export type PhotoCaseImage = {
  alt?: string;
  asset?: SanityImageAsset;
};

export type VideoCase = {
  _id: string;
  title: string;
  description: string;
  youtubeId: string;
  order: number;
  isFeatured?: boolean;
};

export type PhotoCase = {
  _id: string;
  title: string;
  order: number;
  image?: PhotoCaseImage;
};

export type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  coverImage?: BlogImage;
};

export type BlogPostSlug = {
  slug: string;
};

export type PortableTextBlock = {
  _key?: string;
  _type: string;
  [key: string]: unknown;
};

export type BlogArticle = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  coverImage?: BlogImage;
  content?: PortableTextBlock[];
};

/* =========================
   CACHE CONFIG
========================= */

/**
 * Базовый интервал revalidation для Sanity-запросов.
 * Это безопасная замена cache: "no-store":
 * данные не будут запрашиваться на каждый рендер,
 * но и не будут "залипать" бесконечно.
 */
const DEFAULT_REVALIDATE = 120;

/**
 * Теги держим рядом, чтобы не плодить магические строки по файлу.
 * Позже, если захотим, можно вынести их в отдельный tags.ts.
 */
const SANITY_TAGS = {
  settings: "settings",
  videoCases: "videoCases",
  photoCases: "photoCases",
  blogPosts: "blogPosts",
  blogPost: "blogPost",
  blogSlugs: "blogSlugs",
} as const;

/**
 * Точечный тег конкретной статьи.
 * Нужен для более адресной revalidation по slug.
 */
function getBlogPostTag(slug: string) {
  return `blogPost:${slug}`;
}

/* =========================
   SAFE FETCH
========================= */

type SafeFetchOptions = {
  /**
   * Если передаем tags, дальше можно будет подключить
   * точечную revalidation по webhook через revalidateTag().
   */
  tags?: string[];

  /**
   * Если tags нет, используем time-based revalidation.
   * Можно переопределять точечно под конкретный запрос.
   */
  revalidate?: number;
};

async function safeFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T,
  options: SafeFetchOptions = {},
): Promise<T> {
  const { tags, revalidate = DEFAULT_REVALIDATE } = options;

  try {
    return await client.fetch<T>(query, params, {
      /**
       * Важно:
       * - убрали cache: "no-store", потому что он отключает преимущества кэша;
       * - если есть tags, Next сможет инвалидировать кэш точечно;
       * - если tags нет, работает обычный revalidation по времени.
       */
      next: tags?.length ? { tags } : { revalidate },
    });
  } catch (error) {
    console.error("Sanity fetch failed:", error);
    return fallback;
  }
}

/* =========================
   SITE SETTINGS
========================= */

export async function getSiteSettings(): Promise<SiteSettings> {
  return safeFetch<SiteSettings>(siteSettingsQuery, {}, null, {
    tags: [SANITY_TAGS.settings],
  });
}

/* =========================
   VIDEO CASES
========================= */

export async function getVideoCases(): Promise<VideoCase[]> {
  return safeFetch<VideoCase[]>(videoCasesQuery, {}, [], {
    tags: [SANITY_TAGS.videoCases],
  });
}

export async function getHomeVideoCases(): Promise<VideoCase[]> {
  const videoCases = await getVideoCases();

  const featuredCases = videoCases.filter((item) => item.isFeatured);

  if (featuredCases.length >= 3) {
    return featuredCases.slice(0, 3);
  }

  if (featuredCases.length > 0) {
    const featuredIds = new Set(featuredCases.map((item) => item._id));
    const fallbackCases = videoCases.filter(
      (item) => !featuredIds.has(item._id),
    );

    return [...featuredCases, ...fallbackCases].slice(0, 3);
  }

  return videoCases.slice(0, 3);
}

/* =========================
   PHOTO CASES
========================= */

export async function getPhotoCases(): Promise<PhotoCase[]> {
  return safeFetch<PhotoCase[]>(photoCasesQuery, {}, [], {
    tags: [SANITY_TAGS.photoCases],
  });
}

/* =========================
   BLOG
========================= */

export async function getBlogPosts(): Promise<BlogPost[]> {
  return safeFetch<BlogPost[]>(blogPostsQuery, {}, [], {
    tags: [SANITY_TAGS.blogPosts],
  });
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogArticle | null> {
  return safeFetch<BlogArticle | null>(blogPostBySlugQuery, { slug }, null, {
    /**
     * Общий тег списка/раздела блога.
     * Общий тег типа сущности.
     * И точечный тег конкретной статьи по slug.
     *
     * Такая схема позволяет:
     * - при необходимости сбрасывать весь блог;
     * - или сбрасывать только одну статью.
     */
    tags: [SANITY_TAGS.blogPosts, SANITY_TAGS.blogPost, getBlogPostTag(slug)],
  });
}

export async function getBlogPostSlugs(): Promise<BlogPostSlug[]> {
  try {
    /**
     * Для slug-списка используем клиент без CDN.
     * Это снижает риск, что generateStaticParams() получит устаревший список маршрутов.
     */
    return await clientNoCdn.fetch<BlogPostSlug[]>(blogPostSlugsQuery, {});
  } catch (error) {
    console.error("Sanity slug fetch failed:", error);
    return [];
  }
}
