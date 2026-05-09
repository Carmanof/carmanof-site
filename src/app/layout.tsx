import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";

import LayoutChrome from "@/components/LayoutChrome/LayoutChrome";
import DeferredScripts from "@/components/DeferredScripts";
import { SEO_CONFIG } from "@/config/seo";
import "./globals.scss";

// =========================
// Fonts (изолированные, без runtime логики)
// =========================
const manrope = localFont({
  src: [
    { path: "./fonts/Manrope-Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/Manrope-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Manrope-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Manrope-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/Manrope-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/Manrope-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
  display: "swap",
  variable: "--font-manrope",
});

// =========================
// SAFE SITE URL (единственный источник истины)
// =========================
const SITE_URL =
  typeof SEO_CONFIG.siteUrl === "string" &&
  SEO_CONFIG.siteUrl.startsWith("http")
    ? SEO_CONFIG.siteUrl
    : "http://localhost:3000";

// =========================
// SAFE URL builder (защита от broken OG)
// =========================
function toAbsoluteUrl(path?: string): string | undefined {
  if (!path) return undefined;

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

// =========================
// METADATA (строго статический слой)
// =========================
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  applicationName: SEO_CONFIG.siteName,

  title: {
    default: SEO_CONFIG.defaultTitle,
    template: SEO_CONFIG.titleTemplate,
  },

  description: SEO_CONFIG.description,

  alternates: {
    canonical: SITE_URL,
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-64x64.png", sizes: "64x64", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },

  manifest: "/manifest.json",

  // env-safe (не ломает билд при undefined)
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    yandex: process.env.YANDEX_VERIFICATION || undefined,
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.description,
    url: SITE_URL,
    siteName: SEO_CONFIG.siteName,
    locale: SEO_CONFIG.locale,
    type: "website",
    images: [
      {
        url: toAbsoluteUrl(SEO_CONFIG.openGraphImage) ?? "",
        width: 1200,
        height: 630,
        alt: SEO_CONFIG.siteName,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.description,
    images: [toAbsoluteUrl(SEO_CONFIG.openGraphImage) ?? ""],
  },

  formatDetection: {
    telephone: false,
  },
};

// =========================
// VIEWPORT (Next 16 requirement)
// =========================
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

// =========================
// ROOT LAYOUT
// =========================
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={manrope.variable}>
        <LayoutChrome>{children}</LayoutChrome>

        <Suspense fallback={null}>
          <DeferredScripts />
        </Suspense>
      </body>
    </html>
  );
}
