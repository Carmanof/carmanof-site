import type { Metadata } from "next";
import { cookies } from "next/headers";
import localFont from "next/font/local";
import "./globals.scss";
import Header from "@/components/Header/Header";
import Intro from "@/components/Intro/Intro";

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
  title: "CDU",
  description: "CDU website",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Читаем cookie на сервере.
  // Если cookie есть, интро не рендерим вообще — без вспышек и без гидрационных конфликтов.
  const cookieStore = await cookies();
  const introPlayed = cookieStore.get("intro-played")?.value === "1";

  return (
    <html lang="ru">
      <body className={manrope.variable}>
        <Intro enabled={!introPlayed} />
        <Header />
        {children}
      </body>
    </html>
  );
}
