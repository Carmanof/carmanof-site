"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, MapPin, Send } from "lucide-react";
import { formatPhone } from "@/lib/formatPhone";
import { trackFormSubmit, trackFormSuccess, trackMessengerClick, trackPhoneClick } from "@/lib/analytics";
import styles from "./Contact.module.scss";

type ContactSettings = { phone?: string; email?: string; telegram?: string; whatsapp?: string; vk?: string };

function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && (digits[0] === "7" || digits[0] === "8")) return digits.slice(1);
  return digits.slice(0, 10);
}

export default function Contact({ settings }: { settings?: ContactSettings | null }) {
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
    { label: "Telegram", href: settings?.telegram, key: "telegram" as const },
    { label: "WhatsApp", href: settings?.whatsapp, key: "whatsapp" as const },
    { label: "ВКонтакте", href: settings?.vk, key: "vk" as const },
  ].filter((item) => item.href);

  return (
    <section className={styles.section} id="contact" aria-labelledby="contact-title">
      <div className={styles.shell}>
        <div className={styles.head}><p>Начать проект</p><h2 id="contact-title">Покажите приборку.<br /><span>Предложим решение.</span></h2></div>
        <div className={styles.grid}>
          <div className={styles.info}>
            <p>Пришлите модель автомобиля, год выпуска, фото панели и кратко опишите, что хотите изменить. Ответим по существу: что можно сделать, сколько это стоит и нужна ли отправка панели.</p>
            <a className={styles.bigPhone} href={`tel:${displayPhone.replace(/\D/g, "")}`} onClick={() => trackPhoneClick(displayPhone)}>{formatPhone(displayPhone)} <ArrowUpRight /></a>
            {settings?.email && <a className={styles.email} href={`mailto:${settings.email}`}>{settings.email}</a>}
            <div className={styles.messengers}>{messengers.map((item) => <a href={item.href} key={item.label} target="_blank" rel="noreferrer" onClick={() => trackMessengerClick(item.key)}>{item.label}<ArrowUpRight size={15} /></a>)}</div>
            <div className={styles.meta}><span><MapPin size={17} /> Краснодар</span><span>Пн—Сб · 10:00—19:00</span><span>Заказы по всей России</span></div>
          </div>
          <form className={styles.form} onSubmit={submit}>
            <label><span>Ваше имя</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Как к вам обращаться" autoComplete="name" maxLength={80} /></label>
            <label><span>Телефон</span><div className={styles.phoneField}><b>+7</b><input value={phone} onChange={(event) => setPhone(normalizePhone(event.target.value))} placeholder="999 123 45 67" inputMode="numeric" autoComplete="tel" /></div></label>
            <input className={styles.honey} name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <label className={styles.consent}><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>Согласен с <Link href="/privacy">политикой обработки персональных данных</Link></span></label>
            <button type="submit" disabled={!valid || status === "sending"}>{status === "sending" ? "Отправляем…" : status === "success" ? "Заявка отправлена" : "Отправить заявку"}<Send size={18} /></button>
            {status === "error" && <p className={styles.error}>Не удалось отправить. Позвоните или напишите нам в мессенджер.</p>}
            {status === "success" && <p className={styles.success}>Спасибо! Свяжемся с вами в рабочее время.</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
