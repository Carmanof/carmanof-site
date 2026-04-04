import Image from "next/image";
import Section from "@/components/ui/Section/Section";
import styles from "./MainOffer.module.scss";
import Container from "@/components/ui/Container/Container";

export default function MainOffer() {
  return (
    <Section aria-labelledby="main-offer-title">
      <Container>
        <div className={styles.wrapper}>
          <div className={styles.content}>
            <div className={styles.textBlock}>
              <h2 id="main-offer-title" className={styles.title}>
                Изготовление накладок для шкалы приборов на заказ
              </h2>

              <p className={styles.description}>
                Изготавливаем накладки под конкретную модель автомобиля, нужную
                графику и желаемый внешний вид.
                <br />
                Работаем аккуратно, согласовываем решение до запуска
                <br />и принимаем приборки из других городов через СДЭК.
              </p>
            </div>

            <div className={styles.media}>
              <Image
                src="/images/main-offer/main-offer-v2.webp"
                alt="Изготовление накладок для шкалы приборов"
                fill
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 460px"
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
