"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDownRight, MapPin } from "lucide-react";
import { brandSlogan } from "@/config/business";
import styles from "./Hero.module.scss";

export default function Hero() {
  return (
    <section className={styles.hero} id="home">
      <Image src="/images/hero/hero-premium-final.png" alt="Индивидуальная приборная панель Carmanof с яркой подсветкой" fill priority fetchPriority="high" sizes="100vw" className={styles.image} />
      <div className={styles.shade} />
      <div className={styles.inner}>
        <motion.div className={styles.copy} initial={false}>
          <p className={styles.eyebrow}><MapPin size={16} /><span><strong>{brandSlogan}</strong> · Краснодар · вся Россия</span></p>
          <h1>Шкалы приборов <span>на заказ</span></h1>
          <p className={styles.lead}>Создаём индивидуальные шкалы и приборные панели под конкретный автомобиль — от идеи и макета до проверки готового результата.</p>
          <div className={styles.actions}>
            <Link className={styles.primary} href="#contact">Рассчитать проект <ArrowDownRight size={20} /></Link>
            <Link className={styles.secondary} href="#works">Смотреть работы</Link>
          </div>
        </motion.div>
        <div className={styles.proof} aria-label="Преимущества мастерской">
          <div><span>01</span><strong>Индивидуальный макет</strong><small>Не шаблон из каталога</small></div>
          <div><span>02</span><strong>СДЭК по России</strong><small>Принимаем заказы из регионов</small></div>
          <div><span>03</span><strong>Контроль результата</strong><small>Проверяем перед отправкой</small></div>
        </div>
      </div>
      <span className={styles.scroll}>Листайте вниз <ArrowDownRight size={15} /></span>
    </section>
  );
}
