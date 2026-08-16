import type { Metadata } from "next";
import PhotoCasesClient from "./PhotoCasesClient";
import { getPhotoCases } from "@/sanity/lib/fetchers";

export const metadata: Metadata = {
  title: "Фото примеры работ",
  description:
    "Фото кейсы Carmanof: примеры выполненных работ с приборными панелями и визуальный результат.",
  alternates: {
    canonical: "/cases/photo",
  },
  openGraph: {
    title: "Фото примеры работ | Carmanof",
    description:
      "Фото кейсы Carmanof: примеры выполненных работ с приборными панелями и визуальный результат.",
    type: "website",
    locale: "ru_RU",
    url: "/cases/photo",
  },
  twitter: {
    card: "summary",
    title: "Фото примеры работ | Carmanof",
    description:
      "Фото кейсы Carmanof: примеры выполненных работ с приборными панелями и визуальный результат.",
  },
};

export default async function PhotoCasesPage() {
  /**
   * getPhotoCases() уже использует safeFetch
   * и возвращает [] при ошибке.
   */
  const photoCases = await getPhotoCases();

  return <PhotoCasesClient photoCases={photoCases} />;
}
