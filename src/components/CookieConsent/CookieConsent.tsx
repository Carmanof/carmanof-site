"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "carmanof_cookie_consent";

type ConsentState = "accepted" | "declined" | null;

function readConsent(): ConsentState {
  if (typeof window === "undefined") return null;

  const savedValue = window.localStorage.getItem(STORAGE_KEY);

  return savedValue === "accepted" || savedValue === "declined"
    ? savedValue
    : null;
}

export default function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setConsent(readConsent());
      setIsReady(true);
    });
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  function updateConsent(nextValue: Exclude<ConsentState, null>) {
    window.localStorage.setItem(STORAGE_KEY, nextValue);
    setConsent(nextValue);

    window.dispatchEvent(
      new CustomEvent("cookie-consent-change", {
        detail: nextValue,
      }),
    );
  }

  function handleAccept() {
    updateConsent("accepted");
  }

  function handleDecline() {
    updateConsent("declined");
  }

  if (!isReady || consent !== null) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Согласие на использование cookie"
      style={{
        position: "fixed",
        left: 16,
        right: 16,
        bottom: 16,
        zIndex: 200,
        maxWidth: 760,
        margin: "0 auto",
        padding: "16px",
        borderRadius: 12,
        border: "1px solid rgba(255, 255, 255, 0.12)",
        background: "rgba(8, 10, 13, 0.94)",
        boxShadow: "0 18px 55px rgba(0, 0, 0, 0.34)",
        backdropFilter: "blur(12px)",
      }}
    >
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,.68)" }}>
        Мы используем cookie для корректной работы сайта и анализа посещаемости.
        Продолжая использовать сайт, вы соглашаетесь с применением cookie в
        соответствии с{" "}
        <a
          href="/privacy"
          style={{
            color: "#fff",
            fontWeight: 600,
            textDecoration: "underline",
            textUnderlineOffset: 2,
          }}
        >
          Политикой конфиденциальности
        </a>
        .
      </p>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 12,
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={handleAccept}
          style={{
            height: 40,
            padding: "0 16px",
            borderRadius: 8,
            border: "1px solid transparent",
            background: "#2dd4df",
            color: "#08090b",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Принять
        </button>

        <button
          type="button"
          onClick={handleDecline}
          style={{
            height: 40,
            padding: "0 16px",
            borderRadius: 8,
            border: "1px solid rgba(255, 255, 255, 0.16)",
            background: "transparent",
            color: "#fff",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Не принимаю
        </button>
      </div>
    </div>
  );
}
