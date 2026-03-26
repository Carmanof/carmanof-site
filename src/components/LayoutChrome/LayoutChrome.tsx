"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header/Header";
import Intro from "@/components/Intro/Intro";

type LayoutChromeProps = {
  children: React.ReactNode;
};

export default function LayoutChrome({ children }: LayoutChromeProps) {
  const pathname = usePathname() || "/";

  // Studio полностью изолирован
  const isStudioPage = pathname.startsWith("/studio");

  // Главная страница
  const isHomePage = pathname === "/";

  if (isStudioPage) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Intro только на главной.
          enabled больше не передаем:
          компонент сам проверит cookie на клиенте и решит, нужно ли показываться. */}
      {isHomePage && <Intro />}

      <Header />

      {children}
    </>
  );
}
