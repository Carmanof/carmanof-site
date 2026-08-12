"use client";

import Image from "next/image";
import { useCallback } from "react";
import styles from "./Hero.module.scss";
import Container from "@/components/ui/Container/Container";
import Button from "@/components/ui/Button/Button";

type HeroProps = { defaultImageSrc?: string; hoverImageSrc?: string };

export default function Hero() {
  const scrollTo = useCallback((selector: string) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <section className={styles.hero} id="home">
      <Image
        src="/images/hero/hero-premium-final.png"
        alt="РРЅРґРёРІРёРґСѓР°Р»СЊРЅР°СЏ РїСЂРёР±РѕСЂРЅР°СЏ РїР°РЅРµР»СЊ Carmanof"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className={styles.backgroundImage}
      />
      <div className={styles.overlay} />
      <Container>
        <div className={styles.content}>
          <p className={styles.eyebrow}>РњР°СЃС‚РµСЂСЃРєР°СЏ Carmanof В· РљСЂР°СЃРЅРѕРґР°СЂ</p>
          <h1 className={styles.title}>
            РЁРєР°Р»С‹<br />
            РїСЂРёР±РѕСЂРѕРІ<br />
            <span>РЅР° Р·Р°РєР°Р·</span>
          </h1>
          <p className={styles.description}>
            РР·РіРѕС‚Р°РІР»РёРІР°РµРј С€РєР°Р»С‹, РЅР°РєР»Р°РґРєРё Рё РїРѕРґСЃРІРµС‚РєСѓ РїСЂРёР±РѕСЂРЅС‹С… РїР°РЅРµР»РµР№
            РїРѕРґ РєРѕРЅРєСЂРµС‚РЅСѓСЋ РјРѕРґРµР»СЊ Р°РІС‚РѕРјРѕР±РёР»СЏ.
          </p>
          <p className={styles.caption}>Р Р°Р±РѕС‚Р°РµРј РїРѕ РІСЃРµР№ Р РѕСЃСЃРёРё В· РѕС‚РїСЂР°РІРєР° РЎР”Р­Рљ</p>
          <div className={styles.actions}>
            <Button href="#contact" variant="primary" size="sm" onClick={(event) => { event.preventDefault(); scrollTo("#contact"); }}>
              Р Р°СЃСЃС‡РёС‚Р°С‚СЊ РїСЂРѕРµРєС‚
            </Button>
            <button type="button" className={styles.secondaryAction} onClick={() => scrollTo("#cases")}>
              РЎРјРѕС‚СЂРµС‚СЊ СЂР°Р±РѕС‚С‹
            </button>
          </div>
        </div>
      </Container>
      <Container>
        <div className={styles.advantages} aria-label="РџСЂРµРёРјСѓС‰РµСЃС‚РІР° РјР°СЃС‚РµСЂСЃРєРѕР№">
          <p><b>01</b> РЎР”Р­Рљ РїРѕ Р РѕСЃСЃРёРё</p>
          <p><b>02</b> РРЅРґРёРІРёРґСѓР°Р»СЊРЅС‹Р№ РјР°РєРµС‚</p>
          <p><b>03</b> РџСЂРѕРІРµСЂРєР° РїРµСЂРµРґ РѕС‚РїСЂР°РІРєРѕР№</p>
        </div>
      </Container>
    </section>
  );
}

