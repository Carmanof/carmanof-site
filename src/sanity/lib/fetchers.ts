import { client, clientNoCdn } from "./client";
import {
  siteSettingsQuery,
  videoCasesQuery,
  photoCasesQuery,
  photoCasesExistQuery,
  blogPostsQuery,
  blogPostBySlugQuery,
  blogPostSlugsQuery,
} from "./queries";

/* =========================
   TYPES
========================= */

export type SanityImageAsset = {
  _id?: string;
  url?: string;
};

export type SanityImage = {
  alt?: string;
  asset?: SanityImageAsset;
};

/**
 * FAQ item:
 * - отдельный объект
 * - используется в массиве faqItems
 */
export type FAQItem = {
  question: string;
  answer: string;
};

export type SiteSettings = {
  phone?: string;
  email?: string;
  telegram?: string;
  whatsapp?: string;
  vk?: string;

  /**
   * Hero изображения
   */
  heroDefaultImage?: SanityImage;
  heroHoverImage?: SanityImage;

  /**
   * MoreExamplesBlock
   */
  moreExamplesImage01?: SanityImage;
  moreExamplesImage02?: SanityImage;
  moreExamplesImage03?: SanityImage;
  moreExamplesImage04?: SanityImage;
  moreExamplesImage05?: SanityImage;

  /**
   * Prices block
   */
  pricesItem01Title?: string;
  pricesItem01Value?: string;
  pricesItem02Title?: string;
  pricesItem02Value?: string;
  pricesItem03Title?: string;
  pricesItem03Value?: string;

  /**
   * FAQ block
   */
  faqItems?: FAQItem[];
} | null;

export type BlogImage = SanityImage;
export type PhotoCaseImage = SanityImage;

export type VideoCase = {
  _id: string;
  title: string;
  description: string;
  youtubeId?: string;
  videoUrl?: string;
  posterUrl?: string;
  posterAlt?: string;
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

type HasCasesResult = {
  hasItems?: boolean;
} | null;

/* =========================
   CACHE CONFIG
========================= */

const DEFAULT_REVALIDATE = 120;

export const SANITY_TAGS = {
  settings: "settings",
  videoCases: "videoCases",
  photoCases: "photoCases",
  blogPosts: "blogPosts",
  blogPost: "blogPost",
  blogSlugs: "blogSlugs",
} as const;

function getBlogPostTag(slug: string) {
  return `blogPost:${slug}`;
}

/* =========================
   SAFE FETCH
========================= */

type SafeFetchOptions = {
  tags?: string[];
  revalidate?: number;
  useNoCdn?: boolean;
};

async function safeFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T,
  options: SafeFetchOptions = {},
): Promise<T> {
  const { tags, revalidate = DEFAULT_REVALIDATE, useNoCdn = false } = options;

  const activeClient = useNoCdn ? clientNoCdn : client;

  try {
    return await activeClient.fetch<T>(query, params, {
      next: tags?.length ? { tags, revalidate } : { revalidate },
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
    useNoCdn: true,
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

/**
 * Облегчённый запрос для главной страницы:
 * нужен только факт наличия фото-кейсов,
 * без загрузки всего массива карточек.
 */
export async function hasPhotoCases(): Promise<boolean> {
  const result = await safeFetch<HasCasesResult>(
    photoCasesExistQuery,
    {},
    { hasItems: false },
    {
      tags: [SANITY_TAGS.photoCases],
    },
  );

  return Boolean(result?.hasItems);
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
    tags: [SANITY_TAGS.blogPosts, SANITY_TAGS.blogPost, getBlogPostTag(slug)],
    useNoCdn: true,
  });
}

export async function getBlogPostSlugs(): Promise<BlogPostSlug[]> {
  return safeFetch<BlogPostSlug[]>(blogPostSlugsQuery, {}, [], {
    tags: [SANITY_TAGS.blogSlugs],
    useNoCdn: true,
  });
}
