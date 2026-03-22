"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./VideoCaseBlock.module.scss";
import Container from "@/components/ui/Container/Container";
import Button from "@/components/ui/Button/Button";

type VideoTheme = "bmw" | "audi" | "mercedes";

type VideoCase = {
  id: string;
  title: string;
  youtubeId: string;
  theme: VideoTheme;
};

const videoCases: VideoCase[] = [
  {
    id: "bmw-e60",
    title: "BMW E60",
    youtubeId: "vBFih1j57ew",
    theme: "bmw",
  },
  {
    id: "audi-a4",
    title: "Audi A4",
    youtubeId: "pOmuehcL2UM",
    theme: "audi",
  },
  {
    id: "mercedes-w204",
    title: "Mercedes W204",
    youtubeId: "LWFM6YMeiPI",
    theme: "mercedes",
  },
];

export default function VideoCaseBlock() {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  return (
    <section id="cases" className={styles.section}>
      <Container>
        <div className={styles.wrapper}>
          <h2 className={styles.title}>Видео примеры работ</h2>

          <p className={styles.description}>
            Несколько примеров приборных панелей, с которыми мы уже работали.
          </p>

          <div className={styles.cards}>
            {videoCases.map((item) => {
              const isActive = activeVideoId === item.id;

              const previewThemeClass =
                item.theme === "bmw"
                  ? styles.themeBmw
                  : item.theme === "audi"
                    ? styles.themeAudi
                    : styles.themeMercedes;

              return (
                <article key={item.id} className={styles.card}>
                  {isActive ? (
                    <iframe
                      className={styles.iframe}
                      src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&rel=0`}
                      title={item.title}
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      className={`${styles.previewButton} ${previewThemeClass}`}
                      onClick={() => setActiveVideoId(item.id)}
                    >
                      <span className={styles.previewOverlay} />
                      <span className={styles.previewGlow} />
                      <span className={styles.previewArcLeft} />
                      <span className={styles.previewArcRight} />

                      <span className={styles.previewMeta}>
                        <span className={styles.previewMetaTop}>
                          CUSTOM DASH
                        </span>
                        <span className={styles.previewMetaBottom}>
                          {item.title}
                        </span>
                      </span>

                      <span className={styles.playButton}>
                        <Image
                          src="/icons/video-case-block/play.svg"
                          alt=""
                          width={96}
                          height={96}
                          className={styles.playIcon}
                        />
                      </span>
                    </button>
                  )}
                </article>
              );
            })}
          </div>

          <div className={styles.actions}>
            <Button variant="secondary" size="sm">
              Смотреть больше примеров
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
