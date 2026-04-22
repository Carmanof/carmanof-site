import Image from "next/image";
import Section from "@/components/ui/Section/Section";
import styles from "./ProcessBlock.module.scss";
import Container from "@/components/ui/Container/Container";

type ProcessStep = {
  id: string;
  title: string;
  description: string;
};

const processSteps: ProcessStep[] = [
  {
    id: "send",
    title: "Отправка",
    description: "Отправляете приборку через СДЭК",
  },
  {
    id: "check",
    title: "Проверка",
    description: "Получаем и проверяем состояние",
  },
  {
    id: "work",
    title: "Работа",
    description: "Ремонтируем или изготавливаем заново",
  },
  {
    id: "result",
    title: "Результат",
    description: "Отправляем готовую приборку обратно",
  },
];

export default function ProcessBlock() {
  return (
    <Section
      id="process"
      className={styles.anchorOffset}
      aria-labelledby="process-block-title"
    >
      <Container>
        <div className={styles.wrapper}>
          <h2 id="process-block-title" className={styles.title}>
            Как заказать
          </h2>

          <div className={styles.steps}>
            {processSteps.map((step, index) => {
              const isLast = index === processSteps.length - 1;

              return (
                <div key={step.id} className={styles.stepItem}>
                  <article className={styles.card}>
                    <h3 className={styles.cardTitle}>{step.title}</h3>

                    <p className={styles.cardDescription}>{step.description}</p>
                  </article>

                  {!isLast && (
                    <div className={styles.arrow} aria-hidden="true">
                      <Image
                        src="/icons/process-block/step-arrow.svg"
                        alt=""
                        width={46}
                        height={64}
                        className={styles.arrowIcon}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
