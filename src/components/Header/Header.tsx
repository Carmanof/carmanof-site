import styles from "./Header.module.scss";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container/Container";

const navItems = [
  { label: "Работы", href: "#cases" },
  { label: "Процесс", href: "#process" },
  { label: "Цены", href: "#prices" },
  { label: "Контакты", href: "#contact" },
];

export default function Header() {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.wrapper}>
          <div className={styles.inner}>
            <Link href="/" className={styles.logo} aria-label="На главную">
              <Image
                src="/images/logo.svg"
                alt="Карманов"
                width={64}
                height={64}
                priority
                className={styles.logoImage}
              />
            </Link>

            <nav className={styles.nav} aria-label="Основная навигация">
              <ul className={styles.list}>
                {navItems.map((item) => (
                  <li key={item.href} className={styles.item}>
                    <Link href={item.href} className="link-primary">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className={styles.action}>
              <Link href="#contact" className={styles.button}>
                Оставить заявку
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
