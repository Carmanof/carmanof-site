"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import styles from "./MoreExamplesBlock.module.scss";

type MoreExamplesImage = {
  src: string;
  alt: string;
};

type MoreExamplesBlockProps = {
  /**
   * 5 изображений для блока:
   * - 2 сверху
   * - 3 снизу
   *
   * Если по какой-то причине массив придет неполным,
   * ниже используем безопасный fallback.
   */
  images?: MoreExamplesImage[];
};

/**
 * Локальный fallback на случай,
 * если props не пришли или массив оказался неполным.
 */
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

/**
 * Подсказки браузеру по реальным размерам карточек.
 *
 * Почему такие значения:
 * - на desktop верхние карточки примерно ~588px шириной
 * - на desktop нижние карточки примерно ~389px шириной
 * - на tablet верх идет в 1 колонку, низ в 2 колонки
 * - на mobile все карточки становятся в одну колонку
 *
 * Это точнее, чем абстрактные 50vw / 33vw,
 * поэтому браузер будет подбирать более подходящий размер изображения.
 */
const topImageSizes =
  "(max-width: 640px) calc(100vw - 44px), (max-width: 991px) calc(100vw - 52px), 588px";

const bottomImageSizes =
  "(max-width: 640px) calc(100vw - 44px), (max-width: 991px) calc((100vw - 58px) / 2), 389px";

/* Фотоблок: 2 карточки сверху и 3 снизу */
const MoreExamplesBlock = ({
  images = fallbackImages,
}: MoreExamplesBlockProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  /**
   * Подстраховка:
   * даже если снаружи передали не все 5 изображений,
   * блок все равно останется рабочим и заполнит недостающие позиции fallback-картинками.
   */
  const normalizedImages = useMemo(() => {
    return fallbackImages.map((fallbackImage, index) => ({
      src: images[index]?.src || fallbackImage.src,
      alt: images[index]?.alt || fallbackImage.alt,
    }));
  }, [images]);

  /* Верхний ряд галереи: 2 крупные карточки */
  const topImages = useMemo(
    () => normalizedImages.slice(0, 2),
    [normalizedImages],
  );

  /* Нижний ряд галереи: 3 карточки */
  const bottomImages = useMemo(
    () => normalizedImages.slice(2, 5),
    [normalizedImages],
  );

  /* Собираем все изображения в один массив для модалки */
  const allImages = useMemo(() => normalizedImages, [normalizedImages]);

  useEffect(() => {
    /* Закрытие по клавише Esc */
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
      <section className={styles.section}>
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
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

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
