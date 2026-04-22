"use client";

import { useState } from "react";
import Image from "next/image";

import Container from "@/components/ui/Container/Container";
import Button from "@/components/ui/Button/Button";
import Section from "@/components/ui/Section/Section";
import styles from "./VideoCaseBlock.module.scss";

type VideoCaseItem = {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  youtubeId: string;
  order?: number;
  isFeatured?: boolean;
};

type VideoCaseBlockProps = {
  videoCases: VideoCaseItem[];
};

const PREVIEW_TEXT_LIMIT = 42;

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

function getYoutubeThumbnail(youtubeId: string) {
  return `https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`;
}

function getYoutubeEmbedUrl(youtubeId: string) {
  const params = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });

  return `https://www.youtube-nocookie.com/embed/${youtubeId}?${params.toString()}`;
}

export default function VideoCaseBlock({ videoCases }: VideoCaseBlockProps) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const hasVideoCases = videoCases.length > 0;

  return (
    <Section
      id="cases"
      className={styles.anchorOffset}
      aria-labelledby="video-cases-title"
    >
      <Container>
        <div className={styles.wrapper}>
          <h2 id="video-cases-title" className={styles.title}>
            Наши работы
          </h2>

          <p className={styles.description}>
            Несколько примеров приборных панелей, с которыми мы уже работали.
          </p>

          <div className={styles.cards}>
            {hasVideoCases
              ? videoCases.map((item, index) => {
                  const itemId =
                    item._id || item.id || `${item.youtubeId}-${index}`;
                  const isActive = activeVideoId === itemId;

                  return (
                    <article key={itemId} className={styles.card}>
                      {isActive ? (
                        <iframe
                          className={styles.iframe}
                          src={getYoutubeEmbedUrl(item.youtubeId)}
                          title={item.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          referrerPolicy="strict-origin-when-cross-origin"
                        />
                      ) : (
                        <button
                          type="button"
                          className={styles.previewButton}
                          onClick={() => setActiveVideoId(itemId)}
                          aria-label={`Открыть видео: ${item.title}`}
                        >
                          <Image
                            src={getYoutubeThumbnail(item.youtubeId)}
                            alt={item.title}
                            fill
                            sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                            className={styles.previewImage}
                            loading="lazy"
                            fetchPriority="low"
                            decoding="async"
                          />

                          <span className={styles.previewOverlay} />
                          <span className={styles.previewGlow} />

                          <span className={styles.previewMeta}>
                            <span className={styles.previewMetaBottom}>
                              {truncateText(item.title, PREVIEW_TEXT_LIMIT)}
                            </span>
                          </span>

                          <span className={styles.playButton}>
                            <Image
                              src="/icons/video-case-block/play.svg"
                              alt=""
                              width={96}
                              height={96}
                              className={styles.playIcon}
                              aria-hidden="true"
                            />
                          </span>
                        </button>
                      )}
                    </article>
                  );
                })
              : Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className={`${styles.card} ${styles.cardSkeleton}`}
                  >
                    <div className={styles.skeletonMedia} />
                    <div className={styles.skeletonText} />
                  </div>
                ))}
          </div>

          <div className={styles.actions}>
            {hasVideoCases ? (
              <Button href="/cases/video" variant="secondary" size="sm">
                Смотреть больше примеров
              </Button>
            ) : (
              <span
                className={styles.actionsButtonDisabled}
                aria-disabled="true"
              >
                Смотреть больше примеров
              </span>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
