"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Hero.module.scss";
import Container from "@/components/ui/Container/Container";
import Button from "@/components/ui/Button/Button";

type IntroPhase = "idle" | "animating" | "done";

type HeroProps = {
  /**
   * Картинка Hero для обычного состояния ("до").
   * Если из Sanity ничего не пришло — используем локальный fallback.
   */
  defaultImageSrc?: string;

  /**
   * Картинка Hero для второго состояния ("после").
   * Если из Sanity ничего не пришло — используем локальный fallback.
   */
  hoverImageSrc?: string;
};

export default function Hero({
  defaultImageSrc = "/images/hero/hero-default.webp",
  hoverImageSrc = "/images/hero/hero-hover.webp",
}: HeroProps) {
  const [introPhase, setIntroPhase] = useState<IntroPhase>("idle");
  const [isHovered, setIsHovered] = useState(false);
  const autoTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // Один раз запускаем стартовую анимацию после появления блока.
    autoTimerRef.current = window.setTimeout(() => {
      setIntroPhase("animating");
    }, 1200);

    return () => {
      if (autoTimerRef.current) {
        window.clearTimeout(autoTimerRef.current);
      }
    };
  }, []);

  function handleIntroTransitionEnd() {
    if (introPhase === "animating") {
      setIntroPhase("done");
    }
  }

  function handleMouseEnter() {
    // Пока курсор НАД блоком — показываем default-картинку.
    setIsHovered(true);
  }

  function handleMouseLeave() {
    // Как только курсор УШЕЛ — возвращаем обычное состояние.
    setIsHovered(false);
  }

  const mediaClassName = [
    styles.media,
    introPhase === "idle" ? styles.stateDefault : "",
    introPhase === "animating" ? styles.toHover : "",
    introPhase === "done" && isHovered ? styles.showDefaultOnHover : "",
    introPhase === "done" && !isHovered ? styles.showHoverIdle : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={styles.hero} id="home">
      <Container>
        <div className={styles.card}>
          <div className={styles.content}>
            <div className={styles.textBlock}>
              <h1 className={styles.title}>
                ПРОФЕССИОНАЛЬНЫЙ <br />
                ТЮНИНГ ПРИБОРНЫХ <br />
                ПАНЕЛЕЙ АВТО
              </h1>

              <p className={styles.description}>
                Кастомные шкалы, идеальная точность, <br />
                эксклюзивный дизайн
              </p>

              <p className={styles.caption}>
                Работаем по всей России — отправка СДЭК
              </p>
            </div>

            <div className={styles.actions}>
              <Button href="#contact" variant="primary" size="sm">
                Узнать подробнее
              </Button>

              <Button href="#cases" variant="secondary" size="sm">
                Смотреть работы
              </Button>
            </div>
          </div>

          <div
            className={mediaClassName}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={styles.imageBase}
              style={{ backgroundImage: `url("${defaultImageSrc}")` }}
            />

            <div
              className={styles.imageHover}
              style={{ backgroundImage: `url("${hoverImageSrc}")` }}
              onTransitionEnd={handleIntroTransitionEnd}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
