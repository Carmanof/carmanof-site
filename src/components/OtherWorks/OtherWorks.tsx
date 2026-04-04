import styles from "./OtherWorks.module.scss";
import Container from "@/components/ui/Container/Container";
import Button from "@/components/ui/Button/Button";
import Section from "@/components/ui/Section/Section";

type OtherWorkItem = {
  title: string;
  text: string;
  imageSrc: string;
};

type OtherWorksProps = {
  hasCases: boolean;
};

const otherWorksItems: OtherWorkItem[] = [
  {
    title: "Пересвет",
    text: "Заменим штатную подсветку приборной панели на другой цвет / более яркий вариант.",
    imageSrc: "/images/other-works/other-work-01.webp",
  },
  {
    title: "Ремонт приборных панелей",
    text: "Восстановление повреждений, диагностика электроники и замена элементов.",
    imageSrc: "/images/other-works/other-work-02.webp",
  },
];

export default function OtherWorks({ hasCases }: OtherWorksProps) {
  return (
    <Section id="other-works" aria-labelledby="other-works-title">
      <Container>
        <div className={styles.wrapper}>
          <h2 id="other-works-title" className={styles.title}>
            Другие работы
          </h2>

          <div className={styles.cards}>
            {otherWorksItems.map((item) => (
              <article key={item.title} className={styles.card}>
                <div className={styles.text}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardText}>{item.text}</p>
                </div>

                <div
                  className={styles.image}
                  style={{ backgroundImage: `url(${item.imageSrc})` }}
                  aria-hidden="true"
                />
              </article>
            ))}
          </div>

          <div className={styles.actions}>
            {hasCases ? (
              <Button href="/cases" variant="secondary" size="sm">
                Посмотреть примеры работ
              </Button>
            ) : (
              <span
                className={styles.actionsButtonDisabled}
                aria-disabled="true"
              >
                Посмотреть примеры работ
              </span>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
