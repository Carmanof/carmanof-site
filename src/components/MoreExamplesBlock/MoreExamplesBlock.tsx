"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./MoreExamplesBlock.module.scss";

const images = [
  {
    src: "/images/more-examples/example-01.webp",
    alt: "Пример работы 1",
  },
  {
    src: "/images/more-examples/example-02.webp",
    alt: "Пример работы 2",
  },
  {
    src: "/images/more-examples/example-03.webp",
    alt: "Пример работы 3",
  },
  {
    src: "/images/more-examples/example-04.webp",
    alt: "Пример работы 4",
  },
  {
    src: "/images/more-examples/example-05.webp",
    alt: "Пример работы 5",
  },
];

export default function MoreExamplesBlock() {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const topImages = images.slice(0, 2);
  const bottomImages = images.slice(2, 5);

  const closeModal = () => setActiveImage(null);

  return (
    <>
      <section
        className={styles.section}
        aria-label="Дополнительные примеры работ"
      >
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.rowTop}>
              {topImages.map((image) => (
                <button
                  key={image.src}
                  type="button"
                  className={`${styles.card} ${styles.cardTop}`}
                  onClick={() => setActiveImage(image.src)}
                  aria-label={`Открыть ${image.alt}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 50vw"
                    className={styles.image}
                  />
                </button>
              ))}
            </div>

            <div className={styles.rowBottom}>
              {bottomImages.map((image) => (
                <button
                  key={image.src}
                  type="button"
                  className={`${styles.card} ${styles.cardBottom}`}
                  onClick={() => setActiveImage(image.src)}
                  aria-label={`Открыть ${image.alt}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1279px) 33vw, 33vw"
                    className={styles.image}
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
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр изображения"
        >
          <button
            type="button"
            className={styles.closeButton}
            onClick={closeModal}
            aria-label="Закрыть изображение"
          >
            ×
          </button>

          <div
            className={styles.modalContent}
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={activeImage}
              alt="Увеличенное изображение"
              fill
              sizes="100vw"
              className={styles.modalImage}
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
