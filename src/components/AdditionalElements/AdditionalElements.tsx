import Image from "next/image";
import styles from "./AdditionalElements.module.scss";
import Container from "@/components/ui/Container/Container";
import Section from "@/components/ui/Section/Section";

type AdditionalItem = {
  id: string;
  label: string;
  icon: string;
  iconAlt: string;
};

const items: AdditionalItem[] = [
  {
    id: "arrows",
    label: "СТРЕЛКИ",
    icon: "/icons/additional-elements/arrows.svg",
    iconAlt: "Иконка стрелок",
  },
  {
    id: "hoods",
    label: "ПЛАТЫ УПРАВЛЕНИЯ",
    icon: "/icons/additional-elements/hoods.svg",
    iconAlt: "Платы управления",
  },
  {
    id: "rings",
    label: "КОЛЬЦА",
    icon: "/icons/additional-elements/rings.svg",
    iconAlt: "Иконка колец",
  },
];

export default function AdditionalElements() {
  return (
    <Section aria-labelledby="additional-elements-title">
      <Container>
        <div className={styles.wrapper}>
          <h2 id="additional-elements-title" className={styles.title}>
            Дополнительные элементы приборки
          </h2>

          <p className={styles.description}>
            Если требуется изготовить индивидуальные элементы приборки — можем
            сделать это отдельно от основных работ.
          </p>

          <div className={styles.items}>
            {items.map((item) => (
              <div key={item.id} className={styles.item}>
                <div className={styles.icon}>
                  <Image
                    src={item.icon}
                    alt={item.iconAlt}
                    width={28}
                    height={28}
                    className={styles.iconImage}
                  />
                </div>

                <span className={styles.label}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
