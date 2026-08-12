"use client";

import Image from "next/image";
import { useCallback } from "react";
import styles from "./Hero.module.scss";
import Container from "@/components/ui/Container/Container";
import Button from "@/components/ui/Button/Button";

type HeroProps = {
  defaultImageSrc?: string;
  hoverImageSrc?: string;
};

const HERO_IMAGE_SIZES =
  "(max-width: 640px) calc(100vw - 28px), (max-width: 1024px) calc(100vw - 64px), (max-width: 1240px) 480px, 540px";

export default function Hero({
  defaultImageSrc = "/images/hero/hero-default.webp",
}: HeroProps) {
  const handleContactClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      event.preventDefault();
      document.querySelector("#contact")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
    [],
  );

  const handleMediaClick = useCallback(() => {
    const target = document.querySelector("#other-works");
    if (!target) return;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.pageYOffset - 172,
      behavior: "smooth",
    });
  }, []);

  return (
    <section className={styles.hero} id="home">
      <Container>
        <div className={styles.card}>
          <div className={styles.content}>
            <p className={styles.eyebrow}>Мастерская Carmanof · Краснодар</p>
            <div className={styles.textBlock}>
              <h1 className={styles.title}>
                Шкалы приборов<br />
                на заказ для вашего<br />
                автомобиля
              </h1>
              <p className={styles.description}>
                Проектируем и изготавливаем индивидуальные шкалы, накладки и
                подсветку приборных панелей. Подбираем графику, цвет и детали
                под конкретную модель автомобиля.
              </p>
              <p className={styles.caption}>
                Работаем по всей России · отправка СДЭК
              </p>
            </div>
            <div className={styles.actions}>
              <Button href="#contact" variant="primary" size="sm" onClick={handleContactClick}>
                Обсудить свой проект
              </Button>
            </div>
          </div>

          <button
            className={styles.media}
            type="button"
            onClick={handleMediaClick}
            aria-label="Посмотреть примеры работ"
          >
            <Image
              src={defaultImageSrc}
              alt="Индивидуальная приборная панель Carmanof"
              fill
              priority
              fetchPriority="high"
              sizes={HERO_IMAGE_SIZES}
              className={styles.imageElement}
            />
            <span className={styles.mediaHint}>Смотреть работы ↓</span>
          </button>
        </div>
      </Container>
    </section>
  );
}
