"use client";

import Container from "@/components/ui/Container/Container";
import Button from "@/components/ui/Button/Button";
import Section from "@/components/ui/Section/Section";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";
import { getVideoAsset } from "@/data/videoAssets";
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

export default function VideoCaseBlock({ videoCases }: VideoCaseBlockProps) {
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
                  const asset = getVideoAsset(item.youtubeId);

                  return (
                    <article key={itemId} className={styles.card}>
                      {asset ? (
                        <VideoPlayer
                          className={styles.iframe}
                          src={asset.video}
                          poster={asset.poster}
                          title={item.title}
                          caption={truncateText(item.title, PREVIEW_TEXT_LIMIT)}
                        />
                      ) : (
                        <div className={styles.previewButton}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/images/more-examples/example-04-v2.webp"
                            alt={item.title}
                            loading="lazy"
                            decoding="async"
                            className={styles.previewImage}
                          />

                          <span className={styles.previewOverlay} />
                          <span className={styles.previewGlow} />

                          <span className={styles.previewMeta}>
                            <span className={styles.previewMetaBottom}>
                              {truncateText(item.title, PREVIEW_TEXT_LIMIT)}
                            </span>
                          </span>

                        </div>
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
