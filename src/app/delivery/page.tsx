import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ChatCircleTextIcon, CreditCardIcon, PackageIcon, TruckIcon } from "@phosphor-icons/react/dist/ssr";
import Footer from "@/components/Footer/Footer";
import DeliveryJourney from "./DeliveryJourney";
import styles from "./delivery.module.scss";

export const metadata: Metadata = {
  title: "Доставка и оплата шкал приборов по России",
  description: "Как заказать индивидуальные шкалы и отправить приборную панель в Carmanof: оценка по фото, согласование стоимости, доставка СДЭК и оплата.",
  alternates: { canonical: "/delivery" },
  openGraph: {
    title: "Доставка и оплата | Carmanof",
    description: "Понятный порядок заказа, оплаты и доставки приборных панелей по России.",
    url: "/delivery",
    type: "website",
    locale: "ru_RU",
  },
};

const steps = [
  { icon: ChatCircleTextIcon, title: "Первичная оценка", text: "Напишите модель и год автомобиля, приложите фотографии приборной панели и коротко опишите желаемый результат." },
  { icon: CreditCardIcon, title: "Стоимость и оплата", text: "Мастер уточнит детали, назовёт стоимость и согласует порядок оплаты до начала изготовления." },
  { icon: PackageIcon, title: "Работа и проверка", text: "После получения панели создаём и согласовываем решение, выполняем работу и проверяем результат перед отправкой." },
  { icon: TruckIcon, title: "Доставка обратно", text: "Надёжно упаковываем готовую приборную панель и отправляем СДЭК в согласованный пункт или по адресу." },
];

export default function DeliveryPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Изготовление шкал приборов с доставкой по России",
    provider: { "@type": "LocalBusiness", name: "Carmanof", url: "https://carmanof.ru" },
    areaServed: { "@type": "Country", name: "Россия" },
    serviceType: "Изготовление и доставка индивидуальных шкал приборов",
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroCopy}><p>Краснодар · заказы по всей России</p><h1>Доставка<br />и <span>оплата</span></h1><div className={styles.heroLead}><b>Расстояние не усложняет заказ.</b><p>Большинство вопросов решаем по фотографиям и в переписке. Если нужна сама панель, объясним, как её снять, упаковать и отправить.</p></div><div className={styles.heroFacts}><span>СДЭК по России</span><span>Цена до начала</span><span>Проверка перед отправкой</span></div></div>
        <DeliveryJourney />
      </header>
      <section className={styles.content} aria-labelledby="delivery-steps">
        <div className={styles.intro}><p>Порядок заказа</p><h2 id="delivery-steps">От первого сообщения до готовой панели</h2></div>
        <div className={styles.steps}>{steps.map((step, index) => { const Icon = step.icon; return <article key={step.title}><span>0{index + 1}</span><Icon /><h3>{step.title}</h3><p>{step.text}</p></article>; })}</div>
        <div className={styles.notes}>
          <div><p>Если вы в Краснодаре</p><h2>Свяжитесь с мастером и согласуйте передачу панели.</h2></div>
          <div><p>Если вы из другого города</p><h2>Отправьте панель СДЭК после предварительной оценки.</h2></div>
        </div>
        <div className={styles.explain}><div><h2>Что входит в согласование</h2><ul><li>состав и ожидаемый результат работ;</li><li>стоимость до начала изготовления;</li><li>необходимость отправки оригинальной панели;</li><li>срок и способ обратной доставки.</li></ul></div><div><h2>Что подготовить для оценки</h2><ul><li>марку, модель и год автомобиля;</li><li>фото приборной панели при дневном свете;</li><li>фото включённой подсветки;</li><li>пример или описание желаемого дизайна.</li></ul></div></div>
        <Link className={styles.cta} href="/#contact">Оценить задачу по фото <ArrowUpRight /></Link>
      </section>
    </main>
    <Footer />
  </>;
}
