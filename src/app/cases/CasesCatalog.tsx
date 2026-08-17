"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon, ImagesIcon, PlayCircleIcon, VideoCameraIcon, XIcon } from "@phosphor-icons/react";
import styles from "./catalog.module.scss";

export type CatalogItem = {
  id: string;
  type: "video" | "photo";
  title: string;
  description: string;
  brand: string;
  model: string;
  service: string;
  image: string;
  youtubeId?: string;
  brandHref?: string;
};

type Filter = "all" | "video" | "photo";

export default function CasesCatalog({ items, showFilters = true }: { items: CatalogItem[]; showFilters?: boolean }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState<CatalogItem | null>(null);
  const visible = useMemo(() => filter === "all" ? items : items.filter((item) => item.type === filter), [filter, items]);
  const counts = { all: items.length, video: items.filter((item) => item.type === "video").length, photo: items.filter((item) => item.type === "photo").length };

  return <>
    {showFilters && <div className={styles.filters} role="group" aria-label="Фильтр работ">
      {(["all", "video", "photo"] as Filter[]).map((value) => <button type="button" key={value} onClick={() => setFilter(value)} aria-pressed={filter === value} className={filter === value ? styles.activeFilter : ""}>
        {value === "all" ? "Все работы" : value === "video" ? "Видео" : "Фото"}<span>{counts[value]}</span>
      </button>)}
    </div>}

    <div className={styles.grid}>
      {visible.map((item) => <article className={styles.card} key={item.id}>
        <button type="button" className={styles.media} onClick={() => setActive(item)} aria-label={`${item.type === "video" ? "Смотреть видео" : "Открыть фото"}: ${item.title}`}>
          <Image src={item.image} alt={`${item.title} — работа Carmanof`} fill unoptimized={item.image.startsWith("https://i.ytimg.com")} sizes="(max-width: 680px) 100vw, (max-width: 1050px) 50vw, 33vw" />
          <span className={styles.overlay} />
          <span className={styles.type}>{item.type === "video" ? <><VideoCameraIcon weight="duotone" /> Видео</> : <><ImagesIcon weight="duotone" /> Фото</>}</span>
          {item.type === "video" && <span className={styles.play}><PlayCircleIcon weight="fill" /></span>}
        </button>
        <div className={styles.copy}>
          <div className={styles.meta}><span>{item.brand}</span><span>{item.model}</span><span>{item.service}</span></div>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
          {item.brandHref ? <Link href={item.brandHref}>Все работы для {item.brand} <ArrowUpRightIcon /></Link> : <button type="button" onClick={() => setActive(item)}>Посмотреть работу <ArrowUpRightIcon /></button>}
        </div>
      </article>)}
    </div>

    {active && <div className={styles.modal} role="dialog" aria-modal="true" aria-label={active.title} onClick={() => setActive(null)}>
      <div className={styles.modalInner} onClick={(event) => event.stopPropagation()}>
        <button type="button" className={styles.close} onClick={() => setActive(null)} aria-label="Закрыть"><XIcon /></button>
        <div className={styles.modalMedia}>{active.type === "video" && active.youtubeId ? <iframe src={`https://www.youtube-nocookie.com/embed/${active.youtubeId}?autoplay=1&rel=0`} title={active.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /> : <Image src={active.image} alt={active.title} fill sizes="90vw" />}</div>
        <div className={styles.modalCopy}><span>{active.brand} · {active.model}</span><h2>{active.title}</h2><p>{active.description}</p></div>
      </div>
    </div>}
  </>;
}
