// app/layout.tsx

import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import LayoutChrome from "@/components/LayoutChrome/LayoutChrome";
import "./globals.scss";
import { SITE_URL } from "@/lib/site";

const manrope = localFont({
  src: [
    { path: "./fonts/Manrope-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Manrope-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Manrope-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/Manrope-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/Manrope-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  applicationName: "Carmanof",

  title: {
    default: "Шкалы приборов на заказ | Carmanof",
    template: "%s | Carmanof",
  },

  description:
    "Изготовление шкал приборов на заказ для автомобилей любых марок. Индивидуальный макет, пересвет и ремонт приборных панелей в Краснодаре с доставкой по всей России.",

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

  robots: process.env.VERCEL_ENV === "production" ? { index: true, follow: true } : { index: false, follow: false, noarchive: true },

  openGraph: {
    title: "Шкалы приборов на заказ | Carmanof",
    description: "Индивидуальные шкалы и тюнинг приборных панелей для автомобилей по всей России.",
    url: SITE_URL,
    siteName: "Carmanof",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-carmanof-v2-1200x630.png`,
        width: 1200,
        height: 630,
        alt: "Carmanof",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Шкалы приборов на заказ | Carmanof",
    description: "Индивидуальные шкалы и тюнинг приборных панелей для автомобилей по всей России.",
    images: [`${SITE_URL}/og-carmanof-v2-1200x630.png`],
  },

  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0d10",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteSchema = { "@context": "https://schema.org", "@type": "WebSite", name: "Carmanof", alternateName: "Карманоф", url: SITE_URL, inLanguage: "ru-RU" };
  const organizationSchema = { "@context": "https://schema.org", "@type": "Organization", name: "Carmanof", legalName: "ИП Карманов Алексей Олегович", url: SITE_URL, taxID: "590610034700", identifier: "ОГРНИП 323595800112271", sameAs: ["https://t.me/Carmanof_MANAGER", "https://vk.com/carmanof"] };
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={manrope.variable}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([websiteSchema, organizationSchema]) }} />
        <LayoutChrome>{children}</LayoutChrome>
      </body>
    </html>
  );
}
