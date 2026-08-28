import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRightIcon, CarProfileIcon, VideoCameraIcon } from "@phosphor-icons/react/dist/ssr";
import Footer from "@/components/Footer/Footer";
import { brandPages, getYoutubeThumbnail, realVideoCases } from "@/data/realCases";
import CasesCatalog, { type CatalogItem } from "./CasesCatalog";
import styles from "./cases.module.scss";

export const metadata: Metadata = {
  title: "Работы: реальные шкалы и приборные панели",
  description: "Реальные фото и видео работ Carmanof: шкалы Hyundai Solaris, Chevrolet Aveo, ГАЗель, Nissan X‑Trail, Lada, Renault, Fiat, Škoda и Honda.",
  alternates: { canonical: "/cases" },
  openGraph: { title: "Реальные работы Carmanof", description: "Фото и видео индивидуальных шкал, пересвета и ремонта приборных панелей.", type: "website", locale: "ru_RU", url: "/cases", images: [{ url: getYoutubeThumbnail("iq0fddIiLIM"), alt: "Шкалы приборов Hyundai Solaris — работа Carmanof" }] },
};

const photoItems: CatalogItem[] = [
  { id: "photo-individual-scale", type: "photo", title: "Индивидуальная шкала с новой разметкой", description: "Фотография готовой приборной панели: изменены графика, деления и визуальные акценты.", brand: "Carmanof", model: "Индивидуальный проект", service: "Шкалы на заказ", image: "/images/more-examples/example-01-v2.webp" },
  { id: "photo-lighting", type: "photo", title: "Равномерный пересвет приборной панели", description: "Готовый результат с ровным свечением основных шкал и контрольных зон.", brand: "Carmanof", model: "Приборная панель", service: "Пересвет", image: "/images/more-examples/example-02-v2.webp" },
  { id: "photo-oem", type: "photo", title: "Шкалы в спокойном стиле OEM+", description: "Новая графика воспринимается как часть заводского интерьера, но делает панель выразительнее.", brand: "Carmanof", model: "OEM+ проект", service: "Дизайн шкал", image: "/images/more-examples/example-04-v2.webp" },
  { id: "photo-complex", type: "photo", title: "Комплексная доработка шкал и подсветки", description: "Шкала и свет настроены вместе, чтобы результат оставался цельным днём и ночью.", brand: "Carmanof", model: "Комплексный проект", service: "Шкалы + пересвет", image: "/images/more-examples/example-05-v2.webp" },
  { id: "photo-restoration", type: "photo", title: "Восстановленная приборная панель", description: "Пример аккуратного восстановления деталей и итоговой сборки приборной панели.", brand: "Carmanof", model: "Восстановление", service: "Ремонт", image: "/images/other-works/other-work-01.webp" },
];

const videoItems: CatalogItem[] = realVideoCases.map((item) => ({ id: item.id, type: "video", title: item.title, description: item.description, brand: item.brand, model: item.model, service: item.service, youtubeId: item.youtubeId, image: getYoutubeThumbnail(item.youtubeId), brandHref: item.brandSlug ? `/cases/${item.brandSlug}` : undefined }));
const catalogItems = [...videoItems, ...photoItems];

export default function CasesPage() {
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: "Реальные работы Carmanof", url: "https://carmanof.ru/cases", description: "Фото и видео выполненных работ с приборными панелями", mainEntity: { "@type": "ItemList", numberOfItems: catalogItems.length, itemListElement: catalogItems.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.title, url: item.brandHref ? `https://carmanof.ru${item.brandHref}` : "https://carmanof.ru/cases" })) } };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><main className={styles.page}>
    <header className={styles.hero}>
      <div><p>Реальные проекты / фото и видео</p><h1>Работы Carmanof</h1></div>
      <div className={styles.heroAside}><VideoCameraIcon weight="duotone" /><strong>Работы мастерской</strong><p>Здесь собраны приборные панели наших клиентов — показываем процесс и готовый результат.</p></div>
    </header>

    <section className={styles.brands} aria-labelledby="brands-title">
      <div><CarProfileIcon weight="duotone" /><p>Поиск по автомобилю</p><h2 id="brands-title">Работы и решения по маркам</h2></div>
      <nav aria-label="Работы по маркам автомобилей">{brandPages.map((brand) => <Link href={`/cases/${brand.slug}`} key={brand.slug}><span>{brand.brand}</span><small>{brand.models}</small><ArrowUpRightIcon /></Link>)}</nav>
    </section>

    <section className={styles.catalog} aria-labelledby="catalog-title">
      <div className={styles.catalogHead}><p>Каталог выполненных работ</p><h2 id="catalog-title">Смотрите результат в одном понятном формате</h2><span>Все превью имеют одинаковые пропорции. У каждой работы указаны автомобиль, услуга и краткое описание результата.</span></div>
      <CasesCatalog items={catalogItems} />
    </section>

    <section className={styles.final}><p>Нужна шкала для вашей модели?</p><h2>Пришлите фото приборной панели — проверим, что можно сделать.</h2><Link href="/#contact">Обсудить проект <ArrowUpRightIcon /></Link></section>
  </main><Footer /></>;
}
