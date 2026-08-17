import type { Metadata } from "next";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";
import { getSiteSettings } from "@/sanity/lib/fetchers";

export const metadata: Metadata = { title: "Контакты мастерской в Краснодаре", description: "Телефон и мессенджеры Carmanof. Заказать индивидуальные шкалы, пересвет или ремонт приборной панели: Краснодар, Пн–Сб 10:00–19:00.", alternates: { canonical: "/contacts" }, openGraph: { title: "Контакты Carmanof", description: "Связаться с мастером по шкалам и приборным панелям.", url: "/contacts", type: "website", locale: "ru_RU" } };

export default async function ContactsPage() {
  const settings = await getSiteSettings();
  const schema = { "@context": "https://schema.org", "@type": "ContactPage", name: "Контакты Carmanof", url: "https://carmanof.ru/contacts", mainEntity: { "@type": "LocalBusiness", name: "Carmanof", legalName: "ИП Карманов Алексей Олегович", taxID: "590610034700", telephone: settings?.phone || "+7 918 240-21-80", address: { "@type": "PostalAddress", addressLocality: "Краснодар", addressCountry: "RU" }, openingHours: "Mo-Sa 10:00-19:00" } };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><Contact settings={settings} isPage /><Footer /></>;
}
