import React from "react";
import { defineField, defineType } from "sanity";
import { LimitedCaseBooleanInput } from "../components/caseControls";

const SANITY_API_VERSION = "2026-03-25";
const MAX_VISIBLE_PHOTO_CASES = 18;

function getDocumentIds(documentId?: string) {
  if (!documentId) {
    return {
      publishedId: "",
      draftId: "",
    };
  }

  const publishedId = documentId.replace(/^drafts\./, "");
  const draftId = `drafts.${publishedId}`;

  return { publishedId, draftId };
}

function getPhotoCaseStatusLabel(published?: boolean) {
  if (published) {
    return "🟢 На сайте";
  }

  return "🟡 Скрыт";
}

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
      components: {
        input: (props) =>
          React.createElement(LimitedCaseBooleanInput, {
            ...props,
            documentType: "photoCase",
            fieldName: "isPublished",
            limit: MAX_VISIBLE_PHOTO_CASES,
            activeFilter: "(!defined(isPublished) || isPublished == true)",
            enabledDescription: "Пока лимит не набран, переключатель доступен.",
            limitReachedDescription:
              "Лимит фото-кейсов для сайта уже достигнут.",
          }),
      },
      validation: (Rule) =>
        Rule.required().custom(async (value, context) => {
          if (value !== true) {
            return true;
          }

          const documentId = context.document?._id;

          if (!documentId) {
            return true;
          }

          const { publishedId, draftId } = getDocumentIds(documentId);

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
      order: "order",
      published: "isPublished",
    },

    prepare({ title, order, published }) {
      const statusLabel = getPhotoCaseStatusLabel(published);

      const meta: string[] = [statusLabel];

      if (typeof order === "number") {
        meta.push(`Порядок: ${order}`);
      } else {
        meta.push("Порядок не задан");
      }

      return {
        title: title || "Без названия",
        subtitle: meta.join(" • "),
      };
    },
  },
});
