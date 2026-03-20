"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Intro.module.scss";

type IntroStage = "visible" | "moving" | "fading" | "hidden";

type IntroProps = {
  // enabled приходит с сервера из layout.tsx.
  // Это главный анти-баг: сервер и клиент сразу согласованы,
  // поэтому нет hydration mismatch.
  enabled: boolean;
};

export default function Intro({ enabled }: IntroProps) {
  // Если интро не нужно показывать — компонент вообще не рендерим.
  const [shouldRender, setShouldRender] = useState(enabled);

  // Начальная стадия зависит только от пропса, пришедшего с сервера.
  const [stage, setStage] = useState<IntroStage>(
    enabled ? "visible" : "hidden",
  );

  const [transformValue, setTransformValue] = useState(
    "translate(-50%, -50%) translate3d(0px, 0px, 0px) scale(1)",
  );

  const logoRef = useRef<HTMLDivElement | null>(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    document.body.classList.add("intro-lock");

    // ===== НАСТРОЙКА: пауза перед стартом полёта =====
    // Если хочешь подержать логотип дольше в центре — увеличь значение.
    const startTimer = window.setTimeout(() => {
      runAnimation();
    }, 650);

    return () => {
      document.body.classList.remove("intro-lock");
      window.clearTimeout(startTimer);
    };
  }, [enabled]);

  function runAnimation() {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const logo = logoRef.current;
    const target = document.getElementById("header-logo");

    // Если цель в хедере не найдена, завершаем аккуратно.
    if (!logo || !target) {
      finishIntro();
      return;
    }

    const logoRect = logo.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const logoCenterX = logoRect.left + logoRect.width / 2;
    const logoCenterY = logoRect.top + logoRect.height / 2;

    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;

    const deltaX = targetCenterX - logoCenterX;
    const deltaY = targetCenterY - logoCenterY;

    // ===== НАСТРОЙКА: конечный scale =====
    // Чем меньше число, тем сильнее логотип схлопывается в финале.
    setTransformValue(
      `translate(-50%, -50%) translate3d(${deltaX}px, ${deltaY}px, 0) scale(0.05)`,
    );

    requestAnimationFrame(() => {
      setStage("moving");
    });
  }

  function handleLogoTransitionEnd(
    event: React.TransitionEvent<HTMLDivElement>,
  ) {
    if (event.propertyName !== "transform") return;
    if (stage !== "moving") return;

    setStage("fading");
  }

  function handleOverlayTransitionEnd(
    event: React.TransitionEvent<HTMLDivElement>,
  ) {
    if (event.propertyName !== "opacity") return;
    if (stage !== "fading") return;

    finishIntro();
  }

  function finishIntro() {
    // Ставим session cookie:
    // без expires/max-age это cookie живёт до закрытия браузера.
    document.cookie = "intro-played=1; path=/; SameSite=Lax";

    document.body.classList.remove("intro-lock");
    setStage("hidden");
    setShouldRender(false);
  }

  if (!shouldRender) {
    return null;
  }

  const overlayClassName = [
    styles.overlay,
    stage === "visible" ? styles.overlayVisible : "",
    stage === "moving" ? styles.overlayVisible : "",
    stage === "fading" ? styles.overlayFading : "",
  ]
    .filter(Boolean)
    .join(" ");

  const logoClassName = [
    styles.logoWrap,
    stage === "moving" ? styles.logoMoving : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={overlayClassName}
      aria-hidden="true"
      onTransitionEnd={handleOverlayTransitionEnd}
    >
      <div
        ref={logoRef}
        className={logoClassName}
        style={stage === "moving" ? { transform: transformValue } : undefined}
        onTransitionEnd={handleLogoTransitionEnd}
      >
        <Image
          src="/images/Intro/Logo-white.svg"
          alt=""
          width={320}
          height={118}
          priority
          className={styles.logo}
        />
      </div>
    </div>
  );
}
