"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header/Header";
import Intro from "@/components/Intro/Intro";

type LayoutChromeProps = {
  children: React.ReactNode;
};

export default function LayoutChrome({ children }: LayoutChromeProps) {
  const pathname = usePathname() || "/";

  const isStudioPage = pathname.startsWith("/studio");
  const isHomePage = pathname === "/";

  if (isStudioPage) {
    return <>{children}</>;
  }

  return (
    <>
      {isHomePage ? <Intro /> : null}
      <Header />
      {children}
    </>
  );
}
