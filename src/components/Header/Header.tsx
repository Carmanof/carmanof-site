import styles from "./Header.module.scss";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container/Container";
import Button from "@/components/ui/Button/Button";

const navItems = [
  { label: "Главная", href: "#home" },
  { label: "Услуги", href: "#services" },
  { label: "О нас", href: "#about" },
  { label: "Работы", href: "#works" },
];

export default function Header() {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.inner}>
          <Link
            href="/"
            className={styles.logo}
            aria-label="CDU"
            id="header-logo"
          >
            <Image
              src="/images/logo.svg"
              alt="CDU"
              width={72}
              height={26}
              priority
              className={styles.logoImage}
            />
          </Link>

          <nav className={styles.nav} aria-label="Основная навигация">
            <ul className={styles.list}>
              {navItems.map((item) => (
                <li key={item.href} className={styles.item}>
                  <Link href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.action}>
            <Button
              href="#contact"
              variant="primary"
              size="sm"
              className={styles.button}
            >
              Связаться
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
