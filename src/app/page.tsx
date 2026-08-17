import type { Metadata } from "next";
import Hero from "@/components/Hero/Hero";
import HomeExperience from "@/components/HomeExperience/HomeExperience";
import FAQ from "@/components/FAQ/FAQ";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";
import { getSiteSettings, type FAQItem, type SiteSettings } from "@/sanity/lib/fetchers";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Шкалы приборов на заказ по России",
  description: "Изготовление индивидуальных шкал приборов, пересвет и ремонт приборных панелей в мастерской Carmanof. Краснодар, доставка СДЭК по всей России.",
  alternates: { canonical: "/" },
};

const fallbackFaq: FAQItem[] = [
  { question: "Как заказать шкалы, если я нахожусь не в Краснодаре?", answer: "Напишите нам и пришлите фото приборной панели, модель и год автомобиля. Мы оценим задачу, подскажем, как безопасно снять и упаковать панель, после чего вы сможете отправить её СДЭК. Готовую работу отправим обратно в ваш город." },
  { question: "Можно ли сделать полностью индивидуальный дизайн?", answer: "Да. Можно изменить графику, цвет, шрифты, логотип, отдельные обозначения и характер подсветки. Перед изготовлением согласуем внешний вид и технические ограничения конкретной панели." },
  { question: "Сколько времени занимает изготовление?", answer: "Срок зависит от модели панели и объёма работ. После первичной оценки сообщим ориентир, а точный срок зафиксируем до начала изготовления. Макет и ключевые детали обязательно согласовываем заранее." },
  { question: "Обязательно ли отправлять оригинальную приборную панель?", answer: "Для части популярных моделей достаточно исходных данных и хороших фотографий, но индивидуальный или редкий проект часто требует оригинала для точного снятия размеров и проверки. Скажем это сразу после оценки." },
  { question: "Какая гарантия, что всё будет работать после установки?", answer: "Перед отправкой проверяем изготовленные элементы, равномерность подсветки и работу панели в доступном объёме. Рекомендации по установке и условия по конкретному проекту обсуждаем до старта." },
];

export default async function HomePage() {
  const settings: SiteSettings = await getSiteSettings();
  const prices = [
    { title: settings?.pricesItem01Title || "Шкалы и накладки", value: settings?.pricesItem01Value || "7 000" },
    { title: settings?.pricesItem02Title || "Пересвет приборной панели", value: settings?.pricesItem02Value || "3 500" },
    { title: settings?.pricesItem03Title || "Ремонт приборной панели", value: settings?.pricesItem03Value || "2 500" },
  ];
  const faqItems = fallbackFaq.map((fallback, index) => ({
    question: settings?.faqItems?.[index]?.question || fallback.question,
    answer: settings?.faqItems?.[index]?.answer || fallback.answer,
  }));
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    name: "Carmanof",
    legalName: "ИП Карманов Алексей Олегович",
    url: "https://carmanof.ru",
    image: "https://carmanof.ru/og-carmanof-v2-1200x630.png",
    telephone: settings?.phone || "+7 918 240-21-80",
    address: { "@type": "PostalAddress", addressLocality: "Краснодар", addressCountry: "RU" },
    areaServed: { "@type": "Country", name: "Россия" },
    description: "Изготовление индивидуальных шкал приборов, пересвет и ремонт приборных панелей.",
    taxID: "590610034700",
    identifier: "ОГРНИП 323595800112271",
    priceRange: "₽₽",
    sameAs: ["https://t.me/Carmanof_MANAGER", "https://vk.com/carmanof"],
    hasOfferCatalog: { "@type": "OfferCatalog", name: "Услуги Carmanof", itemListElement: ["Шкалы приборов на заказ", "Пересвет приборной панели", "Ремонт приборной панели"].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })) },
    openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "10:00", closes: "19:00" }],
  };
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqItems.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([businessSchema, faqSchema]) }} />
      <Hero />
      <HomeExperience prices={prices} />
      <FAQ items={faqItems} />
      <Contact settings={settings} />
      <Footer />
    </>
  );
}
