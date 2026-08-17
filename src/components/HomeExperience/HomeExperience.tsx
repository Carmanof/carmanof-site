"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, PackageCheck, PenTool, PlayCircle, ShieldCheck, Truck } from "lucide-react";
import styles from "./HomeExperience.module.scss";

type PriceItem = { title: string; value: string };

const services = [
  { number: "01", title: "Шкалы на заказ", text: "Разрабатываем графику под конкретную приборную панель, стиль автомобиля и ваши пожелания. Можно изменить разметку, цвет, шрифты, логотип и характер подсветки.", price: "от 7 000 ₽", href: "/services#custom" },
  { number: "02", title: "Пересвет панели", text: "Меняем цвет и яркость штатной подсветки, устраняем неравномерность и подбираем оттенок под интерьер автомобиля.", price: "от 3 500 ₽", href: "/services#lighting" },
  { number: "03", title: "Ремонт приборки", text: "Диагностируем неисправности, восстанавливаем электронику, индикацию и повреждённые элементы панели.", price: "от 2 500 ₽", href: "/services#repair" },
  { number: "04", title: "Отдельные элементы", text: "Изготавливаем стрелки, кольца, платы подсветки и другие детали как отдельную задачу или часть комплексного проекта.", price: "по расчёту", href: "/services#elements" },
];

const process = [
  { icon: PenTool, title: "Обсуждаем задачу", text: "Вы присылаете фото приборки, модель автомобиля и пожелания по дизайну." },
  { icon: PackageCheck, title: "Согласовываем решение", text: "Оцениваем работу, уточняем детали и фиксируем понятный план до старта." },
  { icon: Check, title: "Создаём и проверяем", text: "Изготавливаем, собираем и тестируем панель, чтобы результат совпал с макетом." },
  { icon: Truck, title: "Отправляем обратно", text: "Надёжно упаковываем и отправляем готовую приборку СДЭК в ваш город." },
];

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <motion.div className={className} initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .62, ease: [.22,1,.36,1] }}>{children}</motion.div>;
}

export default function HomeExperience({ prices }: { prices: PriceItem[] }) {
  return (
    <main>
      <section className={styles.statement} aria-labelledby="statement-title">
        <div className={styles.shell}>
          <p className={styles.kicker}>Carmanof / индивидуальное производство</p>
          <Reveal className={styles.statementGrid}>
            <h2 id="statement-title">Не подбираем похожее.<br /><span>Делаем именно ваше.</span></h2>
            <div><p>Шкала приборов — деталь, которую водитель видит каждый день. Поэтому здесь важны не только яркость и внешний эффект, но и точная разметка, читаемость и аккуратная сборка.</p><p>В Carmanof каждый заказ начинаем с конкретной панели и задачи. Так результат выглядит органично, а не как универсальный тюнинг.</p></div>
          </Reveal>
        </div>
      </section>

      <section className={styles.works} id="works" aria-labelledby="works-title">
        <div className={styles.shell}>
          <div className={styles.sectionHead}><p className={styles.kicker}>Выбранные работы / 2024—2026</p><h2 id="works-title">Приборные панели, которые обрели характер</h2><Link href="/cases">Все работы <ArrowUpRight size={18} /></Link></div>
          <div className={styles.gallery}>
            <Reveal className={styles.workCard}><Link href="/cases/hyundai"><Image src="https://i.ytimg.com/vi/iq0fddIiLIM/hqdefault.jpg" alt="Обновление приборной панели Hyundai Solaris — видео Carmanof" fill unoptimized sizes="(max-width: 760px) 100vw, 50vw" /><i><PlayCircle /></i><span><b>Hyundai Solaris — новые шкалы</b><small>реальный видеокейс · смотреть результат</small></span></Link></Reveal>
            <Reveal className={styles.workCard}><Link href="/cases/chevrolet"><Image src="https://i.ytimg.com/vi/kzHdRZxFJH0/hqdefault.jpg" alt="Новые шкалы Chevrolet Aveo — видео Carmanof" fill unoptimized sizes="(max-width: 760px) 100vw, 50vw" /><i><PlayCircle /></i><span><b>Chevrolet Aveo — тюнинг щитка</b><small>реальный видеокейс · индивидуальная графика</small></span></Link></Reveal>
            <Reveal className={styles.workCard}><Link href="/cases"><Image src="/images/more-examples/example-04-v2.webp" alt="Кастомная приборная панель Carmanof" fill sizes="(max-width: 760px) 100vw, 50vw" /><span><b>Шкалы в стиле OEM+</b><small>заводская логика · новый характер</small></span></Link></Reveal>
            <Reveal className={styles.workCard}><Link href="/cases"><Image src="/images/more-examples/example-05-v2.webp" alt="Комплексная доработка приборной панели Carmanof" fill sizes="(max-width: 760px) 100vw, 50vw" /><span><b>Шкалы и пересвет панели</b><small>единый дизайн · проверка после сборки</small></span></Link></Reveal>
          </div>
        </div>
      </section>

      <section className={styles.services} id="services" aria-labelledby="services-title">
        <div className={styles.shell}>
          <div className={styles.sectionHead}><p className={styles.kicker}>Услуги</p><h2 id="services-title">От новой шкалы до полного восстановления панели</h2></div>
          <div className={styles.serviceList}>{services.map((service) => <Link href={service.href} className={styles.service} key={service.number}><span className={styles.serviceNumber}>{service.number}</span><h3>{service.title}</h3><p>{service.text}</p><strong>{service.price}</strong><ArrowUpRight className={styles.serviceArrow} /></Link>)}</div>
        </div>
      </section>

      <section className={styles.delivery} id="delivery" aria-labelledby="delivery-title">
        <div className={styles.shell}>
          <Reveal className={styles.deliveryIntro}><p className={styles.kicker}>Краснодар → вся Россия</p><h2 id="delivery-title">Доставка и <span>оплата</span></h2><p>Работаем с автомобилями в Краснодаре и принимаем приборные панели из других городов через СДЭК. До старта фиксируем состав работ, стоимость и порядок оплаты — без неожиданных доплат после изготовления.</p><div className={styles.route}><span>Ваш город</span><i /><Truck /><i /><span>Мастерская Carmanof</span></div></Reveal>
          <div className={styles.deliveryDetails}><div><b>Доставка</b><p>Подскажем, как снять и безопасно упаковать панель. После получения осмотрим её, а готовую работу проверим, упакуем и отправим обратно.</p></div><div><b>Оплата</b><p>Сначала оцениваем фото и задачу. Точную стоимость, этапы и удобный способ оплаты согласовываем лично до начала работ.</p></div><Link href="/delivery">Все условия <ArrowUpRight size={18} /></Link></div>
          <div className={styles.processHead}><p className={styles.kicker}>Порядок работы</p><h3>Четыре понятных шага</h3></div>
          <div className={styles.process}>{process.map((item, index) => { const Icon = item.icon; return <Reveal className={styles.processItem} key={item.title}><span>0{index + 1}</span><Icon /><h3>{item.title}</h3><p>{item.text}</p></Reveal>; })}</div>
        </div>
      </section>

      <section className={styles.about} aria-labelledby="about-title">
        <div className={styles.shell}>
          <div className={styles.aboutGrid}><Reveal className={styles.aboutImage}><Image src="/images/main-offer/main-offer-v5.webp" alt="Работа мастера Carmanof с приборной панелью" fill sizes="(max-width: 760px) 100vw, 48vw" /></Reveal><Reveal className={styles.aboutCopy}><p className={styles.kicker}>О мастерской</p><h2 id="about-title">Ручная работа там, где важна точность</h2><p>Мы не потоковый магазин готовых накладок. Carmanof — мастерская, которая работает с задачей целиком: оценивает исходную панель, проектирует макет, изготавливает детали и проверяет результат.</p><ul><li><ShieldCheck /> Согласование до изготовления</li><li><ShieldCheck /> Проверка панели перед отправкой</li><li><ShieldCheck /> Связь с мастером по ходу проекта</li></ul><Link href="/about">Подробнее о мастерской <ArrowUpRight size={18} /></Link></Reveal></div>
        </div>
      </section>

      <section className={styles.prices} id="prices" aria-labelledby="prices-title">
        <div className={styles.shell}>
          <div className={styles.priceIntro}><p className={styles.kicker}>Стоимость</p><h2 id="prices-title">Ориентиры до точного расчёта</h2><p>Итоговая стоимость зависит от модели панели, её состояния и объёма изменений. После фото и короткого описания задачи назовём цену до начала работ.</p></div>
          <div className={styles.priceList}>{prices.map((item, index) => <div className={styles.priceRow} key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><strong>от {item.value.replace(/\s*₽$/, "")} ₽</strong></div>)}</div>
          <Link className={styles.priceCta} href="#contact">Получить точный расчёт <ArrowUpRight /></Link>
        </div>
      </section>
    </main>
  );
}
