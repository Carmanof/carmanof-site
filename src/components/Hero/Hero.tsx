"use client";

import Image from "next/image";
import { useCallback } from "react";
import styles from "./Hero.module.scss";
import Container from "@/components/ui/Container/Container";
import Button from "@/components/ui/Button/Button";

type HeroProps = { defaultImageSrc?: string; hoverImageSrc?: string };

export default function Hero({ defaultImageSrc = "/images/hero/hero-default.webp" }: HeroProps) {
  const scrollTo = useCallback((selector: string) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <section className={styles.hero} id="home">
      <Image
        src="/images/hero/hero-premium-generated-v1.png"
        alt="Индивидуальная приборная панель Carmanof"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className={styles.backgroundImage}
      />
      <div className={styles.overlay} />
      <Container>
        <div className={styles.content}>
          <p className={styles.eyebrow}>Мастерская Carmanof · Краснодар</p>
          <h1 className={styles.title}>
            Шкалы<br />
            приборов<br />
            <span>на заказ</span>
          </h1>
          <p className={styles.description}>
            Изготавливаем шкалы, накладки и подсветку приборных панелей
            под конкретную модель автомобиля.
          </p>
          <p className={styles.caption}>Работаем по всей России · отправка СДЭК</p>
          <div className={styles.actions}>
            <Button href="#contact" variant="primary" size="sm" onClick={(event) => { event.preventDefault(); scrollTo("#contact"); }}>
              Рассчитать проект
            </Button>
            <button type="button" className={styles.secondaryAction} onClick={() => scrollTo("#cases")}>
              Смотреть работы
            </button>
          </div>
        </div>
      </Container>
      <Container>
        <div className={styles.advantages} aria-label="Преимущества мастерской">
          <p><b>01</b> СДЭК по России</p>
          <p><b>02</b> Индивидуальный макет</p>
          <p><b>03</b> Проверка перед отправкой</p>
        </div>
      </Container>
    </section>
  );
}
