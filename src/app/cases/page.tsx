import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer/Footer";
import styles from "./cases.module.scss";

export const metadata: Metadata = {
  title: "Примеры работ",
  description:
    "Видео и фото примеры выполненных работ Carmanof. Выберите удобный формат просмотра кейсов.",
  alternates: {
    canonical: "/cases",
  },
  openGraph: {
    title: "Примеры наших работ | Carmanof",
    description:
      "Видео и фото примеры выполненных работ Carmanof. Выберите удобный формат просмотра кейсов.",
    type: "website",
    locale: "ru_RU",
    url: "/cases",
  },
  twitter: {
    card: "summary",
    title: "Примеры наших работ | Carmanof",
    description:
      "Видео и фото примеры выполненных работ Carmanof. Выберите удобный формат просмотра кейсов.",
  },
};

const VIDEO_PREVIEW_YOUTUBE_ID = "ANEqU44lHDI";
const PHOTO_PREVIEW_SRC = "/images/cases/photo-preview.webp";

function getYoutubeThumbnail(youtubeId: string) {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}

const caseDirections = [
  {
    href: "/cases/video",
    ariaLabel: "Перейти к видео кейсам",
    previewType: "video" as const,
    imageSrc: getYoutubeThumbnail(VIDEO_PREVIEW_YOUTUBE_ID),
    label: "Видео работ",
  },
  {
    href: "/cases/photo",
    ariaLabel: "Перейти к фото кейсам",
    previewType: "photo" as const,
    imageSrc: PHOTO_PREVIEW_SRC,
    label: "Фотографии работ",
  },
];

export default function CasesPage() {
  return (
    <><main className={styles.page}>
      <section className={styles.section}>
          <div className={styles.inner}>
            <div className={styles.hero}>
              <p className={styles.kicker}>Портфолио Carmanof</p>
              <h1 className={styles.title}>Работы, которые лучше увидеть</h1>
              <p className={styles.description}>Смотрите готовые приборные панели в фото и видео — детали подсветки, графику шкал и итоговый вид после сборки.</p>
            </div>

            <div className={styles.grid}>
              {caseDirections.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={styles.card}
                  aria-label={item.ariaLabel}
                >
                  <div className={styles.media}>
                    <Image
                      src={item.imageSrc}
                      alt=""
                      fill
                      unoptimized={item.previewType === "video"}
                      className={styles.image}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>

                  <span className={styles.overlay} />
                  <span className={styles.glow} />

                  {item.previewType === "video" ? (
                    <span className={styles.playWrapper}>
                      <Image
                        src="/icons/video-case-block/play.svg"
                        alt=""
                        width={96}
                        height={96}
                        className={styles.playIcon}
                      />
                    </span>
                  ) : null}

                  <span className={styles.arrow}>↗</span>
                  <span className={styles.label}>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
      </section>
    </main><Footer /></>
  );
}
