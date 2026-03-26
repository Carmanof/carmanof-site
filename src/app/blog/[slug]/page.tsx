import type { Metadata } from "next";
import type { Image as SanityImage } from "sanity";
import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

import Container from "@/components/ui/Container/Container";
import Button from "@/components/ui/Button/Button";
import { urlFor } from "@/sanity/lib/image";
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
      const imageUrl = urlFor(imageValue).width(1400).fit("crop").url();

      if (!imageUrl) {
        return null;
      }

      return (
        <figure className={styles.contentFigure}>
          <div className={styles.contentFigureMedia}>
            <Image
              src={imageUrl}
              alt={imageValue.alt || ""}
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
 * Актуальность списка дальше будет зависеть от fetch-слоя Sanity.
 */
export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs();

  return slugs.map((item: BlogSlugItem) => ({
    slug: item.slug,
  }));
}

/**
 * Metadata берем из Sanity через тот же fetch-слой,
 * чтобы кэш и revalidation вели себя одинаково для страницы и SEO.
 */
export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getBlogPostBySlug(slug);

  if (!article) {
    return {
      title: "Материал временно недоступен | Carmanof",
      description:
        "Материал временно недоступен. Перейдите на главную страницу и посмотрите основные услуги и подход к работе.",
    };
  }

  return {
    title: article.seoTitle || `${article.title} | Carmanof`,
    description: article.seoDescription || article.excerpt,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  /**
   * Основной контент статьи также идет через общий fetch-слой.
   * Это важно, чтобы route не жил отдельно от общей стратегии кэша Sanity.
   */
  const article = await getBlogPostBySlug(slug);

  if (!article) {
    return (
      <main className={styles.page}>
        <article className={styles.article}>
          <Container>
            <div className={styles.inner}>
              <header className={styles.hero}>
                <p className={styles.kicker}>Полезный материал по теме</p>

                <h1 className={styles.title}>Материал временно недоступен</h1>

                <p className={styles.excerpt}>
                  Сейчас мы не смогли загрузить эту страницу. Вы можете перейти
                  на главную и посмотреть услуги, подход и примеры работ.
                </p>
              </header>

              <section className={styles.bottomCta}>
                <div className={styles.bottomCtaInner}>
                  <p className={styles.bottomCtaEyebrow}>Следующий шаг</p>

                  <h2 className={styles.bottomCtaTitle}>
                    Нужна помощь по вашей задаче?
                  </h2>

                  <p className={styles.bottomCtaText}>
                    На главной странице собраны основные услуги, примеры работ и
                    формат взаимодействия. Это самый короткий путь к решению.
                  </p>

                  <Button href="/" variant="secondary" size="sm">
                    Посмотреть решение
                  </Button>
                </div>
              </section>
            </div>
          </Container>
        </article>
      </main>
    );
  }

  const coverImageUrl = article.coverImage?.asset?.url;

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

            <section className={styles.bottomCta}>
              <div className={styles.bottomCtaInner}>
                <p className={styles.bottomCtaEyebrow}>Следующий шаг</p>

                <h2 className={styles.bottomCtaTitle}>
                  Нужен практический результат, а не просто информация?
                </h2>

                <p className={styles.bottomCtaText}>
                  На главной странице собраны услуги, подход, примеры работ и
                  формат взаимодействия. Это самый короткий путь от вопроса к
                  решению.
                </p>

                <Button href="/" variant="secondary" size="sm">
                  Посмотреть решение
                </Button>
              </div>
            </section>
          </div>
        </Container>
      </article>
    </main>
  );
}
