"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Intro.module.scss";

type IntroStage = "visible" | "moving" | "fading" | "hidden";

type IntroProps = {
  /**
   * Текущий основной режим:
   * enabled приходит с сервера из layout.tsx.
   *
   * Дополнительно делаем проп опциональным,
   * чтобы в следующем шаге можно было безопасно перевести интро
   * на полностью клиентскую проверку cookie без резкой ломки API компонента.
   */
  enabled?: boolean;
};

/**
 * Читает флаг проигранного интро на клиенте.
 * Если cookie нет, значит интро можно показывать.
 */
function getClientIntroEnabled() {
  if (typeof document === "undefined") {
    return false;
  }

  return !document.cookie
    .split("; ")
    .some((item) => item.startsWith("intro-played=1"));
}

export default function Intro({ enabled }: IntroProps) {
  /**
   * Если enabled передан явно — используем его как источник истины.
   * Если не передан, пока ничего не рендерим до клиентской проверки.
   *
   * Это важно:
   * - не ломает текущую серверную схему;
   * - подготавливает компонент к будущему отказу от cookies() в layout.tsx;
   * - не создает hydration mismatch.
   */
  const [resolvedEnabled, setResolvedEnabled] = useState<boolean>(
    typeof enabled === "boolean" ? enabled : false,
  );

  // Если интро не нужно показывать — компонент вообще не рендерим.
  const [shouldRender, setShouldRender] = useState(
    typeof enabled === "boolean" ? enabled : false,
  );

  // Начальная стадия зависит от уже разрешенного флага.
  const [stage, setStage] = useState<IntroStage>(
    typeof enabled === "boolean" && enabled ? "visible" : "hidden",
  );

  const [transformValue, setTransformValue] = useState(
    "translate(-50%, -50%) translate3d(0px, 0px, 0px) scale(1)",
  );

  const logoRef = useRef<HTMLDivElement | null>(null);

  // Защита от повторного старта анимации.
  const hasStartedRef = useRef(false);

  // Защита от повторного завершения интро.
  const hasFinishedRef = useRef(false);

  // Храним id requestAnimationFrame, чтобы корректно чистить.
  const rafRef = useRef<number | null>(null);

  /**
   * Если enabled не пришел снаружи,
   * определяем необходимость показа уже на клиенте через cookie.
   *
   * Пока layout.tsx все еще передает enabled,
   * этот блок не изменит текущее рабочее поведение.
   */
  useEffect(() => {
    if (typeof enabled === "boolean") {
      return;
    }

    const clientEnabled = getClientIntroEnabled();
    setResolvedEnabled(clientEnabled);
    setShouldRender(clientEnabled);
    setStage(clientEnabled ? "visible" : "hidden");
  }, [enabled]);

  /**
   * Синхронизация с внешним enabled.
   * Это основной текущий режим работы компонента.
   */
  useEffect(() => {
    if (typeof enabled !== "boolean") {
      return;
    }

    setResolvedEnabled(enabled);

    if (enabled) {
      setShouldRender(true);
      setStage("visible");
      hasStartedRef.current = false;
      hasFinishedRef.current = false;
      setTransformValue(
        "translate(-50%, -50%) translate3d(0px, 0px, 0px) scale(1)",
      );
    } else {
      document.body.classList.remove("intro-lock");
      setStage("hidden");
      setShouldRender(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!resolvedEnabled) return;

    document.body.classList.add("intro-lock");

    // ===== НАСТРОЙКА: пауза перед стартом полёта =====
    // Если хочешь подержать логотип дольше в центре — увеличь значение.
    const startTimer = window.setTimeout(() => {
      runAnimation();
    }, 650);

    return () => {
      document.body.classList.remove("intro-lock");
      window.clearTimeout(startTimer);

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [resolvedEnabled]);

  function runAnimation() {
    if (hasStartedRef.current || hasFinishedRef.current) return;
    hasStartedRef.current = true;

    const logo = logoRef.current;
    const target = document.getElementById("header-logo");

    // Если цель в хедере не найдена, завершаем аккуратно,
    // чтобы интро не зависало поверх страницы.
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

    rafRef.current = window.requestAnimationFrame(() => {
      setStage("moving");
      rafRef.current = null;
    });
  }

  function handleLogoTransitionEnd(
    event: React.TransitionEvent<HTMLDivElement>,
  ) {
    if (event.propertyName !== "transform") return;
    if (stage !== "moving") return;
    if (hasFinishedRef.current) return;

    setStage("fading");
  }

  function handleOverlayTransitionEnd(
    event: React.TransitionEvent<HTMLDivElement>,
  ) {
    if (event.propertyName !== "opacity") return;
    if (stage !== "fading") return;
    if (hasFinishedRef.current) return;

    finishIntro();
  }

  function finishIntro() {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;

    // Ставим session cookie:
    // без expires/max-age это cookie живёт до закрытия браузера.
    document.cookie = "intro-played=1; path=/; SameSite=Lax";

    document.body.classList.remove("intro-lock");
    setStage("hidden");
    setShouldRender(false);
    setResolvedEnabled(false);
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
