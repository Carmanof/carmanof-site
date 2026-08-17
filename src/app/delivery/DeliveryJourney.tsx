"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BlueprintIcon, ChatCircleTextIcon, MapPinIcon, PackageIcon, ShieldCheckIcon, TruckIcon, WrenchIcon } from "@phosphor-icons/react";
import styles from "./delivery.module.scss";

const stages = [
  { icon: ChatCircleTextIcon, label: "Фото и задача", note: "онлайн" },
  { icon: BlueprintIcon, label: "Макет и цена", note: "согласовано" },
  { icon: WrenchIcon, label: "Работа в Carmanof", note: "Краснодар" },
  { icon: TruckIcon, label: "Обратная доставка", note: "СДЭК" },
];

export default function DeliveryJourney() {
  const reduceMotion = useReducedMotion();
  return <div className={styles.journey} aria-label="Схема заказа и доставки">
    <div className={styles.journeyTop}><div><span className={styles.liveDot} />Маршрут заказа</div><strong>01—04</strong></div>
    <div className={styles.journeyMap}>
      <motion.div className={styles.routeProgress} initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: reduceMotion ? 0 : 1.1, ease: [0.22,1,0.36,1] }} />
      {!reduceMotion && <motion.div className={styles.movingParcel} animate={{ top: ["7%","91%"], opacity: [0,1,1,0] }} transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut", times: [0,.14,.86,1] }}><PackageIcon weight="fill" /></motion.div>}
      {stages.map((stage, index) => { const Icon = stage.icon; return <motion.div className={styles.journeyStage} key={stage.label} initial={{ opacity: 0, x: 22 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: reduceMotion ? 0 : .12 * index, duration: .55 }}>
        <span className={styles.stageIcon}><Icon weight="duotone" /></span><div><small>0{index + 1}</small><b>{stage.label}</b></div><em>{stage.note}</em>
      </motion.div>; })}
    </div>
    <div className={styles.journeyBottom}><span><MapPinIcon weight="duotone" />Ваш город</span><i /><span><ShieldCheckIcon weight="duotone" />Проверка</span><i /><span><TruckIcon weight="duotone" />По России</span></div>
  </div>;
}
