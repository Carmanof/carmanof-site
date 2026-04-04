"use client";

import { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";

type ConsentState = "accepted" | "declined" | null;

const STORAGE_KEY = "carmanof_cookie_consent";

declare global {
  interface Window {
    ym?: (counterId: number, method: string, ...args: unknown[]) => void;
  }
}

function readConsent(): ConsentState {
  if (typeof window === "undefined") return null;

  const savedValue = window.localStorage.getItem(STORAGE_KEY);

  return savedValue === "accepted" || savedValue === "declined"
    ? savedValue
    : null;
}

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [consent, setConsent] = useState<ConsentState>(null);

  const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim() || "";
  const metricaIdRaw = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID?.trim() || "";

  const metricaId = useMemo(() => {
    const parsed = Number(metricaIdRaw);
    return Number.isFinite(parsed) ? parsed : null;
  }, [metricaIdRaw]);

  const isAnalyticsAllowed = consent === "accepted";

  const currentUrl = useMemo(() => {
    const query = searchParams?.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    setConsent(readConsent());

    function handleConsentChange(event: Event) {
      const customEvent = event as CustomEvent<ConsentState>;
      setConsent(customEvent.detail);
    }

    window.addEventListener("cookie-consent-change", handleConsentChange);

    return () => {
      window.removeEventListener("cookie-consent-change", handleConsentChange);
    };
  }, []);

  useEffect(() => {
    if (!isAnalyticsAllowed || !metricaId || typeof window === "undefined") {
      return;
    }

    let attempts = 0;
    let timeoutId: number | null = null;

    const sendHit = () => {
      if (typeof window.ym === "function") {
        window.ym(metricaId, "hit", currentUrl);
        return;
      }

      attempts += 1;

      if (attempts < 10) {
        timeoutId = window.setTimeout(sendHit, 150);
      }
    };

    sendHit();

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [currentUrl, isAnalyticsAllowed, metricaId]);

  return (
    <>
      {isAnalyticsAllowed && gaId ? <GoogleAnalytics gaId={gaId} /> : null}

      {isAnalyticsAllowed && metricaId ? (
        <>
          <Script id="yandex-metrica-init" strategy="afterInteractive">
            {`
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {
                  if (document.scripts[j].src === r) return;
                }
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],
                k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
              })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(${metricaId}, "init", {
                defer: true,
                clickmap: true,
                trackLinks: true,
                accurateTrackBounce: true,
                webvisor: true
              });
            `}
          </Script>

          <noscript>
            <div>
              <img
                src={`https://mc.yandex.ru/watch/${metricaId}`}
                style={{ position: "absolute", left: "-9999px" }}
                alt=""
              />
            </div>
          </noscript>
        </>
      ) : null}
    </>
  );
}
