"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import styles from "./FAQ.module.scss";

type FAQItem = { question: string; answer: string };

export default function FAQ({ items = [] }: { items?: FAQItem[] }) {
  return (
    <section className={styles.section} aria-labelledby="faq-title">
      <div className={styles.shell}>
        <div className={styles.heading}><p>Ответы на вопросы</p><h2 id="faq-title">Что важно знать до заказа</h2><span>Если нужного ответа нет — напишите нам. Посмотрим вашу панель и подскажем конкретно по ней.</span></div>
        <Accordion.Root className={styles.list} type="single" defaultValue="item-0" collapsible>
          {items.map((item, index) => <Accordion.Item className={styles.item} value={`item-${index}`} key={item.question}>
            <Accordion.Header><Accordion.Trigger className={styles.trigger}><span className={styles.number}>0{index + 1}</span><span className={styles.question}>{item.question}</span><ChevronDown aria-hidden="true" /></Accordion.Trigger></Accordion.Header>
            <Accordion.Content className={styles.content}><div>{item.answer}</div></Accordion.Content>
          </Accordion.Item>)}
        </Accordion.Root>
      </div>
    </section>
  );
}
