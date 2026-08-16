import type { Metadata } from "next";
import type { Image as SanityImage } from "sanity";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

import Container from "@/components/ui/Container/Container";
import Button from "@/components/ui/Button/Button";
import {
  getBlogCoverImageUrl,
  urlFor,
} from "@/sanity/lib/image";
import { getBlogPostBySlug, getBlogPostSlugs } from "@/sanity/lib/fetchers";

import styles from "./article.module.scss";

/**
 * Тип для image-блока внутри PortableText.
 * Это локальный тип только для редакторского контента.
 */
type PortableTextImageValue = SanityImage & {
  alt?: string;
  caption?: string;
};

type BlogSlugItem = Awaited<ReturnType<typeof getBlogPostSlugs>>[number];

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

/**
 * Разрешаем открывать новые slug, даже если они не попали
 * в generateStaticParams на этапе предыдущей сборки.
 * Это важно для связки ISR + revalidate.
 */
export const dynamicParams = true;

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className={styles.paragraph}>{children}</p>,
    h2: ({ children }) => <h2 className={styles.sectionTitle}>{children}</h2>,
    h3: ({ children }) => (
      <h3 className={styles.sectionSubtitle}>{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className={styles.blockquote}>{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className={styles.list}>{children}</ul>,
    number: ({ children }) => <ol className={styles.list}>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className={styles.listItem}>{children}</li>,
    number: ({ children }) => <li className={styles.listItem}>{children}</li>,
  },
  types: {
    image: ({ value }) => {
      const imageValue = value as PortableTextImageValue;

      /**
       * Для inline-контента статьи используем Sanity CDN
       * с контролируемым размером и авто-форматом.
       */
      const imageUrl = urlFor(imageValue)
        .width(1400)
        .fit("crop")
        .auto("format")
        .quality(80)
        .url();

      if (!imageUrl) {
        return null;
      }

      return (
        <figure className={styles.contentFigure}>
          <div className={styles.contentFigureMedia}>
            <Image
              src={imageUrl}
              alt={imageValue.alt || "Изображение в статье"}
              fill
              sizes="(max-width: 768px) 100vw, 760px"
              className={styles.contentFigureImage}
            />
          </div>

          {imageValue.caption ? (
            <figcaption className={styles.contentFigureCaption}>
              {imageValue.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

/**
 * Предварительно собираем известные slug'и для статических страниц.
 * Список берём через общий fetch-слой Sanity.
 */
export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs();

  return slugs.map((item: BlogSlugItem) => ({
    slug: item.slug,
  }));
}

/**
 * Metadata берём из Sanity через тот же fetch-слой,
 * чтобы кэш и revalidation вели себя одинаково
 * для страницы и SEO-данных.
 */
export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getBlogPostBySlug(slug);

  if (!article) {
    return {
      title: "Материал не найден | Carmanof",
      description:
        "Запрошенный материал не найден. Перейдите на главную страницу и посмотрите основные услуги и примеры работ.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = article.seoTitle || `${article.title} | Carmanof`;
  const description = article.seoDescription || article.excerpt;
  const canonicalPath = `/blog/${article.slug}`;
  const ogImage = article.coverImage
    ? getBlogCoverImageUrl(article.coverImage)
    : "";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      type: "article",
      locale: "ru_RU",
      url: canonicalPath,
      publishedTime: article.publishedAt,
      images: ogImage
        ? [
            {
              url: ogImage,
              alt: article.coverImage?.alt || article.title,
            },
          ]
        : [],
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  /**
   * Основной контент статьи также идёт через общий fetch-слой.
   * Это важно, чтобы route не жил отдельно
   * от общей стратегии кэша Sanity.
   */
  const article = await getBlogPostBySlug(slug);

  if (!article) {
    notFound();
  }

  const coverImageUrl = article.coverImage
    ? getBlogCoverImageUrl(article.coverImage)
    : "";

  return (
    <main className={styles.page}>
      <article className={styles.article}>
        <Container>
          <div className={styles.inner}>
            <header className={styles.hero}>
              <p className={styles.kicker}>Полезный материал по теме</p>

              <div className={styles.meta}>
                <time dateTime={article.publishedAt}>
                  {formatDate(article.publishedAt)}
                </time>
              </div>

              <h1 className={styles.title}>{article.title}</h1>

              <p className={styles.excerpt}>{article.excerpt}</p>

              {coverImageUrl ? (
                <div className={styles.cover}>
                  <Image
                    src={coverImageUrl}
                    alt={article.coverImage?.alt || article.title}
                    fill
                    className={styles.coverImage}
                    sizes="(max-width: 768px) 100vw, 1200px"
                    priority
                  />
                  <span className={styles.coverOverlay} />
                </div>
              ) : null}
            </header>

            <div className={styles.contentWrap}>
              <div className={styles.content}>
                {article.content?.length ? (
                  <PortableText
                    value={article.content}
                    components={portableTextComponents}
                  />
                ) : null}
              </div>

              <aside className={styles.ctaBox}>
                <div className={styles.ctaInner}>
                  <p className={styles.ctaEyebrow}>Нужен не просто ответ</p>

                  <p className={styles.ctaText}>
                    Если вам нужен не только общий материал по теме, а понятное
                    практическое решение под задачу, посмотрите основной подход,
                    услуги и формат работы.
                  </p>

                  <Button href="/" variant="secondary" size="sm">
                    Посмотреть решение
                  </Button>
                </div>
              </aside>
            </div>
          </div>
        </Container>
      </article>
    </main>
  );
}
