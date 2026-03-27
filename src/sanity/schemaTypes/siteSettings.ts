import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Настройки сайта",
  type: "document",
  fields: [
    defineField({
      name: "phone",
      title: "Телефон",
      type: "string",
    }),

    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),

    defineField({
      name: "telegram",
      title: "Telegram",
      type: "url",
      description: "Ссылка на Telegram (например: https://t.me/username)",
    }),

    defineField({
      name: "vk",
      title: "VK",
      type: "url",
      description: "Ссылка на профиль VK",
    }),

    // =========================
    // HERO IMAGES
    // =========================

    defineField({
      name: "heroDefaultImage",
      title: "Hero — изображение ДО",
      type: "image",
      options: {
        hotspot: true,
      },
      description:
        "Основное изображение Hero. Если не задано — используется /public/images/hero/hero-default.webp. Лучше загружать картинку с главным объектом ближе к центру, чтобы кроп под блок 520×500 выглядел аккуратно.",
    }),

    defineField({
      name: "heroHoverImage",
      title: "Hero — изображение ПОСЛЕ",
      type: "image",
      options: {
        hotspot: true,
      },
      description:
        "Изображение при hover/анимации. Если не задано — используется /public/images/hero/hero-hover.webp. Лучше загружать картинку с главным объектом ближе к центру, чтобы кроп под блок 520×500 выглядел аккуратно.",
    }),

    // =========================
    // MORE EXAMPLES BLOCK (5 фото)
    // =========================

    defineField({
      name: "moreExamplesImage01",
      title: "MoreExamples — фото 1 (верх левый)",
      type: "image",
      options: { hotspot: true },
      description:
        "Верхний ряд галереи. Лучше использовать горизонтальное или универсальное изображение с главным объектом ближе к центру. Важные детали не размещать у самых краев: на сайте применяется crop.",
    }),

    defineField({
      name: "moreExamplesImage02",
      title: "MoreExamples — фото 2 (верх правый)",
      type: "image",
      options: { hotspot: true },
      description:
        "Верхний ряд галереи. Лучше использовать горизонтальное или универсальное изображение с главным объектом ближе к центру. Важные детали не размещать у самых краев: на сайте применяется crop.",
    }),

    defineField({
      name: "moreExamplesImage03",
      title: "MoreExamples — фото 3 (низ левый)",
      type: "image",
      options: { hotspot: true },
      description:
        "Нижний ряд галереи. Подойдет изображение с чистой композицией и объектом ближе к центру. Лучше избегать мелких важных деталей по бокам, так как картинка подрезается под единый формат.",
    }),

    defineField({
      name: "moreExamplesImage04",
      title: "MoreExamples — фото 4 (низ центр)",
      type: "image",
      options: { hotspot: true },
      description:
        "Нижний ряд галереи. Подойдет изображение с чистой композицией и объектом ближе к центру. Лучше избегать мелких важных деталей по бокам, так как картинка подрезается под единый формат.",
    }),

    defineField({
      name: "moreExamplesImage05",
      title: "MoreExamples — фото 5 (низ правый)",
      type: "image",
      options: { hotspot: true },
      description:
        "Нижний ряд галереи. Подойдет изображение с чистой композицией и объектом ближе к центру. Лучше избегать мелких важных деталей по бокам, так как картинка подрезается под единый формат.",
    }),

    // =========================
    // PRICES BLOCK
    // =========================

    defineField({
      name: "pricesItem01Title",
      title: "Prices — услуга 1",
      type: "string",
      description: "Название первой услуги. Например: Накладки.",
      validation: (Rule) => Rule.max(60),
    }),

    defineField({
      name: "pricesItem01Value",
      title: "Prices — цена 1",
      type: "string",
      description:
        "Только цифры и валюта. Пример: 7 000 (без ₽). Текст 'от' на сайте добавляется автоматически.",
      validation: (Rule) => Rule.max(40),
    }),

    defineField({
      name: "pricesItem02Title",
      title: "Prices — услуга 2",
      type: "string",
      description: "Название второй услуги. Например: Пересвет.",
      validation: (Rule) => Rule.max(60),
    }),

    defineField({
      name: "pricesItem02Value",
      title: "Prices — цена 2",
      type: "string",
      description:
        "Только цифры и валюта. Пример: 3 500 (без ₽). Текст 'от' на сайте добавляется автоматически.",
      validation: (Rule) => Rule.max(40),
    }),

    defineField({
      name: "pricesItem03Title",
      title: "Prices — услуга 3",
      type: "string",
      description: "Название третьей услуги. Например: Ремонт.",
      validation: (Rule) => Rule.max(60),
    }),

    defineField({
      name: "pricesItem03Value",
      title: "Prices — цена 3",
      type: "string",
      description:
        "Только цифры и валюта. Пример: 2 500 (без ₽). Текст 'от' на сайте добавляется автоматически.",
      validation: (Rule) => Rule.max(40),
    }),
  ],
});
