import styles from "./OtherWorks.module.scss";
import Container from "@/components/ui/Container/Container";
import Button from "@/components/ui/Button/Button";

type OtherWorkItem = {
  title: string;
  text: string;
  imageSrc: string;
};

type OtherWorksProps = {
  hasCases: boolean; // 🔥 было hasPhotoCases
};

const otherWorksItems: OtherWorkItem[] = [
  {
    title: "Пересвет шкал",
    text: "Замена штатной подсветки шкал на другой цвет или более яркий вариант.",
    imageSrc: "/images/other-works/other-work-01.webp",
  },
  {
    title: "Ремонт шкал",
    text: "Восстановление поврежденных шкал, исправление дефектов и аккуратная замена элементов.",
    imageSrc: "/images/other-works/other-work-02.webp",
  },
];

export default function OtherWorks({ hasCases }: OtherWorksProps) {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.wrapper}>
          <h2 className={styles.title}>Другие работы</h2>

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
    </section>
  );
}
