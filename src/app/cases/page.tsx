import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Play } from "lucide-react";
import Footer from "@/components/Footer/Footer";
import styles from "./cases.module.scss";

export const metadata: Metadata = {
  title: "Работы: шкалы и тюнинг приборных панелей",
  description: "Примеры работ Carmanof: индивидуальные шкалы, OEM+ дизайн, пересвет и восстановление приборных панелей. Фото и видео результата.",
  alternates: { canonical: "/cases" },
  openGraph: { title: "Работы Carmanof", description: "Индивидуальные шкалы, пересвет и комплексная доработка приборных панелей.", type: "website", locale: "ru_RU", url: "/cases" },
};

const works = [
  { image: "/images/more-examples/example-01-v2.webp", type: "Индивидуальная шкала", title: "Контрастная разметка и новый характер панели", task: "Изменить привычный вид шкал, сохранив быструю считываемость показаний.", result: "Переработаны графика, деления, шрифты и цветовые акценты." },
  { image: "/images/more-examples/example-02-v2.webp", type: "Пересвет", title: "Ровная подсветка без тёмных участков", task: "Обновить цвет панели и убрать неравномерность штатного света.", result: "Подобраны оттенок и яркость, панель проверена после сборки." },
  { image: "/images/more-examples/example-03-v2.webp", type: "OEM+ дизайн", title: "Заводская логика с индивидуальными деталями", task: "Сделать интерьер выразительнее без ощущения чужеродного тюнинга.", result: "Сохранена структура приборов, добавлены новая типографика и акценты." },
  { image: "/images/more-examples/example-04-v2.webp", type: "Комплексная работа", title: "Шкалы и подсветка как единая система", task: "Согласовать дизайн шкал с цветом и интенсивностью свечения.", result: "Макет и свет настроены вместе, чтобы панель выглядела цельно днём и ночью." },
  { image: "/images/more-examples/example-05-v2.webp", type: "Авторский макет", title: "Новая графика под пожелания владельца", task: "Разработать заметный, но не перегруженный индивидуальный образ.", result: "Создан макет с собственными обозначениями и точной разметкой." },
  { image: "/images/other-works/other-work-01.webp", type: "Восстановление", title: "Читаемость и аккуратный вид приборной панели", task: "Вернуть панели опрятный вид и устранить визуальные дефекты.", result: "Восстановлены элементы, проведена сборка и итоговая проверка." },
];

export default function CasesPage() {
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: "Работы Carmanof", url: "https://carmanof.ru/cases", mainEntity: { "@type": "ItemList", itemListElement: works.map((work, index) => ({ "@type": "ListItem", position: index + 1, name: work.title, url: "https://carmanof.ru/cases" })) } };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><main className={styles.page}>
    <header className={styles.hero}><div><p>Портфолио / Carmanof</p><h1>Работы в одном масштабе</h1></div><p>Для каждого примера показываем не просто фотографию, а задачу и результат. Все изображения приведены к единому формату — так удобнее сравнивать графику, контраст и подсветку.</p></header>
    <nav className={styles.filters} aria-label="Форматы портфолио"><span>Избранные проекты</span><Link href="/cases/photo">Все фотографии <ArrowUpRight /></Link><Link href="/cases/video"><Play /> Видео работ</Link></nav>
    <section className={styles.grid} aria-label="Примеры выполненных работ">{works.map((work, index) => <article key={work.title} className={styles.card}>
      <Link href="/cases/photo" className={styles.media}><Image src={work.image} alt={`${work.type}: ${work.title}`} fill sizes="(max-width: 700px) 100vw, 50vw" /><span>0{index + 1}</span></Link>
      <div className={styles.copy}><p>{work.type}</p><h2>{work.title}</h2><dl><div><dt>Задача</dt><dd>{work.task}</dd></div><div><dt>Результат</dt><dd>{work.result}</dd></div></dl></div>
    </article>)}</section>
    <section className={styles.final}><p>Хотите похожий результат?</p><h2>Покажите свою приборную панель — предложим решение под неё.</h2><Link href="/#contact">Обсудить проект <ArrowUpRight /></Link></section>
  </main><Footer /></>;
}
