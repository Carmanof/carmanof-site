import type { Metadata, Viewport } from "next";

import LayoutChrome from "@/components/LayoutChrome/LayoutChrome";
import { SEO_CONFIG } from "@/config/seo";
import "./globals.scss";

// ===== Metadata =====
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

// ===== Viewport =====
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
      <body>
        <LayoutChrome>{children}</LayoutChrome>

        {/* Отложенные скрипты (не блокируют рендер) */}
        {/* DeferredScripts temporarily disabled */}
      </body>
    </html>
  );
}
