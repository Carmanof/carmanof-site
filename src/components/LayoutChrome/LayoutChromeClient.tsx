"use client";

import { usePathname } from "next/navigation";

import Header from "@/components/Header/Header";

type LayoutChromeClientProps = {
  children: React.ReactNode;
  phone?: string;
};

export default function LayoutChromeClient({
  children,
  phone,
}: LayoutChromeClientProps) {
  const pathname = usePathname() || "/";

  const isStudioPage = pathname.startsWith("/studio");

  // ❗ критично: студию не трогаем
  if (isStudioPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header phone={phone} />
      {children}
    </>
  );
}
