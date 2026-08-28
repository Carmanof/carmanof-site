"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MapPin, Menu, Phone, X } from "lucide-react";
import { formatPhone } from "@/lib/formatPhone";
import { trackPhoneClick } from "@/lib/analytics";
import { businessMapUrl } from "@/config/business";
import styles from "./Header.module.scss";

const navItems = [
  { label: "Работы", href: "/cases" },
  { label: "Услуги", href: "/services" },
  { label: "Доставка и оплата", href: "/delivery" },
  { label: "О мастерской", href: "/about" },
  { label: "Контакты", href: "/contacts" },
];

export default function Header({ phone }: { phone?: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => {
    if (mobileMenuRef.current?.contains(document.activeElement)) {
      menuButtonRef.current?.focus();
    }
    setOpen(false);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") closeMenu(); };
    const closeOnDesktop = () => { if (window.innerWidth > 820) closeMenu(); };
    if (open) {
      window.addEventListener("keydown", closeOnEscape);
      window.addEventListener("resize", closeOnDesktop);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeOnDesktop);
    };
  }, [open, closeMenu]);

  const displayPhone = phone || "+7 918 240-21-80";

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} id="header-logo" aria-label="Carmanof — на главную">
          Carmanof<span>.</span>
        </Link>
        <nav className={styles.nav} aria-label="Основная навигация">
          {navItems.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>
        <div className={styles.actions}>
          <a className={styles.location} href={businessMapUrl} target="_blank" rel="noreferrer" aria-label="Открыть адрес мастерской в Яндекс Картах"><MapPin size={16} /> Краснодар</a>
          <a className={styles.phone} href={`tel:${displayPhone.replace(/\D/g, "")}`} onClick={() => trackPhoneClick(displayPhone)}>
            <Phone size={16} /><span>{formatPhone(displayPhone)}</span>
          </a>
          <Link className={styles.request} href="/#contact">Обсудить проект</Link>
        </div>
        <button ref={menuButtonRef} className={styles.menuButton} type="button" onClick={() => open ? closeMenu() : setOpen(true)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Закрыть меню" : "Открыть меню"}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <div ref={mobileMenuRef} className={`${styles.mobileMenu} ${open ? styles.mobileMenuOpen : ""}`} id="mobile-navigation" inert={!open}>
        <nav aria-label="Мобильная навигация">
          {navItems.map((item, index) => <Link key={item.href} href={item.href} onClick={closeMenu}><span>0{index + 1}</span>{item.label}</Link>)}
        </nav>
        <a className={styles.mobileAddress} href={businessMapUrl} target="_blank" rel="noreferrer" onClick={closeMenu}><MapPin />Краснодар, ул. Героя Владислава Посадского, 24</a>
        <a className={styles.mobilePhone} href={`tel:${displayPhone.replace(/\D/g, "")}`}>{formatPhone(displayPhone)}</a>
        <Link className={styles.mobileRequest} href="/#contact" onClick={closeMenu}>Рассчитать проект</Link>
      </div>
    </header>
  );
}
