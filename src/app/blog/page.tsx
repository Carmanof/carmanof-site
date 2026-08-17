import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer/Footer";
import { blogArticles } from "@/data/blog";
import { getBlogPosts } from "@/sanity/lib/fetchers";
import { getCardImageUrl } from "@/sanity/lib/image";
import styles from "./blog.module.scss";

export const metadata: Metadata = {
  title: "Блог о шкалах и приборных панелях",
  description: "Практические статьи Carmanof: изготовление шкал приборов, пересвет, ремонт и восстановление приборных панелей автомобиля.",
  alternates: { canonical: "/blog" },
  openGraph: { title: "Блог Carmanof", description: "Полезные материалы о шкалах, подсветке и ремонте приборных панелей.", type: "website", locale: "ru_RU", url: "/blog" },
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(new Date(date));
}

export default async function BlogPage() {
  const cmsPosts = await getBlogPosts();
  const posts = cmsPosts.length ? cmsPosts.map((post) => ({ id: post._id, slug: post.slug, title: post.title, excerpt: post.excerpt, publishedAt: post.publishedAt, readingTime: "", image: post.coverImage ? getCardImageUrl(post.coverImage) : "/images/cases/photo-preview.webp" })) : blogArticles.map((post) => ({ id: post.id, slug: post.slug, title: post.title, excerpt: post.excerpt, publishedAt: post.publishedAt, readingTime: post.readingTime, image: post.coverImage }));
  const schema = { "@context": "https://schema.org", "@type": "Blog", name: "Блог Carmanof", url: "https://carmanof.ru/blog", inLanguage: "ru-RU", blogPost: posts.map((post) => ({ "@type": "BlogPosting", headline: post.title, datePublished: post.publishedAt, url: `https://carmanof.ru/blog/${post.slug}` })) };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><main className={styles.page}>
    <header className={styles.hero}><div><p>Блог Carmanof</p><h1>Понятно о приборных панелях</h1></div><p>Практические материалы без рекламной воды: как выбрать дизайн шкал, что влияет на подсветку, когда панель можно восстановить и что подготовить перед заказом.</p></header>
    <section className={styles.list} aria-label="Список статей">
      {posts.map((post, index) => <article className={styles.article} key={post.id}><Link href={`/blog/${post.slug}`}>
        <div className={styles.number}>0{index + 1}</div>
        <div className={styles.media}><Image src={post.image} alt={`Приборная панель — ${post.title}`} fill sizes="(max-width: 760px) 100vw, 320px" /></div>
        <div className={styles.copy}><div className={styles.meta}><time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>{post.readingTime && <span>{post.readingTime} чтения</span>}</div><h2>{post.title}</h2><p>{post.excerpt}</p></div>
        <span className={styles.arrow}>Читать ↗</span>
      </Link></article>)}
    </section>
  </main><Footer /></>;
}
