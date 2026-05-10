"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Intro.module.scss";

type IntroProps = {
  enabled?: boolean;
};

/**
 * =========================
 * НАСТРОЙКИ АНИМАЦИИ
 * =========================
 */

// задержка перед стартом интро (после монтирования)
const INTRO_START_DELAY_MS = 500;

// длительность основной анимации (зум + уход)
const INTRO_DURATION_MS = 1800;

const INTRO_VERSION = "v2.1-debug";

function hasPlayedIntroInSession() {
  if (typeof document === "undefined") return true;

  return document.cookie
    .split("; ")
    .some((item) => item.startsWith("intro-played=1"));
}

/**
 * Минимальные ограничения для показа интро
 * (без device-логики — только UX safety)
 */
function canUseIntro() {
  if (typeof window === "undefined") return false;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  return !reducedMotion;
}

export default function Intro({ enabled }: IntroProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const startTimerRef = useRef<number | null>(null);
  const endTimerRef = useRef<number | null>(null);

  /**
   * =========================
   * DEBUG HOOK (НЕ ВЛИЯЕТ НА UI)
   * =========================
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    console.log("[INTRO]", INTRO_VERSION, "ACTIVE");

    document.documentElement.setAttribute("intro-version", INTRO_VERSION);
  }, []);

  useEffect(() => {
    const allowed = canUseIntro();
    const alreadyPlayed = hasPlayedIntroInSession();

    const shouldShow =
      typeof enabled !== "boolean"
        ? allowed && !alreadyPlayed
        : enabled && allowed && !alreadyPlayed;

    setShouldRender(shouldShow);
  }, [enabled]);

  useEffect(() => {
    if (!shouldRender) return;

    document.body.classList.add("intro-lock");

    startTimerRef.current = window.setTimeout(() => {
      setIsPlaying(true);

      endTimerRef.current = window.setTimeout(() => {
        finishIntro();
      }, INTRO_DURATION_MS);
    }, INTRO_START_DELAY_MS);

    return () => {
      document.body.classList.remove("intro-lock");

      if (startTimerRef.current) clearTimeout(startTimerRef.current);
      if (endTimerRef.current) clearTimeout(endTimerRef.current);
    };
  }, [shouldRender]);

  function finishIntro() {
    document.cookie = "intro-played=1; path=/; SameSite=Lax";
    document.body.classList.remove("intro-lock");
    setShouldRender(false);
  }

  if (!shouldRender) return null;

  /**
   * =========================
   * СТЕЙТЫ АНИМАЦИИ
   * =========================
   */

  const overlayClass = [
    styles.overlay,
    isPlaying ? styles.playing : styles.visible,
  ]
    .filter(Boolean)
    .join(" ");

  const logoClass = [styles.logoWrap, isPlaying ? styles.playingLogo : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={overlayClass} aria-hidden="true">
      <div className={logoClass}>
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
