import type { Metadata } from "next";
import type { Image as SanityImage } from "sanity";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Footer from "@/components/Footer/Footer";
import { blogArticles, getBlogArticleBySlug, getRelatedBlogArticles } from "@/data/blog";
import { getBlogCoverImageUrl, urlFor } from "@/sanity/lib/image";
import { getBlogPostBySlug, getBlogPostSlugs } from "@/sanity/lib/fetchers";
import styles from "./article.module.scss";

type PortableTextImageValue = SanityImage & { alt?: string; caption?: string };
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = true;

function formatDate(date: string) { return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(new Date(date)); }

const components: PortableTextComponents = {
  block: { normal: ({ children }) => <p>{children}</p>, h2: ({ children }) => <h2>{children}</h2>, h3: ({ children }) => <h3>{children}</h3>, blockquote: ({ children }) => <blockquote>{children}</blockquote> },
  list: { bullet: ({ children }) => <ul>{children}</ul>, number: ({ children }) => <ol>{children}</ol> },
  types: { image: ({ value }) => { const image = value as PortableTextImageValue; const src = urlFor(image).width(1400).auto("format").quality(82).url(); return <figure><div className={styles.inlineImage}><Image src={src} alt={image.alt || "Приборная панель"} fill sizes="(max-width: 760px) 100vw, 760px" /></div>{image.caption && <figcaption>{image.caption}</figcaption>}</figure>; } },
};

export async function generateStaticParams() {
  const cmsSlugs = await getBlogPostSlugs();
  return [...new Set([...cmsSlugs.map((item) => item.slug), ...blogArticles.map((item) => item.slug)])].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cms = await getBlogPostBySlug(slug);
  const local = getBlogArticleBySlug(slug);
  const article = cms || local;
  if (!article) return { title: "Материал не найден", robots: { index: false, follow: false } };
  const description = ("seoDescription" in article && article.seoDescription) || article.excerpt;
  const title = ("seoTitle" in article && article.seoTitle) || article.title;
  const image = cms?.coverImage ? getBlogCoverImageUrl(cms.coverImage) : local?.coverImage;
  return { title, description, alternates: { canonical: `/blog/${slug}` }, openGraph: { title: `${title} | Carmanof`, description, type: "article", locale: "ru_RU", url: `/blog/${slug}`, publishedTime: article.publishedAt, images: image ? [{ url: image, alt: article.title }] : [] }, twitter: { card: "summary_large_image", title, description, images: image ? [image] : [] } };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const cms = await getBlogPostBySlug(slug);
  const local = getBlogArticleBySlug(slug);
  if (!cms && !local) notFound();
  const title = cms?.title || local!.title;
  const excerpt = cms?.excerpt || local!.excerpt;
  const publishedAt = cms?.publishedAt || local!.publishedAt;
  const cover = cms?.coverImage ? getBlogCoverImageUrl(cms.coverImage) : local!.coverImage;
  const readingTime = local?.readingTime || "5 минут";
  const related = getRelatedBlogArticles(slug, 2);
  const schema = { "@context": "https://schema.org", "@type": "BlogPosting", headline: title, description: excerpt, image: cover.startsWith("http") ? cover : `https://carmanof.ru${cover}`, datePublished: publishedAt, dateModified: publishedAt, inLanguage: "ru-RU", mainEntityOfPage: `https://carmanof.ru/blog/${slug}`, author: { "@type": "Organization", name: "Carmanof" }, publisher: { "@type": "Organization", name: "Carmanof", url: "https://carmanof.ru" } };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><main className={styles.page}><article>
    <header className={styles.hero}><Link href="/blog">← Все статьи</Link><div className={styles.meta}><time dateTime={publishedAt}>{formatDate(publishedAt)}</time><span>{readingTime} чтения</span></div><h1>{title}</h1><p>{excerpt}</p></header>
    <div className={styles.cover}><Image src={cover} alt={`Иллюстрация к статье «${title}»`} fill priority sizes="(max-width: 760px) 100vw, 1180px" /></div>
    <div className={styles.reading}>
      <div className={styles.content}>{cms?.content?.length ? <PortableText value={cms.content} components={components} /> : local && <><p className={styles.lead}>{local.content.intro}</p>{local.content.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.list && <ul>{section.list.map((item) => <li key={item}>{item}</li>)}</ul>}</section>)}</>}</div>
      <aside><p>Нужна оценка вашей панели?</p><span>Пришлите модель автомобиля и фотографии — мастер ответит, что можно сделать.</span><Link href="/#contact">Написать мастеру ↗</Link></aside>
    </div>
    <footer className={styles.related}><p>Читать дальше</p><div>{related.map((item) => <Link href={`/blog/${item.slug}`} key={item.slug}><span>{item.readingTime}</span><b>{item.title}</b></Link>)}</div></footer>
  </article></main><Footer /></>;
}
