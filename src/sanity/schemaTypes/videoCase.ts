import React from "react";
import { defineField, defineType } from "sanity";
import { LimitedCaseBooleanInput } from "../components/caseControls";

const SANITY_API_VERSION = "2026-03-25";
const MAX_FEATURED_VIDEO_CASES = 3;

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

function getVideoCaseStatusLabel(params: {
  featured?: boolean;
  published?: boolean;
}) {
  const { featured, published } = params;

  if (featured && published) {
    return "🟣 На главной";
  }

  if (published) {
    return "🟢 На сайте";
  }

  return "🟡 Скрыт";
}

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
      title: "YouTube ID (старое служебное поле)",
      type: "string",
      description:
        "Оставлено для совместимости со старыми роликами. Для новых кейсов заполнять не нужно.",
      readOnly: true,
      hidden: true,
    }),

    defineField({
      name: "videoFile",
      title: "Видео MP4",
      type: "file",
      description:
        "Загрузите готовый ролик. Рекомендуемый формат: MP4, кодек H.264, звук AAC.",
      options: {
        accept: "video/mp4",
      },
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const document = context.document as
            | { videoUrl?: string; youtubeId?: string }
            | undefined;

          if (value || document?.videoUrl || document?.youtubeId) {
            return true;
          }

          return "Загрузите MP4-файл.";
        }),
    }),

    defineField({
      name: "posterImage",
      title: "Обложка видео",
      type: "image",
      description:
        "Изображение показывается до запуска ролика. Рекомендуемое соотношение сторон 16:9.",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Описание изображения",
          type: "string",
          description: "Коротко опишите автомобиль и выполненную работу.",
          validation: (Rule) => Rule.required().min(10).max(120),
        }),
      ],
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const document = context.document as
            | { posterUrl?: string; youtubeId?: string }
            | undefined;

          if (value || document?.posterUrl || document?.youtubeId) {
            return true;
          }

          return "Загрузите обложку видео.";
        }),
    }),

    defineField({
      name: "videoUrl",
      title: "Адрес ранее загруженного видео",
      type: "url",
      description:
        "Служебное поле для существующих роликов в Vercel Blob.",
      readOnly: true,
      hidden: ({ document }) => Boolean(document?.videoFile),
    }),

    defineField({
      name: "posterUrl",
      title: "Адрес ранее загруженной обложки",
      type: "url",
      description:
        "Служебное поле для существующих обложек в Vercel Blob.",
      readOnly: true,
      hidden: ({ document }) => Boolean(document?.posterImage),
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
        "На главной показываются только отмеченные кейсы. Максимум 3.",
      initialValue: false,
      components: {
        input: (props) =>
          React.createElement(LimitedCaseBooleanInput, {
            ...props,
            documentType: "videoCase",
            fieldName: "isFeatured",
            limit: MAX_FEATURED_VIDEO_CASES,
            activeFilter: "isFeatured == true",
            enabledDescription: "Пока лимит не набран, переключатель доступен.",
            limitReachedDescription: "Лимит кейсов для главной уже достигнут.",
          }),
      },
      validation: (Rule) =>
        Rule.custom(async (value, context) => {
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

          const count = await client.fetch<number>(
            `
              count(
                *[
                  _type == "videoCase" &&
                  isFeatured == true &&
                  _id != $publishedId &&
                  _id != $draftId
                ]
              )
            `,
            { publishedId, draftId },
          );

          if (count >= MAX_FEATURED_VIDEO_CASES) {
            return `На главной уже ${MAX_FEATURED_VIDEO_CASES} кейса. Убери один перед добавлением нового.`;
          }

          return true;
        }),
    }),

    defineField({
      name: "isPublished",
      title: "Показывать в списках сайта",
      type: "boolean",
      description: "Включите, чтобы кейс появился на странице работ.",
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),
  ],

  preview: {
    select: {
      title: "title",
      youtubeId: "youtubeId",
      videoFileName: "videoFile.asset.originalFilename",
      hasVideoFile: "videoFile.asset._ref",
      hasLegacyVideo: "videoUrl",
      media: "posterImage",
      featured: "isFeatured",
      published: "isPublished",
      order: "order",
    },

    prepare({
      title,
      youtubeId,
      videoFileName,
      hasVideoFile,
      hasLegacyVideo,
      media,
      featured,
      published,
      order,
    }) {
      const statusLabel = getVideoCaseStatusLabel({
        featured,
        published,
      });

      const meta: string[] = [statusLabel];

      if (typeof order === "number") {
        meta.push(`Порядок: ${order}`);
      } else {
        meta.push("Порядок не задан");
      }

      if (hasVideoFile) {
        meta.push(videoFileName ? `MP4: ${videoFileName}` : "MP4 загружено");
      } else if (hasLegacyVideo) {
        meta.push("Видео перенесено с прежнего сайта");
      } else if (youtubeId) {
        meta.push("Существующее видео");
      } else {
        meta.push("Видео не загружено");
      }

      return {
        title: title || "Без названия",
        subtitle: meta.join(" • "),
        media,
      };
    },
  },
});
