"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Intro.module.scss";

type IntroStage = "visible" | "moving" | "fading" | "hidden";

type IntroProps = {
  /**
   * Если enabled передан явно, используем его как входной флаг.
   * Если не передан, решение о показе принимаем на клиенте.
   */
  enabled?: boolean;
};

function hasPlayedIntroInSession() {
  if (typeof document === "undefined") {
    return true;
  }

  return document.cookie
    .split("; ")
    .some((item) => item.startsWith("intro-played=1"));
}

/**
 * Интро показываем только там, где оно реально даёт UX-эффект:
 * - есть hover
 * - точный указатель
 * - нет reduced motion
 * - ширина больше мобильной/планшетной
 */
function canUseIntroAnimation() {
  if (typeof window === "undefined") {
    return false;
  }

  const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  return (
    hoverQuery.matches &&
    !reducedMotionQuery.matches &&
    window.innerWidth > 1024
  );
}

export default function Intro({ enabled }: IntroProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [stage, setStage] = useState<IntroStage>("hidden");
  const [transformValue, setTransformValue] = useState(
    "translate(-50%, -50%) translate3d(0px, 0px, 0px) scale(1)",
  );

  const logoRef = useRef<HTMLDivElement | null>(null);
  const hasStartedRef = useRef(false);
  const hasFinishedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const startTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const introAllowedByDevice = canUseIntroAnimation();
    const introAlreadyPlayed = hasPlayedIntroInSession();

    /**
     * Если enabled не передан, принимаем решение полностью на клиенте.
     */
    if (typeof enabled !== "boolean") {
      const shouldShow = introAllowedByDevice && !introAlreadyPlayed;

      setShouldRender(shouldShow);
      setStage(shouldShow ? "visible" : "hidden");
      return;
    }

    /**
     * Если enabled передан, он задаёт базовое поведение,
     * но mobile / touch / reduced-motion всё равно принудительно отключают интро.
     */
    const shouldShow = enabled && introAllowedByDevice && !introAlreadyPlayed;

    setShouldRender(shouldShow);
    setStage(shouldShow ? "visible" : "hidden");

    if (!shouldShow) {
      document.body.classList.remove("intro-lock");
    }
  }, [enabled]);

  useEffect(() => {
    if (!shouldRender || stage === "hidden") {
      return;
    }

    document.body.classList.add("intro-lock");

    /**
     * Оставляем комфортную паузу перед стартом —
     * примерно ту же, что у тебя была и визуально нравилась.
     */
    startTimerRef.current = window.setTimeout(() => {
      runAnimation();
    }, 650);

    return () => {
      document.body.classList.remove("intro-lock");

      if (startTimerRef.current !== null) {
        window.clearTimeout(startTimerRef.current);
        startTimerRef.current = null;
      }

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [shouldRender, stage]);

  function runAnimation() {
    if (hasStartedRef.current || hasFinishedRef.current) {
      return;
    }

    hasStartedRef.current = true;

    const logo = logoRef.current;
    const target = document.getElementById("header-logo");

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

    setTransformValue(
      `translate(-50%, -50%) translate3d(${deltaX}px, ${deltaY}px, 0) scale(0.05)`,
    );

    rafRef.current = window.requestAnimationFrame(() => {
      setStage("moving");
      rafRef.current = null;
    });
  }

  function handleLogoTransitionEnd(
    event: React.TransitionEvent<HTMLDivElement>,
  ) {
    if (event.propertyName !== "transform") {
      return;
    }

    if (stage !== "moving" || hasFinishedRef.current) {
      return;
    }

    setStage("fading");
  }

  function handleOverlayTransitionEnd(
    event: React.TransitionEvent<HTMLDivElement>,
  ) {
    if (event.propertyName !== "opacity") {
      return;
    }

    if (stage !== "fading" || hasFinishedRef.current) {
      return;
    }

    finishIntro();
  }

  function finishIntro() {
    if (hasFinishedRef.current) {
      return;
    }

    hasFinishedRef.current = true;

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
