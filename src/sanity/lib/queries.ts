import { groq } from "next-sanity";

/* =========================
   SITE SETTINGS
========================= */

export const siteSettingsQuery = groq`
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    phone,
    email,
    telegram,
    vk
  }
`;

/* =========================
   VIDEO CASES
========================= */

/**
 * Для страницы видео-кейсов ограничиваем выдачу первыми 18 элементами.
 * Главная страница продолжает отдельно брать только 3 кейса через fetchers.ts.
 */
export const videoCasesQuery = groq`
  *[
    _type == "videoCase" &&
    (!defined(isPublished) || isPublished == true)
  ]
  | order(order asc)[0...18]{
    _id,
    title,
    description,
    youtubeId,
    order,
    isFeatured
  }
`;

/* =========================
   PHOTO CASES
========================= */

/**
 * Для страницы фото-кейсов ограничиваем выдачу первыми 18 элементами.
 * Это лимит отображения на сайте, а не запрет на создание документов в Sanity.
 */
export const photoCasesQuery = groq`
  *[
    _type == "photoCase" &&
    (!defined(isPublished) || isPublished == true)
  ]
  | order(order asc)[0...18]{
    _id,
    title,
    order,
    image{
      alt,
      asset->{
        _id,
        url
      }
    }
  }
`;

/* =========================
   BLOG
========================= */

export const blogPostsQuery = groq`
  *[
    _type == "blogPost" &&
    defined(slug.current) &&
    defined(title) &&
    defined(excerpt) &&
    defined(publishedAt)
  ]
  | order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    coverImage{
      alt,
      asset->{
        _id,
        url
      }
    }
  }
`;

export const blogPostSlugsQuery = groq`
  *[
    _type == "blogPost" &&
    defined(slug.current) &&
    defined(title) &&
    defined(excerpt) &&
    defined(publishedAt)
  ]{
    "slug": slug.current
  }
`;

export const blogPostBySlugQuery = groq`
  *[
    _type == "blogPost" &&
    slug.current == $slug &&
    defined(slug.current) &&
    defined(title) &&
    defined(excerpt) &&
    defined(publishedAt)
  ][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    seoTitle,
    seoDescription,
    coverImage{
      alt,
      asset->{
        _id,
        url
      }
    },
    content
  }
`;
