import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import Container from "@/components/ui/Container/Container";
import { getBlogPosts } from "@/sanity/lib/fetchers";
import { getCardImageUrl } from "@/sanity/lib/image";

import styles from "./blog.module.scss";
import Footer from "@/components/Footer/Footer";

export const metadata: Metadata = {
  title: "Полезные материалы",
  description:
    "Материалы Carmanof по приборным панелям, ремонту, восстановлению и типовым вопросам автоэлектроники.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Полезные материалы | Carmanof",
    description:
      "Материалы Carmanof по приборным панелям, ремонту, восстановлению и типовым вопросам автоэлектроники.",
    type: "website",
    locale: "ru_RU",
    url: "/blog",
  },
  twitter: {
    card: "summary",
    title: "Полезные материалы | Carmanof",
    description:
      "Материалы Carmanof по приборным панелям, ремонту, восстановлению и типовым вопросам автоэлектроники.",
  },
};

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();
  const hasPosts = blogPosts.length > 0;

  return (
    <><main className={styles.page}>
      <section className={styles.section}>
        <Container>
          <div className={styles.inner}>
            <header className={styles.hero}>
              <p className={styles.kicker}>Полезные материалы</p>

              <h1 className={styles.title}>
                Статьи по приборным панелям и автоэлектронике
              </h1>

              <p className={styles.description}>
                Короткие материалы по типовым вопросам: признаки неисправностей,
                возможные причины, особенности ремонта, восстановления и
                практического решения.
              </p>
            </header>

            {hasPosts ? (
              <div className={styles.grid}>
                {blogPosts.map((post) => {
                  const imageUrl = post.coverImage
                    ? getCardImageUrl(post.coverImage)
                    : "";

                  return (
                    <article key={post._id} className={styles.card}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className={styles.cardLink}
                        aria-label={`Открыть статью: ${post.title}`}
                      >
                        {imageUrl ? (
                          <div className={styles.media}>
                            <Image
                              src={imageUrl}
                              alt={post.coverImage?.alt || post.title}
                              fill
                              className={styles.image}
                              sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw"
                            />
                          </div>
                        ) : null}

                        <div className={styles.content}>
                          <time
                            className={styles.date}
                            dateTime={post.publishedAt}
                          >
                            {formatDate(post.publishedAt)}
                          </time>

                          <h2 className={styles.cardTitle}>{post.title}</h2>

                          <p className={styles.excerpt}>{post.excerpt}</p>

                          <span className={styles.arrow} aria-hidden="true">
                            ↗
                          </span>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p className={styles.emptyText}>
                  Материалы временно недоступны. Вы можете вернуться на главную
                  страницу и посмотреть основные услуги и примеры работ.
                </p>
              </div>
            )}
          </div>
        </Container>
      </section>
    </main><Footer /></>
  );
}
