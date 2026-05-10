"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Hero.module.scss";
import Container from "@/components/ui/Container/Container";
import Button from "@/components/ui/Button/Button";

type IntroPhase = "idle" | "animating" | "done";

type HeroProps = {
  defaultImageSrc?: string;
  hoverImageSrc?: string;
};

const HERO_IMAGE_SIZES =
  "(max-width: 640px) calc(100vw - 28px), (max-width: 1024px) calc(100vw - 64px), (max-width: 1240px) 480px, 520px";

export default function Hero({
  defaultImageSrc = "/images/hero/hero-default.webp",
  hoverImageSrc = "/images/hero/hero-hover.webp",
}: HeroProps) {
  const [introPhase, setIntroPhase] = useState<IntroPhase>("done");
  const [isHovered, setIsHovered] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);

  const introTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const canInteract =
      hoverQuery.matches &&
      !reducedMotionQuery.matches &&
      window.innerWidth > 1024;

    setIsInteractive(canInteract);

    // ВАЖНО: интро не зависит от интерактива
    setIntroPhase("idle");

    introTimerRef.current = window.setTimeout(() => {
      setIntroPhase("animating");
    }, 1200);

    return () => {
      if (introTimerRef.current) {
        window.clearTimeout(introTimerRef.current);
      }
    };
  }, []);

  const handleContactClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      event.preventDefault();

      const target = document.querySelector("#contact");
      if (!target) return;

      target.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [],
  );

  const handleMediaClick = useCallback(() => {
    const target = document.querySelector("#other-works");
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.pageYOffset - 172;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  }, []);

  function handleIntroTransitionEnd() {
    if (introPhase === "animating") {
      setIntroPhase("done");
    }
  }

  function handleMouseEnter() {
    if (!isInteractive) return;
    setIsHovered(true);
  }

  function handleMouseLeave() {
    if (!isInteractive) return;
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
                Мы создаем индивидуальные шкалы <br />
                для спидометров, тахометров и других <br />
                приборов на автомобили любых марок - <br />
                от отечественных до премиум-класса.
              </p>

              <p className={styles.caption}>
                Работаем по всей России — отправка СДЭК
              </p>
            </div>

            <div className={styles.actions}>
              <Button
                href="#contact"
                variant="primary"
                size="sm"
                onClick={handleContactClick}
              >
                Оставить заявку
              </Button>
            </div>
          </div>

          <div
            className={mediaClassName}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleMediaClick}
            role="button"
            tabIndex={0}
          >
            {/* BASE (до) — всегда есть */}
            <div className={styles.imageBase}>
              <Image
                src={defaultImageSrc}
                alt="Пример тюнинга приборной панели Carmanof"
                fill
                priority
                fetchPriority="high"
                sizes={HERO_IMAGE_SIZES}
                className={styles.imageElement}
              />
            </div>

            {/* HOVER (после) — всегда есть, но управление только классами */}
            <div
              className={styles.imageHover}
              onTransitionEnd={handleIntroTransitionEnd}
            >
              <Image
                src={hoverImageSrc}
                alt=""
                fill
                sizes={HERO_IMAGE_SIZES}
                className={styles.imageElement}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
