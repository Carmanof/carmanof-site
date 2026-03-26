import { defineField, defineType } from "sanity";

const SANITY_API_VERSION = "2026-03-25";
const MAX_VISIBLE_PHOTO_CASES = 18;

export const photoCaseType = defineType({
  name: "photoCase",
  title: "Фото кейс",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Название кейса",
      type: "string",
      description:
        "Короткий заголовок для карточки фото-кейса. Лучше делать название понятным и компактным.",
      validation: (Rule) => Rule.required().min(10).max(120),
    }),

    defineField({
      name: "image",
      title: "Изображение",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt текст",
          type: "string",
          description:
            "Короткое описание изображения для доступности и корректной индексации.",
          validation: (Rule) => Rule.required(),
        }),
      ],
      description:
        "Основное изображение кейса для витрины. На сайте выводится не больше 18 фото-кейсов.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "order",
      title: "Порядок отображения",
      type: "number",
      description:
        "Меньше число = выше в списке. Сайт сортирует фото-кейсы по этому полю.",
      validation: (Rule) => Rule.required().integer().min(0),
    }),

    defineField({
      name: "isPublished",
      title: "Показывать в списках сайта",
      type: "boolean",
      description:
        "Если выключено — кейс не будет показан на сайте. Если включено — кейс участвует в витрине фото-кейсов. Одновременно на сайте может быть не больше 18 фото-кейсов.",
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
                  _type == "photoCase" &&
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

          if (visibleCasesCount >= MAX_VISIBLE_PHOTO_CASES) {
            return `На сайте уже показано ${MAX_VISIBLE_PHOTO_CASES} фото-кейсов. Чтобы включить этот кейс, сначала выключите один из текущих.`;
          }

          return true;
        }),
    }),
  ],

  preview: {
    select: {
      title: "title",
      media: "image",
      order: "order",
      published: "isPublished",
    },
    prepare({ title, media, order, published }) {
      const meta: string[] = [];

      meta.push(`Порядок: ${order}`);

      if (!published) meta.push("Скрыт");

      return {
        title,
        subtitle: meta.join(" • "),
        media,
      };
    },
  },
});
