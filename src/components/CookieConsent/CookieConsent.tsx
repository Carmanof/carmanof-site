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
    setConsent(readConsent());
    setIsReady(true);
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
        maxWidth: 720,
        margin: "0 auto",
        padding: "16px",
        borderRadius: 20,
        border: "1px solid rgba(0, 0, 0, 0.08)",
        background: "rgba(255, 255, 255, 0.96)",
        boxShadow: "0 16px 40px rgba(0, 0, 0, 0.12)",
        backdropFilter: "blur(12px)",
      }}
    >
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "#1b252b" }}>
        Мы используем cookie для корректной работы сайта и анализа посещаемости.
        Продолжая использовать сайт, вы соглашаетесь с применением cookie в
        соответствии с{" "}
        <a
          href="/privacy"
          style={{
            color: "#1b252b",
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
            borderRadius: 999,
            border: "1px solid transparent",
            background: "#27aae1",
            color: "#fff",
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
            borderRadius: 999,
            border: "1px solid rgba(0, 0, 0, 0.1)",
            background: "#fff",
            color: "#1b252b",
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
