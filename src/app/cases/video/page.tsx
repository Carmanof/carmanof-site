import type { Metadata } from "next";
import VideoCasesClient from "./VideoCasesClient";
import { getVideoCases } from "@/sanity/lib/fetchers";

export const metadata: Metadata = {
  title: "Видео примеры работ",
  description:
    "Видео кейсы Carmanof: примеры работ с приборными панелями, процесс и итоговый результат.",
  alternates: {
    canonical: "/cases/video",
  },
  openGraph: {
    title: "Видео примеры работ | Carmanof",
    description:
      "Видео кейсы Carmanof: примеры работ с приборными панелями, процесс и итоговый результат.",
    type: "website",
    locale: "ru_RU",
    url: "/cases/video",
  },
  twitter: {
    card: "summary",
    title: "Видео примеры работ | Carmanof",
    description:
      "Видео кейсы Carmanof: примеры работ с приборными панелями, процесс и итоговый результат.",
  },
};

export default async function VideoCasesPage() {
  /**
   * getVideoCases() использует безопасный fetch-слой
   * и при ошибке уже возвращает fallback-массив.
   */
  const videoCases = await getVideoCases();

  return <VideoCasesClient videoCases={videoCases} />;
}
