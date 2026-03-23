"use client";

import styles from "./Header.module.scss";
import Link from "next/link";
import Container from "@/components/ui/Container/Container";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/* Навигация */
const navItems = [
  { label: "Работы", href: "#cases" },
  { label: "Процесс", href: "#process" },
  { label: "Цены", href: "#prices" },
  { label: "Контакты", href: "#contact" },
];

/* 76 (header + отступ) + 96 (section margin) */
const SCROLL_OFFSET = 172;

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /* При смене страницы мобильное меню закрываем */
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  /* Когда меню открыто на mobile — блокируем скролл страницы */
  useEffect(() => {
    if (!isMenuOpen) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  /* Закрытие меню по Escape */
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /* Скролл с учетом offset */
  const handleScroll = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith("#")) return;

      e.preventDefault();

      const target = document.querySelector(href);
      if (!target) return;

      const top =
        target.getBoundingClientRect().top + window.pageYOffset - SCROLL_OFFSET;

      window.scrollTo({
        top,
        behavior: "smooth",
      });

      setIsMenuOpen(false);
    },
    [],
  );

  /* Клик по "логотипу" на desktop:
     - на главной скролл вверх
     - на внутренних страницах обычный переход на "/" */
  const handleLogoClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (pathname !== "/") return;

      e.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    [pathname],
  );

  /* Клик по бургеру на mobile */
  function handleBurgerClick() {
    setIsMenuOpen((prev) => !prev);
  }

  /* CTA-скролл */
  const handleContactClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (pathname !== "/") return;

      handleScroll(e, "#contact");
    },
    [handleScroll, pathname],
  );

  return (
    <>
      <header className={styles.header}>
        <Container>
          <div className={styles.wrapper}>
            <div className={styles.inner}>
              {/* Desktop: логотип */}
              <Link
                href="/"
                className={styles.logo}
                aria-label="На главную"
                onClick={handleLogoClick}
              >
                <img
                  src="/images/logo.svg"
                  alt="Карманов"
                  width={64}
                  height={64}
                  className={styles.logoImage}
                />
              </Link>

              {/* Mobile: бургер */}
              <button
                type="button"
                className={styles.burger}
                aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-navigation"
                onClick={handleBurgerClick}
              >
                <span
                  className={`${styles.burgerLine} ${
                    isMenuOpen ? styles.burgerLineTopOpen : ""
                  }`}
                />
                <span
                  className={`${styles.burgerLine} ${
                    isMenuOpen ? styles.burgerLineMiddleOpen : ""
                  }`}
                />
                <span
                  className={`${styles.burgerLine} ${
                    isMenuOpen ? styles.burgerLineBottomOpen : ""
                  }`}
                />
              </button>

              {/* Desktop-навигация */}
              <nav className={styles.nav} aria-label="Основная навигация">
                <ul className={styles.list}>
                  {navItems.map((item) => {
                    const linkHref =
                      pathname === "/" ? item.href : `/${item.href}`;

                    return (
                      <li key={item.href} className={styles.item}>
                        <Link
                          href={linkHref}
                          className="link-primary"
                          onClick={
                            pathname === "/"
                              ? (e) => handleScroll(e, item.href)
                              : undefined
                          }
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* CTA */}
              <div className={styles.action}>
                <Link
                  href={pathname === "/" ? "#contact" : "/#contact"}
                  className={styles.button}
                  onClick={handleContactClick}
                >
                  <span className={styles.buttonTextDesktop}>
                    Оставить заявку
                  </span>
                  <span className={styles.buttonTextMobile}>Заказать</span>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile overlay */}
      <div
        className={`${styles.mobileOverlay} ${
          isMenuOpen ? styles.mobileOverlayVisible : ""
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile menu */}
      <div
        id="mobile-navigation"
        className={`${styles.mobileMenu} ${
          isMenuOpen ? styles.mobileMenuOpen : ""
        }`}
        aria-hidden={!isMenuOpen}
      >
        <nav className={styles.mobileNav} aria-label="Мобильная навигация">
          <ul className={styles.mobileList}>
            {navItems.map((item) => {
              const linkHref = pathname === "/" ? item.href : `/${item.href}`;

              return (
                <li key={item.href} className={styles.mobileItem}>
                  <Link
                    href={linkHref}
                    className={styles.mobileLink}
                    onClick={
                      pathname === "/"
                        ? (e) => handleScroll(e, item.href)
                        : () => setIsMenuOpen(false)
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
