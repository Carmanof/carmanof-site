import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";

import LayoutChrome from "@/components/LayoutChrome/LayoutChrome";
import DeferredScripts from "@/components/DeferredScripts";
import { SEO_CONFIG } from "@/config/seo";
import "./globals.scss";

// ===== Fonts =====
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

// ===== Metadata (SEO only) =====
const siteUrl = SEO_CONFIG.siteUrl;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  applicationName: SEO_CONFIG.siteName,

  title: {
    default: SEO_CONFIG.defaultTitle,
    template: SEO_CONFIG.titleTemplate,
  },

  description: SEO_CONFIG.description,

  alternates: {
    canonical: siteUrl,
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

  // ❗ themeColor УБРАН отсюда

  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.description,
    url: siteUrl,
    siteName: SEO_CONFIG.siteName,
    locale: SEO_CONFIG.locale,
    type: "website",
    images: [
      {
        url: `${siteUrl}${SEO_CONFIG.openGraphImage}`,
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
    images: [`${siteUrl}${SEO_CONFIG.openGraphImage}`],
  },

  formatDetection: {
    telephone: false,
  },
};

// ===== Viewport (UI / browser-level settings) =====
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

// ===== Layout =====
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
