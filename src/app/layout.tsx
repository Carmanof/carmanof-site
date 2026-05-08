// app/layout.tsx

import type { Metadata, Viewport } from "next";
import LayoutChrome from "@/components/LayoutChrome/LayoutChrome";
import "./globals.scss";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  applicationName: "Carmanof",

  title: {
    default: "Carmanof",
    template: "%s | Carmanof",
  },

  description: "Carmanof",

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

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Carmanof",
    description: "Carmanof",
    url: SITE_URL,
    siteName: "Carmanof",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og.png`,
        width: 1200,
        height: 630,
        alt: "Carmanof",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Carmanof",
    description: "Carmanof",
    images: [`${SITE_URL}/og.png`],
  },

  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <LayoutChrome>{children}</LayoutChrome>
      </body>
    </html>
  );
}
