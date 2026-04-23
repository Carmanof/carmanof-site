"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Container from "@/components/ui/Container/Container";
import { formatPhone } from "@/lib/formatPhone";
import { trackPhoneClick } from "@/lib/analytics";
import styles from "./Header.module.scss";

/* Навигация главной */
const navItems = [
  { label: "Готовые работы", href: "#cases" },
  { label: "Как заказать", href: "#process" },
  { label: "Цены", href: "#prices" },
  { label: "Контакты", href: "#contact" },
];

const SCROLL_OFFSET = 172;

type HeaderProps = {
  phone?: string;
};

export default function Header({ phone }: HeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isMinimalVariant =
    pathname?.startsWith("/cases") ||
    pathname?.startsWith("/blog") ||
    pathname?.startsWith("/privacy") ||
    false;

  const isMainVariant = !isMinimalVariant;

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMainVariant || !isMenuOpen) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMainVariant, isMenuOpen]);

  useEffect(() => {
    if (!isMainVariant || !isMenuOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMainVariant, isMenuOpen]);

  const handleScroll = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith("#")) return;

      event.preventDefault();

      const target = document.querySelector(href);
      if (!target) return;

      const top =
        target.getBoundingClientRect().top + window.pageYOffset - SCROLL_OFFSET;

      window.scrollTo({ top, behavior: "smooth" });

      setIsMenuOpen(false);
    },
    [],
  );

  const handleLogoClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (pathname !== "/") return;

      event.preventDefault();

      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [pathname],
  );

  const handleContactClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (pathname !== "/") return;

      handleScroll(event, "#contact");
    },
    [handleScroll, pathname],
  );

  const handlePhoneClick = useCallback(() => {
    trackPhoneClick(phone);
  }, [phone]);

  function handleBurgerClick() {
    setIsMenuOpen((prev) => !prev);
  }

  return (
    <>
      <header
        className={`${styles.header} ${
          isMinimalVariant ? styles.headerMinimal : ""
        }`}
      >
        <Container>
          <div className={styles.wrapper}>
            <div className={styles.inner}>
              <Link
                href="/"
                id="header-logo"
                className={styles.logo}
                aria-label="На главную"
                onClick={handleLogoClick}
              >
                <Image
                  src="/images/logo.svg"
                  alt="Карманов"
                  width={64}
                  height={64}
                  className={styles.logoImage}
                />
              </Link>

              {isMainVariant ? (
                <button
                  type="button"
                  className={styles.burger}
                  onClick={handleBurgerClick}
                >
                  <span className={styles.burgerLine} />
                  <span className={styles.burgerLine} />
                  <span className={styles.burgerLine} />
                </button>
              ) : (
                <Link href="/" className={styles.mobileLogo}>
                  <Image
                    src="/images/logo.svg"
                    alt="Карманов"
                    width={48}
                    height={48}
                  />
                </Link>
              )}

              {isMainVariant && (
                <nav className={styles.nav}>
                  <ul className={styles.list}>
                    {navItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="link-primary"
                          onClick={(e) => handleScroll(e, item.href)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              <div className={styles.action}>
                {phone && (
                  <a
                    href={`tel:${phone.replace(/\D/g, "")}`}
                    className={styles.phone}
                    onClick={handlePhoneClick}
                  >
                    {formatPhone(phone)}
                  </a>
                )}

                <Link
                  href={pathname === "/" ? "#contact" : "/#contact"}
                  className={styles.button}
                  onClick={handleContactClick}
                >
                  Оставить заявку
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </header>
    </>
  );
}
