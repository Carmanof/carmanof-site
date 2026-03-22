import styles from "./Prices.module.scss";

const priceItems = [
  {
    title: "Накладки",
    price: "от 7 000 ₽",
  },
  {
    title: "Пересвет",
    price: "от 3 500 ₽",
  },
  {
    title: "Ремонт",
    price: "от 2 500 ₽",
  },
];

export default function Prices() {
  return (
    <section
      id="prices"
      className={styles.section}
      aria-labelledby="prices-title"
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.badge}>Ориентир по цене</div>

          <div className={styles.grid}>
            <h2 id="prices-title" className={styles.visuallyHidden}>
              Расценки
            </h2>

            {priceItems.map((item) => (
              <article key={item.title} className={styles.item}>
                <h3 className={styles.itemTitle}>{item.title}</h3>
                <p className={styles.itemPrice}>{item.price}</p>
              </article>
            ))}
          </div>

          <p className={styles.note}>
            Точная стоимость зависит от модели, состояния и объёма работ.
          </p>
        </div>
      </div>
    </section>
  );
}
