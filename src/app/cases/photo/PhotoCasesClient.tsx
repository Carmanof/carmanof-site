"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import Container from "@/components/ui/Container/Container";
import Button from "@/components/ui/Button/Button";
import BackToFlow from "@/components/ui/BackToFlow/BackToFlow";
import styles from "./photo.module.scss";

type PhotoCaseItem = {
  _id: string;
  title: string;
  order?: number;
  image?: {
    alt?: string;
    asset?: {
      _id?: string;
      url?: string;
    };
  };
};

type PhotoCasesClientProps = {
  photoCases: PhotoCaseItem[];
};

const INITIAL_VISIBLE_COUNT = 6;
const LOAD_MORE_STEP = 6;

export default function PhotoCasesClient({
  photoCases,
}: PhotoCasesClientProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const visiblePhotos = useMemo(() => {
    return photoCases.slice(0, visibleCount);
  }, [photoCases, visibleCount]);

  const validVisiblePhotos = useMemo(() => {
    return visiblePhotos.filter((item) => item.image?.asset?.url);
  }, [visiblePhotos]);

  const hasPhotos = photoCases.length > 0;
  const hasValidVisiblePhotos = validVisiblePhotos.length > 0;
  const hasMorePhotos = visibleCount < photoCases.length;

  const activePhoto =
    activePhotoIndex !== null ? validVisiblePhotos[activePhotoIndex] : null;

  function handleShowMore() {
    setVisibleCount((prev) =>
      Math.min(prev + LOAD_MORE_STEP, photoCases.length),
    );
  }

  function handleOpenPhoto(index: number) {
    setActivePhotoIndex(index);
  }

  function handleCloseLightbox() {
    setActivePhotoIndex(null);
  }

  const handlePrevPhoto = useCallback(() => {
    setActivePhotoIndex((prev) => {
      if (prev === null || validVisiblePhotos.length === 0) return null;
      return prev === 0 ? validVisiblePhotos.length - 1 : prev - 1;
    });
  }, [validVisiblePhotos.length]);

  const handleNextPhoto = useCallback(() => {
    setActivePhotoIndex((prev) => {
      if (prev === null || validVisiblePhotos.length === 0) return null;
      return prev === validVisiblePhotos.length - 1 ? 0 : prev + 1;
    });
  }, [validVisiblePhotos.length]);

  useEffect(() => {
    if (activePhotoIndex === null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActivePhotoIndex(null);
      }

      if (event.key === "ArrowLeft") {
        handlePrevPhoto();
      }

      if (event.key === "ArrowRight") {
        handleNextPhoto();
      }
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePhotoIndex, handleNextPhoto, handlePrevPhoto]);

  return (
    <main className={styles.page}>
      <section className={styles.section}>
        <Container>
          <div className={styles.inner}>
            <BackToFlow />

            <div className={styles.topbar}>
              <Link href="/cases" className={styles.backLink}>
                <span aria-hidden="true">←</span>
                <span>К кейсам</span>
              </Link>
            </div>

            <div className={styles.hero}>
              <h1 className={styles.title}>Фото примеры работ</h1>

              <p className={styles.description}>
                Подборка фото-кейсов, где можно быстро оценить уровень,
                аккуратность и итоговый результат выполненных работ.
              </p>
            </div>

            {hasPhotos && hasValidVisiblePhotos ? (
              <>
                <div className={styles.grid}>
                  {validVisiblePhotos.map((item, index) => {
                    const imageUrl = item.image?.asset?.url;

                    if (!imageUrl) {
                      return null;
                    }

                    return (
                      <article key={item._id} className={styles.card}>
                        <button
                          type="button"
                          className={styles.cardButton}
                          onClick={() => handleOpenPhoto(index)}
                          aria-label={`Открыть фото: ${item.title}`}
                        >
                          <div className={styles.media}>
                            <Image
                              src={imageUrl}
                              alt={item.image?.alt || item.title}
                              fill
                              className={styles.image}
                              sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw"
                            />
                          </div>

                          <span className={styles.overlay} />
                          <span className={styles.glow} />

                          <span className={styles.arrow} aria-hidden="true">
                            ↗
                          </span>

                          <span className={styles.cardTitle}>{item.title}</span>
                        </button>
                      </article>
                    );
                  })}
                </div>

                {hasMorePhotos ? (
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
                ) : null}
              </>
            ) : (
              <div className={styles.emptyState}>
                <p className={styles.emptyText}>
                  Фото-кейсы временно недоступны.
                </p>

                <div className={styles.emptyActions}>
                  <BackToFlow href="/#other-works" />
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>

      {activePhoto && activePhoto.image?.asset?.url ? (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.title}
          onClick={handleCloseLightbox}
        >
          <div
            className={styles.lightboxContent}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className={`${styles.lightboxControl} ${styles.closeButton}`}
              onClick={handleCloseLightbox}
              aria-label="Закрыть фото"
            >
              ✕
            </button>

            <button
              type="button"
              className={`${styles.lightboxControl} ${styles.prevButton}`}
              onClick={handlePrevPhoto}
              aria-label="Предыдущее фото"
            >
              ←
            </button>

            <div className={styles.lightboxImageWrap}>
              <Image
                src={activePhoto.image.asset.url}
                alt={activePhoto.image.alt || activePhoto.title}
                fill
                className={styles.lightboxImage}
                sizes="100vw"
                priority
              />
            </div>

            <button
              type="button"
              className={`${styles.lightboxControl} ${styles.nextButton}`}
              onClick={handleNextPhoto}
              aria-label="Следующее фото"
            >
              →
            </button>

            <div className={styles.lightboxCaption}>{activePhoto.title}</div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
