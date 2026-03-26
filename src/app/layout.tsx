import type { Metadata } from "next";
import localFont from "next/font/local";

import LayoutChrome from "@/components/LayoutChrome/LayoutChrome";
import "./globals.scss";

const manrope = localFont({
  src: [
    {
      path: "./fonts/Manrope-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Manrope-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Manrope-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Manrope-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Manrope-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Manrope-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: {
    default: "Carmanof",
    template: "%s | Carmanof",
  },
  description:
    "Ремонт, восстановление и доработка приборных панелей. Примеры работ, подход и удобный способ связи.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /**
   * Больше не читаем cookies() в корневом layout.
   * Это уменьшает связанность layout с request-based данными
   * и делает корневую обертку чище для общей стратегии кэша.
   *
   * Логика показа интро теперь может решаться на клиенте внутри Intro.
   */
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={manrope.variable}>
        <LayoutChrome>{children}</LayoutChrome>
      </body>
    </html>
  );
}
