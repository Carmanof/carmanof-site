"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useClient } from "sanity";

const SANITY_API_VERSION = "2026-03-25";

type CaseImageValue = {
  alt?: string;
  asset?: {
    _ref?: string;
    _id?: string;
    url?: string;
  };
};

type VideoCaseDocument = {
  _id?: string;
  _type?: "videoCase";
  title?: string;
  description?: string;
  youtubeId?: string;
  order?: number;
  isFeatured?: boolean;
  isPublished?: boolean;
};

type PhotoCaseDocument = {
  _id?: string;
  _type?: "photoCase";
  title?: string;
  image?: CaseImageValue;
  order?: number;
  isPublished?: boolean;
};

type SupportedCaseDocument = VideoCaseDocument | PhotoCaseDocument;

type CasePreviewPaneProps = {
  document?: {
    draft?: SupportedCaseDocument | null;
    published?: SupportedCaseDocument | null;
    displayed?: SupportedCaseDocument | null;
  };
};

function isVideoCaseDocument(
  document: SupportedCaseDocument | null | undefined,
): document is VideoCaseDocument {
  return document?._type === "videoCase";
}

function isPhotoCaseDocument(
  document: SupportedCaseDocument | null | undefined,
): document is PhotoCaseDocument {
  return document?._type === "photoCase";
}

function getYoutubeThumbnail(youtubeId?: string) {
  if (!youtubeId) {
    return null;
  }

  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}

function getAssetIdFromImage(image?: CaseImageValue) {
  if (!image?.asset) {
    return null;
  }

  /**
   * Иногда URL уже доступен прямо в значении image.asset,
   * тогда отдельный запрос за URL не нужен.
   */
  if (image.asset.url) {
    return null;
  }

  /**
   * В Sanity asset обычно приходит как reference вида:
   * image-<hash>-<dimensions>-<format>
   */
  return image.asset._ref || image.asset._id || null;
}

function getDocumentStatus(document: SupportedCaseDocument | null) {
  if (!document) {
    return {
      label: "Документ не найден",
      tone: "neutral" as const,
    };
  }

  if (isVideoCaseDocument(document)) {
    if (document.isFeatured && document.isPublished) {
      return {
        label: "На главной",
        tone: "featured" as const,
      };
    }

    if (document.isPublished) {
      return {
        label: "На сайте",
        tone: "published" as const,
      };
    }

    return {
      label: "Скрыт",
      tone: "hidden" as const,
    };
  }

  if (document.isPublished) {
    return {
      label: "На сайте",
      tone: "published" as const,
    };
  }

  return {
    label: "Скрыт",
    tone: "hidden" as const,
  };
}

function getToneStyles(tone: "featured" | "published" | "hidden" | "neutral") {
  if (tone === "featured") {
    return {
      background: "#f3e8ff",
      color: "#7e22ce",
      border: "1px solid #d8b4fe",
    };
  }

  if (tone === "published") {
    return {
      background: "#ecfdf5",
      color: "#047857",
      border: "1px solid #a7f3d0",
    };
  }

  if (tone === "hidden") {
    return {
      background: "#fef3c7",
      color: "#b45309",
      border: "1px solid #fcd34d",
    };
  }

  return {
    background: "#f3f4f6",
    color: "#4b5563",
    border: "1px solid #d1d5db",
  };
}

function getDocumentSourceLabel(params: {
  hasDraft: boolean;
  hasPublished: boolean;
}) {
  const { hasDraft, hasPublished } = params;

  if (hasDraft && hasPublished) {
    return "Показано текущее состояние редактора";
  }

  if (hasDraft) {
    return "Черновик без опубликованной версии";
  }

  if (hasPublished) {
    return "Опубликованная версия";
  }

  return "Нет данных документа";
}

function renderMetaValue(value?: string | number | null) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return String(value);
}

export default function CasePreviewPane(props: CasePreviewPaneProps) {
  const baseClient = useClient({ apiVersion: SANITY_API_VERSION });

  /**
   * Для превью нам важен актуальный снимок документа в редакторе.
   * displayed — это лучший источник, потому что он отражает именно то,
   * что сейчас открыто в документе.
   */
  const displayedDocument =
    props.document?.displayed ||
    props.document?.draft ||
    props.document?.published ||
    null;

  const hasDraft = Boolean(props.document?.draft);
  const hasPublished = Boolean(props.document?.published);

  const [resolvedImageUrl, setResolvedImageUrl] = useState<string | null>(null);
  const [isResolvingImage, setIsResolvingImage] = useState(false);

  const status = useMemo(() => {
    return getDocumentStatus(displayedDocument);
  }, [displayedDocument]);

  const statusStyles = useMemo(() => {
    return getToneStyles(status.tone);
  }, [status.tone]);

  const sourceLabel = useMemo(() => {
    return getDocumentSourceLabel({
      hasDraft,
      hasPublished,
    });
  }, [hasDraft, hasPublished]);

  const previewImageUrl = useMemo(() => {
    if (!displayedDocument) {
      return null;
    }

    if (isVideoCaseDocument(displayedDocument)) {
      return getYoutubeThumbnail(displayedDocument.youtubeId);
    }

    if (isPhotoCaseDocument(displayedDocument)) {
      return displayedDocument.image?.asset?.url || resolvedImageUrl;
    }

    return null;
  }, [displayedDocument, resolvedImageUrl]);

  useEffect(() => {
    let isMounted = true;

    async function resolvePhotoAssetUrl() {
      /**
       * Для видео отдельный запрос не нужен.
       */
      if (!isPhotoCaseDocument(displayedDocument)) {
        if (isMounted) {
          setResolvedImageUrl(null);
          setIsResolvingImage(false);
        }
        return;
      }

      /**
       * Если URL уже есть в документе, повторно ничего не запрашиваем.
       */
      if (displayedDocument.image?.asset?.url) {
        if (isMounted) {
          setResolvedImageUrl(displayedDocument.image.asset.url);
          setIsResolvingImage(false);
        }
        return;
      }

      const assetId = getAssetIdFromImage(displayedDocument.image);

      if (!assetId) {
        if (isMounted) {
          setResolvedImageUrl(null);
          setIsResolvingImage(false);
        }
        return;
      }

      setIsResolvingImage(true);

      try {
        /**
         * Подтягиваем URL asset, если в документе есть только reference.
         */
        const assetUrl = await baseClient.fetch<string | null>(
          `*[_id == $assetId][0].url`,
          { assetId },
        );

        if (isMounted) {
          setResolvedImageUrl(assetUrl || null);
        }
      } catch (error) {
        console.error("[CasePreviewPane] image resolve failed", {
          assetId,
          error,
        });

        if (isMounted) {
          setResolvedImageUrl(null);
        }
      } finally {
        if (isMounted) {
          setIsResolvingImage(false);
        }
      }
    }

    void resolvePhotoAssetUrl();

    return () => {
      isMounted = false;
    };
  }, [baseClient, displayedDocument]);

  const documentTypeLabel = isVideoCaseDocument(displayedDocument)
    ? "Видео кейс"
    : isPhotoCaseDocument(displayedDocument)
      ? "Фото кейс"
      : "Кейс";

  const title = displayedDocument?.title || "Без названия";
  const order = displayedDocument?.order;
  const isVideoCase = isVideoCaseDocument(displayedDocument);
  const isPhotoCase = isPhotoCaseDocument(displayedDocument);

  return (
    <div
      style={{
        padding: 24,
        height: "100%",
        boxSizing: "border-box",
        background: "#f9fafb",
      }}
    >
      <div
        style={{
          maxWidth: 820,
          margin: "0 auto",
          display: "grid",
          gap: 18,
        }}
      >
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 20,
            background: "#ffffff",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
          }}
        >
          <div
            style={{
              padding: "18px 20px 0",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "#6b7280",
                }}
              >
                {documentTypeLabel}
              </div>

              <h2
                style={{
                  margin: "8px 0 0",
                  fontSize: 28,
                  lineHeight: 1.15,
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                {title}
              </h2>

              <div
                style={{
                  marginTop: 10,
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: "#6b7280",
                }}
              >
                {sourceLabel}
              </div>
            </div>

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                borderRadius: 999,
                padding: "8px 12px",
                fontSize: 13,
                fontWeight: 700,
                whiteSpace: "nowrap",
                ...statusStyles,
              }}
            >
              {status.label}
            </span>
          </div>

          <div style={{ padding: 20 }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 9",
                borderRadius: 18,
                overflow: "hidden",
                background: "#111827",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              {previewImageUrl ? (
                <img
                  src={previewImageUrl}
                  alt={title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "grid",
                    placeItems: "center",
                    padding: 24,
                    boxSizing: "border-box",
                    textAlign: "center",
                    color: "#e5e7eb",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        lineHeight: 1.3,
                      }}
                    >
                      Превью пока недоступно
                    </div>

                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 14,
                        lineHeight: 1.5,
                        color: "#9ca3af",
                      }}
                    >
                      {isVideoCase
                        ? "Добавь корректный YouTube ID, чтобы увидеть обложку видео."
                        : isPhotoCase
                          ? isResolvingImage
                            ? "Загружаем изображение кейса…"
                            : "Добавь или проверь изображение фото-кейса."
                          : "Открой видео- или фото-кейс, чтобы увидеть превью."}
                    </div>
                  </div>
                </div>
              )}

              {isVideoCase ? (
                <div
                  style={{
                    position: "absolute",
                    right: 14,
                    bottom: 14,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    borderRadius: 999,
                    background: "rgba(17, 24, 39, 0.74)",
                    color: "#ffffff",
                    fontSize: 13,
                    fontWeight: 700,
                    backdropFilter: "blur(6px)",
                  }}
                >
                  YouTube превью
                </div>
              ) : null}

              {isPhotoCase ? (
                <div
                  style={{
                    position: "absolute",
                    right: 14,
                    bottom: 14,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    borderRadius: 999,
                    background: "rgba(17, 24, 39, 0.74)",
                    color: "#ffffff",
                    fontSize: 13,
                    fontWeight: 700,
                    backdropFilter: "blur(6px)",
                  }}
                >
                  Фото кейс
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 14,
          }}
        >
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              background: "#ffffff",
              padding: 16,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "#6b7280",
              }}
            >
              Статус
            </div>

            <div
              style={{
                marginTop: 8,
                fontSize: 18,
                fontWeight: 800,
                color: "#111827",
              }}
            >
              {status.label}
            </div>
          </div>

          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              background: "#ffffff",
              padding: 16,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "#6b7280",
              }}
            >
              Порядок
            </div>

            <div
              style={{
                marginTop: 8,
                fontSize: 18,
                fontWeight: 800,
                color: "#111827",
              }}
            >
              {renderMetaValue(order)}
            </div>
          </div>

          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              background: "#ffffff",
              padding: 16,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "#6b7280",
              }}
            >
              Источник
            </div>

            <div
              style={{
                marginTop: 8,
                fontSize: 16,
                fontWeight: 700,
                color: "#111827",
                lineHeight: 1.35,
              }}
            >
              {sourceLabel}
            </div>
          </div>

          {isVideoCase ? (
            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 16,
                background: "#ffffff",
                padding: 16,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "#6b7280",
                }}
              >
                YouTube ID
              </div>

              <div
                style={{
                  marginTop: 8,
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#111827",
                  lineHeight: 1.35,
                  wordBreak: "break-word",
                }}
              >
                {renderMetaValue(
                  isVideoCaseDocument(displayedDocument)
                    ? displayedDocument.youtubeId
                    : null,
                )}
              </div>
            </div>
          ) : null}

          {isPhotoCase ? (
            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 16,
                background: "#ffffff",
                padding: 16,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "#6b7280",
                }}
              >
                Alt текст
              </div>

              <div
                style={{
                  marginTop: 8,
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#111827",
                  lineHeight: 1.35,
                  wordBreak: "break-word",
                }}
              >
                {renderMetaValue(
                  isPhotoCaseDocument(displayedDocument)
                    ? displayedDocument.image?.alt
                    : null,
                )}
              </div>
            </div>
          ) : null}
        </div>

        {isVideoCaseDocument(displayedDocument) ? (
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              background: "#ffffff",
              padding: 18,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "#6b7280",
              }}
            >
              Краткое описание
            </div>

            <div
              style={{
                marginTop: 10,
                fontSize: 15,
                lineHeight: 1.65,
                color: "#374151",
              }}
            >
              {displayedDocument.description || "Описание пока не заполнено."}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
