"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3, MapPin, Phone, Send } from "lucide-react";
import { formatPhone } from "@/lib/formatPhone";
import { trackFormSubmit, trackFormSuccess, trackMessengerClick, trackPhoneClick } from "@/lib/analytics";
import styles from "./Contact.module.scss";

type ContactSettings = { phone?: string; email?: string; telegram?: string; whatsapp?: string; vk?: string };

function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && (digits[0] === "7" || digits[0] === "8")) return digits.slice(1);
  return digits.slice(0, 10);
}

export default function Contact({ settings, isPage = false }: { settings?: ContactSettings | null; isPage?: boolean }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const valid = useMemo(() => phone.length === 10 && !/^(\d)\1{9}$/.test(phone) && consent, [phone, consent]);
  const displayPhone = settings?.phone || "+7 918 240-21-80";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid || status === "sending") return;
    const formData = new FormData(event.currentTarget);
    setStatus("sending"); trackFormSubmit("contact_form");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: name.trim(), phone: `+7${phone}`, consentAccepted: true, source: window.location.pathname, company: String(formData.get("company") || "") }) });
      if (!response.ok) throw new Error();
      setName(""); setPhone(""); setConsent(false); setStatus("success"); trackFormSuccess("contact_form");
    } catch { setStatus("error"); }
  }

  const messengers = [
    { label: "Telegram", href: settings?.telegram || "https://t.me/Carmanof_MANAGER", icon: "/icons/contact/tg.svg", key: "telegram" as const },
    { label: "WhatsApp", href: settings?.whatsapp || "https://wa.me/79182402180", icon: "/icons/contact/wa.svg", key: "whatsapp" as const },
    { label: "ВКонтакте", href: settings?.vk || "https://vk.com/carmanof", icon: "/icons/contact/vk.svg", key: "vk" as const },
  ];

  return <section className={styles.section} id="contact" aria-labelledby="contact-title"><div className={styles.shell}>
    <header className={styles.head}><p>Связаться с мастером</p>{isPage ? <h1 id="contact-title">Начнём с одного <span>сообщения</span></h1> : <h2 id="contact-title">Начнём с одного <span>сообщения</span></h2>}<div className={styles.headCopy}><p>Оставьте номер — мастер уточнит модель автомобиля и попросит нужные фотографии. Длинную анкету заполнять не нужно.</p></div></header>
    <div className={styles.contactGrid}>
      <div className={styles.direct}>
        <a className={styles.phone} href={`tel:${displayPhone.replace(/\D/g, "")}`} onClick={() => trackPhoneClick(displayPhone)}><span><Phone /> Позвонить</span><strong>{formatPhone(displayPhone)}</strong><ArrowUpRight /></a>
        <div className={styles.messengers}>{messengers.map((item) => <a href={item.href} key={item.label} target="_blank" rel="noreferrer" onClick={() => trackMessengerClick(item.key)}><Image src={item.icon} width={28} height={28} alt="" /><span>{item.label}</span><ArrowUpRight size={16} /></a>)}</div>
        <div className={styles.schedule}><span><MapPin />Мастерская в Краснодаре</span><span><Clock3 />Пн – Сб<br />10:00–19:00</span><span>Отправка заказов<br />по всей России</span></div>
      </div>
      <form className={styles.form} onSubmit={submit}>
        <div className={styles.formTitle}><p>Заказать обратный звонок</p><span>Обычно достаточно 30 секунд</span></div>
        <label><span>Имя <i>необязательно</i></span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Как к вам обращаться" autoComplete="name" maxLength={80} /></label>
        <label><span>Номер телефона</span><div className={styles.phoneField}><b>+7</b><input value={phone} onChange={(event) => setPhone(normalizePhone(event.target.value))} placeholder="999 123 45 67" inputMode="numeric" autoComplete="tel" aria-required="true" /></div></label>
        <input className={styles.honey} name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <label className={styles.consent}><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>Согласен с <Link href="/privacy">политикой обработки персональных данных</Link></span></label>
        <button type="submit" disabled={!valid || status === "sending"}>{status === "sending" ? "Отправляем…" : status === "success" ? "Заявка отправлена" : "Перезвоните мне"}<Send size={18} /></button>
        {status === "error" && <p className={styles.error}>Не удалось отправить. Позвоните или напишите в мессенджер.</p>}{status === "success" && <p className={styles.success}>Готово. Свяжемся с вами в рабочее время.</p>}
      </form>
    </div>
    <div className={styles.legal}><p>Реквизиты</p><div><strong>ИП Карманов Алексей Олегович</strong><span>ИНН 590610034700</span><span>ОГРНИП 323595800112271</span></div></div>
  </div></section>;
}
