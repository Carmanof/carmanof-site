import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ArrowUpRightIcon, CheckCircleIcon, PlayCircleIcon } from "@phosphor-icons/react/dist/ssr";
import Footer from "@/components/Footer/Footer";
import { brandPages, getBrandPage, getCasesByBrand, getYoutubeThumbnail } from "@/data/realCases";
import CasesCatalog, { type CatalogItem } from "../CasesCatalog";
import styles from "./brand.module.scss";

type Props = { params: Promise<{ brand: string }> };

export function generateStaticParams() { return brandPages.map((page) => ({ brand: page.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand } = await params;
  const page = getBrandPage(brand);
  if (!page) return { title: "Работы не найдены", robots: { index: false, follow: false } };
  const firstCase = getCasesByBrand(brand)[0];
  return { title: page.seoTitle, description: page.seoDescription, alternates: { canonical: `/cases/${brand}` }, openGraph: { title: `${page.seoTitle} | Carmanof`, description: page.seoDescription, url: `/cases/${brand}`, type: "website", locale: "ru_RU", images: firstCase ? [{ url: getYoutubeThumbnail(firstCase.youtubeId), alt: firstCase.title }] : [] } };
}

export default async function BrandCasesPage({ params }: Props) {
  const { brand } = await params;
  const page = getBrandPage(brand);
  if (!page) notFound();
  const cases = getCasesByBrand(brand);
  const items: CatalogItem[] = cases.map((item) => ({ id: item.id, type: "video", title: item.title, description: item.description, brand: item.brand, model: item.model, service: item.service, image: getYoutubeThumbnail(item.youtubeId), youtubeId: item.youtubeId }));
  const related = brandPages.filter((item) => item.slug !== brand).slice(0, 5);
  const schema = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Главная", item: "https://carmanof.ru" }, { "@type": "ListItem", position: 2, name: "Работы", item: "https://carmanof.ru/cases" }, { "@type": "ListItem", position: 3, name: page.brand, item: `https://carmanof.ru/cases/${brand}` }] },
    { "@context": "https://schema.org", "@type": "Service", name: page.title, description: page.seoDescription, provider: { "@type": "AutomotiveBusiness", name: "Carmanof", url: "https://carmanof.ru" }, areaServed: { "@type": "Country", name: "Россия" }, subjectOf: cases.map((item) => ({ "@type": "VideoObject", name: item.title, description: item.description, thumbnailUrl: getYoutubeThumbnail(item.youtubeId), embedUrl: `https://www.youtube.com/embed/${item.youtubeId}` })) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: page.faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) },
  ];

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><main className={styles.page}>
    <div className={styles.breadcrumbs}><Link href="/cases"><ArrowLeftIcon /> Все работы</Link><span>Carmanof / {page.brand}</span></div>
    <header className={styles.hero}>
      <div className={styles.heroCopy}><p>{page.brand} · {page.models}</p><h1>{page.title}</h1><div className={styles.lead}>{page.intro}</div></div>
      {cases[0] && <a href="#brand-works" className={styles.heroMedia} aria-label={`Перейти к видео: ${cases[0].title}`}><Image src={getYoutubeThumbnail(cases[0].youtubeId)} alt={cases[0].title} fill unoptimized priority sizes="(max-width: 850px) 100vw, 42vw" /><span /><PlayCircleIcon weight="fill" /></a>}
    </header>

    <section className={styles.proof} aria-label="Особенности заказа">{page.details.map((detail, index) => <div key={detail}><span>0{index + 1}</span><CheckCircleIcon weight="duotone" /><p>{detail}</p></div>)}</section>

    <section className={styles.works} aria-labelledby="brand-works"><div className={styles.sectionHead}><p>Выполненные работы</p><h2 id="brand-works">Реальные кейсы {page.brand}</h2><span>{cases.length} {cases.length === 1 ? "видеоработа" : cases.length < 5 ? "видеоработы" : "видеоработ"}</span></div><CasesCatalog items={items} showFilters={false} /></section>

    <section className={styles.info}><div><p>Как заказать</p><h2>Начните с фотографий вашей панели</h2></div><div><p>Укажите модель, год автомобиля и покажите щиток днём и с включённой подсветкой. Мастер проверит вариант панели, объяснит возможный результат и назовёт стоимость до начала работ.</p><Link href="/#contact">Получить оценку <ArrowUpRightIcon /></Link></div></section>

    <section className={styles.faq}><div><p>Вопросы по {page.brand}</p><h2>Коротко о главном</h2></div><div>{page.faq.map((item) => <article key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></article>)}</div></section>

    <nav className={styles.related} aria-label="Другие марки"><p>Другие марки</p>{related.map((item) => <Link key={item.slug} href={`/cases/${item.slug}`}>{item.brand}<ArrowUpRightIcon /></Link>)}</nav>
  </main><Footer /></>;
}
