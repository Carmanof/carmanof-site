import Image from "next/image";
import styles from "./Contact.module.scss";

const messengerItems = [
  {
    name: "Telegram",
    href: "https://t.me/Carmanof_MANAGER",
    icon: "/icons/contact/tg.svg",
  },
  {
    name: "VK",
    href: "https://vk.com/carmanof",
    icon: "/icons/contact/vk.svg",
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className={styles.section}
      aria-labelledby="contact-title"
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <h2 id="contact-title" className={styles.title}>
              Оставьте номер телефона или свяжитесь с нами в удобном
              мессенджере.
            </h2>
          </div>

          <div className={styles.bottom}>
            <div className={styles.leftArea}>
              <div className={styles.brandArea}>
                <Image
                  // Положите сюда тёмную / инвертированную версию логотипа из интро.
                  src="/icons/contact/cta-logo.svg"
                  alt="Логотип"
                  width={220}
                  height={72}
                  className={styles.brandLogo}
                  priority={false}
                />
              </div>

              <div className={styles.formArea}>
                <form className={styles.form} action="#" method="post">
                  <label
                    className={styles.visuallyHidden}
                    htmlFor="contact-name"
                  >
                    Ваше имя
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder="Ваше имя"
                    className={styles.input}
                    autoComplete="name"
                  />

                  <label
                    className={styles.visuallyHidden}
                    htmlFor="contact-phone"
                  >
                    Номер телефона
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    placeholder="+7 номер телефона без “8”"
                    className={styles.input}
                    autoComplete="tel"
                  />

                  <button type="submit" className={styles.button}>
                    Отправить
                  </button>
                </form>
              </div>
            </div>

            <div className={styles.rightArea}>
              <div className={styles.contactInfo}>
                <div className={styles.messengers}>
                  {messengerItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={styles.messengerLink}
                      aria-label={item.name}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Image
                        src={item.icon}
                        alt=""
                        width={64}
                        height={64}
                        className={styles.messengerIcon}
                        aria-hidden="true"
                      />
                    </a>
                  ))}
                </div>

                <div className={styles.workInfo}>
                  <p className={styles.workLabel}>Режим работы</p>
                  <p className={styles.workValue}>Пн–Сб / 10:00–19:00</p>
                </div>
              </div>

              <div className={styles.qrArea}>
                <div className={styles.qrBox}>
                  <Image
                    src="/icons/contact/QR-Max.webp"
                    alt="QR-код для быстрого перехода"
                    width={124}
                    height={124}
                    className={styles.qrImage}
                  />
                </div>

                <p className={styles.qrText}>Быстрый переход в мессенджер</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
