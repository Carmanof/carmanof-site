import Link from "next/link";
import { brandSlogan, businessAddressLabel, businessMapUrl } from "@/config/business";
import styles from "./Footer.module.scss";

export default function Footer() {
  return <footer className={styles.footer}><div className={styles.top}><Link href="/" className={styles.brand}>Carmanof<span>.</span></Link><div className={styles.summary}><strong>{brandSlogan}</strong><p>Индивидуальные шкалы и приборные панели с доставкой по России.</p><a href={businessMapUrl} target="_blank" rel="noreferrer">{businessAddressLabel}</a></div><nav><Link href="/services">Услуги</Link><Link href="/cases">Работы</Link><Link href="/delivery">Доставка и оплата</Link><Link href="/about">О мастерской</Link><Link href="/contacts">Контакты</Link><Link href="/blog">Блог</Link></nav></div><div className={styles.bottom}><span>© {new Date().getFullYear()} ИП Карманов А. О.</span><div><Link href="/privacy">Политика конфиденциальности</Link><Link href="/consent">Согласие на обработку данных</Link></div><span>ИНН 590610034700 · ОГРНИП 323595800112271</span></div></footer>;
}
