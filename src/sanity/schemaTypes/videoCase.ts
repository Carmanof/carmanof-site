import { defineField, defineType } from "sanity";

const SANITY_API_VERSION = "2026-03-25";
const MAX_VISIBLE_VIDEO_CASES = 18;

export const videoCaseType = defineType({
  name: "videoCase",
  title: "Видео кейс",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Название кейса",
      type: "string",
      description:
        "Короткий заголовок для карточки. Рекомендуется до 42 символов.",
      validation: (Rule) => Rule.required().min(10).max(42),
    }),

    defineField({
      name: "description",
      title: "Описание кейса",
      type: "text",
      rows: 3,
      description:
        "Короткое описание для страницы кейсов. Лучше держать текст компактным.",
      validation: (Rule) => Rule.required().min(20).max(160),
    }),

    defineField({
      name: "youtubeId",
      title: "YouTube ID",
      type: "string",
      description: "Например: ANEqU44lHDI (только ID, не ссылка целиком)",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "order",
      title: "Порядок отображения",
      type: "number",
      description:
        "Меньше число = выше в списке. Сайт сортирует кейсы по этому полю.",
      validation: (Rule) => Rule.required().integer().min(0),
    }),

    defineField({
      name: "isFeatured",
      title: "Показывать на главной",
      type: "boolean",
      description:
        "Если отмечен хотя бы один кейс, на главной будут показаны только отмеченные. Если отмечено больше 3 кейсов, сайт покажет первые 3 по порядку отображения.",
      initialValue: false,
    }),

    defineField({
      name: "isPublished",
      title: "Показывать в списках сайта",
      type: "boolean",
      description:
        "Если выключено — кейс не будет показан на сайте. Если включено — кейс участвует в витрине видео-кейсов. Одновременно на сайте может быть не больше 18 видео-кейсов.",
      initialValue: true,
      validation: (Rule) =>
        Rule.required().custom(async (value, context) => {
          /**
           * Ограничение действует только для включенного состояния.
           * Выключать кейс всегда можно.
           */
          if (value !== true) {
            return true;
          }

          const documentId = context.document?._id;

          if (!documentId) {
            return true;
          }

          const publishedId = documentId.replace(/^drafts\./, "");
          const draftId = `drafts.${publishedId}`;

          const client = context
            .getClient({ apiVersion: SANITY_API_VERSION })
            .withConfig({ perspective: "published" });

          const visibleCasesCount = await client.fetch<number>(
            `
              count(
                *[
                  _type == "videoCase" &&
                  (!defined(isPublished) || isPublished == true) &&
                  _id != $publishedId &&
                  _id != $draftId
                ]
              )
            `,
            {
              publishedId,
              draftId,
            },
          );

          if (visibleCasesCount >= MAX_VISIBLE_VIDEO_CASES) {
            return `На сайте уже показано ${MAX_VISIBLE_VIDEO_CASES} видео-кейсов. Чтобы включить этот кейс, сначала выключите один из текущих.`;
          }

          return true;
        }),
    }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "youtubeId",
      featured: "isFeatured",
      published: "isPublished",
      order: "order",
    },
    prepare({ title, subtitle, featured, published, order }) {
      const meta: string[] = [];

      meta.push(`Порядок: ${order}`);

      if (featured) meta.push("Главная");
      if (!published) meta.push("Скрыт");

      return {
        title,
        subtitle: [`YouTube: ${subtitle}`, ...meta].join(" • "),
      };
    },
  },
});
