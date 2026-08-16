import type { Metadata } from "next";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";
import { getSiteSettings } from "@/sanity/lib/fetchers";
import styles from "../content.module.scss";
export const metadata: Metadata = { title: "Контакты мастерской Carmanof", description: "Связаться с Carmanof: изготовление шкал, пересвет и ремонт приборных панелей. Краснодар, заказы по всей России.", alternates: { canonical: "/contacts" } };
export default async function ContactsPage() { const settings = await getSiteSettings(); return <div className={styles.page}><header className={styles.hero}><p className={styles.eyebrow}>Контакты</p><h1>Начнём с вашей <span>приборки</span></h1><p>Пришлите фото, модель и год автомобиля. Этого достаточно, чтобы сделать первичную оценку и предложить следующий шаг.</p></header><Contact settings={settings} /><Footer /></div>; }
