"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import Container from "@/components/ui/Container/Container";
import Button from "@/components/ui/Button/Button";
import BackToFlow from "@/components/ui/BackToFlow/BackToFlow";
import styles from "./video.module.scss";

type VideoCaseItem = {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  youtubeId: string;
  order?: number;
  isFeatured?: boolean;
};

type VideoCasesClientProps = {
  videoCases: VideoCaseItem[];
};

const INITIAL_VISIBLE_COUNT = 6;
const LOAD_MORE_STEP = 6;

function getYoutubeThumbnail(youtubeId: string) {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}

export default function VideoCasesClient({
  videoCases,
}: VideoCasesClientProps) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const visibleVideos = useMemo(() => {
    return videoCases.slice(0, visibleCount);
  }, [videoCases, visibleCount]);

  const hasVideos = videoCases.length > 0;
  const hasMoreVideos = visibleCount < videoCases.length;

  function handleShowMore() {
    setVisibleCount((prev) =>
      Math.min(prev + LOAD_MORE_STEP, videoCases.length),
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.section}>
        <Container>
          <div className={styles.inner}>
            <BackToFlow href="/#cases" />

            <div className={styles.topbar}>
              <Link href="/cases" className={styles.backLink}>
                <span aria-hidden="true">←</span>
                <span>К кейсам</span>
              </Link>
            </div>

            <div className={styles.hero}>
              <h1 className={styles.title}>Видео примеры работ</h1>

              <p className={styles.description}>
                Подборка видео-кейсов, где можно посмотреть наши работы ближе:
                процесс, детали и итоговый результат.
              </p>
            </div>

            {hasVideos ? (
              <>
                <div className={styles.grid}>
                  {visibleVideos.map((item, index) => {
                    const itemId =
                      item._id || item.id || `${item.youtubeId}-${index}`;
                    const isActive = activeVideoId === itemId;

                    return (
                      <article key={itemId} className={styles.card}>
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
                            type="button"
                            className={styles.previewButton}
                            onClick={() => setActiveVideoId(itemId)}
                            aria-label={`Открыть видео: ${item.title}`}
                          >
                            <div className={styles.media}>
                              <Image
                                src={getYoutubeThumbnail(item.youtubeId)}
                                alt={item.title}
                                fill
                                unoptimized
                                className={styles.image}
                              />
                            </div>

                            <span className={styles.overlay} />
                            <span className={styles.glow} />

                            <span className={styles.playWrapper}>
                              <Image
                                src="/icons/video-case-block/play.svg"
                                alt=""
                                width={96}
                                height={96}
                                className={styles.playIcon}
                              />
                            </span>

                            <span className={styles.cardTitle}>
                              {item.title}
                            </span>
                          </button>
                        )}
                      </article>
                    );
                  })}
                </div>

                {hasMoreVideos && (
                  <div className={styles.actions}>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleShowMore}
                    >
                      Показать ещё
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.emptyState}>
                <p className={styles.emptyText}>
                  Видео-кейсы временно недоступны.
                </p>

                <div className={styles.emptyActions}>
                  <BackToFlow />
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>
    </main>
  );
}
