import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container/Container";
import styles from "./cases.module.scss";

export const metadata: Metadata = {
  title: "Примеры наших работ | Carmanof",
  description:
    "Видео и фото примеры выполненных работ Carmanof. Выберите удобный формат просмотра кейсов.",
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
  },
  {
    href: "/cases/photo",
    ariaLabel: "Перейти к фото кейсам",
    previewType: "photo" as const,
    imageSrc: PHOTO_PREVIEW_SRC,
  },
];

export default function CasesPage() {
  return (
    <main className={styles.page}>
      <section className={styles.section}>
        <Container>
          <div className={styles.inner}>
            <div className={styles.hero}>
              <Link
                href="/#other-works"
                aria-label="Вернуться на главную к блоку Другие работы"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 14,
                  fontSize: 14,
                  lineHeight: 1.2,
                  fontWeight: 600,
                  color: "rgba(0, 0, 0, 0.56)",
                  textDecoration: "none",
                  transition: "opacity 0.2s ease, transform 0.2s ease",
                }}
              >
                ← Назад
              </Link>

              <h1 className={styles.title}>Примеры наших работ</h1>
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
                    />
                  </div>

                  <span className={styles.overlay} />
                  <span className={styles.glow} />

                  {item.previewType === "video" && (
                    <span className={styles.playWrapper}>
                      <Image
                        src="/icons/video-case-block/play.svg"
                        alt=""
                        width={96}
                        height={96}
                        className={styles.playIcon}
                      />
                    </span>
                  )}

                  <span className={styles.arrow}>↗</span>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
