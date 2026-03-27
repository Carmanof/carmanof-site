import type { StructureResolver } from "sanity/structure";
import CasePreviewPane from "./components/CasePreviewPane";

function getVideoCaseViews(S: Parameters<StructureResolver>[0]) {
  return [
    S.view.form().id("editor"),
    S.view.component(CasePreviewPane).id("preview").title("Превью"),
  ];
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Контент")
    .items([
      S.listItem()
        .title("Видео кейсы")
        .schemaType("videoCase")
        .child(
          S.documentTypeList("videoCase")
            .title("Видео кейсы")
            .defaultOrdering([{ field: "order", direction: "asc" }])
            .child((documentId) =>
              S.document()
                .documentId(documentId)
                .schemaType("videoCase")
                .views(getVideoCaseViews(S)),
            ),
        ),

      S.listItem()
        .title("Фото кейсы")
        .schemaType("photoCase")
        .child(
          S.documentTypeList("photoCase")
            .title("Фото кейсы")
            .defaultOrdering([{ field: "order", direction: "asc" }]),
        ),

      S.divider(),

      S.listItem()
        .title("Статьи (SEO)")
        .schemaType("blogPost")
        .child(
          S.documentTypeList("blogPost")
            .title("Статьи")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
        ),

      S.divider(),

      S.listItem()
        .title("Настройки сайта")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
    ]);
