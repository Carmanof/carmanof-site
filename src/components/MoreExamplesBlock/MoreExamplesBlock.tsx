"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Section from "@/components/ui/Section/Section";
import styles from "./MoreExamplesBlock.module.scss";

type MoreExamplesImage = {
  src: string;
  alt: string;
};

type MoreExamplesBlockProps = {
  images?: MoreExamplesImage[];
};

const fallbackImages: MoreExamplesImage[] = [
  {
    src: "/images/more-examples/example-01-v2.webp",
    alt: "Пример работы 1",
  },
  {
    src: "/images/more-examples/example-02-v2.webp",
    alt: "Пример работы 2",
  },
  {
    src: "/images/more-examples/example-03-v2.webp",
    alt: "Пример работы 3",
  },
  {
    src: "/images/more-examples/example-04-v2.webp",
    alt: "Пример работы 4",
  },
  {
    src: "/images/more-examples/example-05-v2.webp",
    alt: "Пример работы 5",
  },
];

const topImageSizes =
  "(max-width: 640px) calc(100vw - 44px), (max-width: 991px) calc(100vw - 52px), 588px";

const bottomImageSizes =
  "(max-width: 640px) calc(100vw - 44px), (max-width: 991px) calc((100vw - 58px) / 2), 389px";

const MoreExamplesBlock = ({
  images = fallbackImages,
}: MoreExamplesBlockProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const normalizedImages = useMemo(() => {
    return fallbackImages.map((fallbackImage, index) => ({
      src: images[index]?.src || fallbackImage.src,
      alt: images[index]?.alt || fallbackImage.alt,
    }));
  }, [images]);

  const topImages = useMemo(
    () => normalizedImages.slice(0, 2),
    [normalizedImages],
  );

  const bottomImages = useMemo(
    () => normalizedImages.slice(2, 5),
    [normalizedImages],
  );

  const allImages = useMemo(() => normalizedImages, [normalizedImages]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }
    }

    if (activeIndex !== null) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIndex]);

  const activeImage = activeIndex !== null ? allImages[activeIndex] : null;

  return (
    <>
      <Section aria-label="Дополнительные примеры работ">
        <div className={styles.container}>
          <div className={styles.galleryShell}>
            <div className={styles.gridTop}>
              {topImages.map((image, index) => (
                <button
                  key={`${image.src}-${index}`}
                  type="button"
                  className={`${styles.card} ${styles.cardTop}`}
                  aria-label={image.alt}
                  onClick={() => setActiveIndex(index)}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className={styles.image}
                    sizes={topImageSizes}
                    priority={false}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>

            <div className={styles.gridBottom}>
              {bottomImages.map((image, index) => (
                <button
                  key={`${image.src}-${index + 2}`}
                  type="button"
                  className={`${styles.card} ${styles.cardBottom}`}
                  aria-label={image.alt}
                  onClick={() => setActiveIndex(topImages.length + index)}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className={styles.image}
                    sizes={bottomImageSizes}
                    priority={false}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {activeImage && (
        <div
          className={styles.modal}
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.alt}
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Закрыть изображение"
            onClick={() => setActiveIndex(null)}
          >
            ×
          </button>

          <div
            className={styles.modalContent}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.modalImageWrapper}>
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                className={styles.modalImage}
                sizes="100vw"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MoreExamplesBlock;
