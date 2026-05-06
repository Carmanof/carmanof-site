"use client";

import dynamic from "next/dynamic";

const Analytics = dynamic(() => import("@/components/Analytics/Analytics"), {
  ssr: false,
});

const CookieConsent = dynamic(
  () => import("@/components/CookieConsent/CookieConsent"),
  { ssr: false },
);

export default function DeferredScripts() {
  return (
    <>
      <Analytics />
      <CookieConsent />
    </>
  );
}
