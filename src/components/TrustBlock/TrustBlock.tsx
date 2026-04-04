import Image from "next/image";
import Section from "@/components/ui/Section/Section";
import styles from "./TrustBlock.module.scss";

const trustItems = [
  {
    icon: "/icons/trust/trust-01.svg",
    title: "Краснодар",
    description:
      "Все этапы работы с приборной панелью проходят в одном месте — без лишних посредников и сложной логистики.",
  },
  {
    icon: "/icons/trust/trust-02.svg",
    title: "Вся Россия",
    description:
      "Принимаем приборные панели из разных регионов и сопровождаем процесс отправки и возврата через СДЭК.",
  },
  {
    icon: "/icons/trust/trust-03.svg",
    title: "Согласование",
    description:
      "До начала работ заранее обсуждаем детали, чтобы вы понимали объём, этапы и ожидаемый результат.",
  },
  {
    icon: "/icons/trust/trust-04.svg",
    title: "Проверка",
    description:
      "Перед отправкой ещё раз проверяем приборную панель, чтобы убедиться в качестве выполненной работы.",
  },
];

export default function TrustBlock() {
  return (
    <Section aria-labelledby="trust-title">
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textBlock}>
            <h2 id="trust-title" className={styles.title}>
              Почему нам доверяют
            </h2>

            <p className={styles.description}>
              Понятный процесс, аккуратная работа и контроль результата на
              каждом этапе — от согласования до финальной проверки перед
              отправкой.
            </p>
          </div>

          <div className={styles.cards}>
            {trustItems.map((item) => (
              <article key={item.title} className={styles.card}>
                <div className={styles.iconWrap}>
                  <Image
                    src={item.icon}
                    alt=""
                    width={64}
                    height={64}
                    className={styles.icon}
                    aria-hidden="true"
                  />
                </div>

                <h3 className={styles.cardTitle}>{item.title}</h3>

                <p className={styles.cardDescription}>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
