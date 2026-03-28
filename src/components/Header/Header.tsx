"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Container from "@/components/ui/Container/Container";
import styles from "./Header.module.scss";

/* Навигация главной */
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

  /**
   * Главная = полный header
   * Cases / Blog / Privacy и все вложенные страницы = минимальный header
   */
  const isMinimalVariant =
    pathname?.startsWith("/cases") ||
    pathname?.startsWith("/blog") ||
    pathname?.startsWith("/privacy") ||
    false;

  const isMainVariant = !isMinimalVariant;

  /* При смене страницы мобильное меню всегда закрываем */
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  /* Когда открыто mobile-меню главной — блокируем скролл body */
  useEffect(() => {
    if (!isMainVariant || !isMenuOpen) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMainVariant, isMenuOpen]);

  /* Закрытие mobile-меню по Escape только когда оно реально открыто */
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

  /* Плавный скролл по якорям на главной с учетом fixed header */
  const handleScroll = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith("#")) return;

      event.preventDefault();

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

  /* Логотип:
     - на главной плавно скроллит вверх
     - на внутренних страницах работает как обычный переход на "/" */
  const handleLogoClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (pathname !== "/") return;

      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    [pathname],
  );

  /* CTA:
     - на главной скроллит к контактам
     - на внутренних страницах ведет на /#contact */
  const handleContactClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (pathname !== "/") return;

      handleScroll(event, "#contact");
    },
    [handleScroll, pathname],
  );

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
              {/* Desktop logo */}
              <Link
                href="/"
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

              {/* Mobile:
                 main -> бургер
                 minimal -> логотип */}
              {isMainVariant ? (
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
              ) : (
                <Link
                  href="/"
                  className={styles.mobileLogo}
                  aria-label="На главную"
                  onClick={handleLogoClick}
                >
                  <Image
                    src="/images/logo.svg"
                    alt="Карманов"
                    width={48}
                    height={48}
                    className={styles.mobileLogoImage}
                  />
                </Link>
              )}

              {/* Desktop-навигация только на главной */}
              {isMainVariant ? (
                <nav className={styles.nav} aria-label="Основная навигация">
                  <ul className={styles.list}>
                    {navItems.map((item) => (
                      <li key={item.href} className={styles.item}>
                        <Link
                          href={item.href}
                          className="link-primary"
                          onClick={(event) => handleScroll(event, item.href)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ) : null}

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

      {/* Mobile overlay и menu только для главной версии */}
      {isMainVariant ? (
        <>
          <div
            className={`${styles.mobileOverlay} ${
              isMenuOpen ? styles.mobileOverlayVisible : ""
            }`}
            onClick={() => setIsMenuOpen(false)}
          />

          <div
            id="mobile-navigation"
            className={`${styles.mobileMenu} ${
              isMenuOpen ? styles.mobileMenuOpen : ""
            }`}
            aria-hidden={!isMenuOpen}
          >
            <nav className={styles.mobileNav} aria-label="Мобильная навигация">
              <ul className={styles.mobileList}>
                {navItems.map((item) => (
                  <li key={item.href} className={styles.mobileItem}>
                    <Link
                      href={item.href}
                      className={styles.mobileLink}
                      onClick={(event) => handleScroll(event, item.href)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </>
      ) : null}
    </>
  );
}
