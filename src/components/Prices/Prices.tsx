import styles from "./Prices.module.scss";

type PriceItem = {
  title: string;
  value: string;
};

type PricesProps = {
  items?: PriceItem[];
};

const fallbackItems: PriceItem[] = [
  {
    title: "Накладки",
    value: "7 000",
  },
  {
    title: "Пересвет",
    value: "3 500",
  },
  {
    title: "Ремонт",
    value: "2 500",
  },
];

export default function Prices({ items = fallbackItems }: PricesProps) {
  const normalizedItems = fallbackItems.map((fallbackItem, index) => ({
    title: items[index]?.title || fallbackItem.title,
    value: items[index]?.value || fallbackItem.value,
  }));

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

            {normalizedItems.map((item) => (
              <article key={item.title} className={styles.item}>
                <h3 className={styles.itemTitle}>{item.title}</h3>
                <p className={styles.itemPrice}>от {item.value} ₽</p>
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
