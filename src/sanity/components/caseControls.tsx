"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { BooleanInputProps } from "sanity";
import { set, useClient, useFormValue } from "sanity";

const SANITY_API_VERSION = "2026-03-25";

type CaseDocumentType = "videoCase" | "photoCase";
type CaseFieldName = "isFeatured" | "isPublished";

type LimitedCaseBooleanInputProps = BooleanInputProps & {
  documentType: CaseDocumentType;
  fieldName: CaseFieldName;
  limit: number;
  activeFilter: string;
  enabledDescription: string;
  limitReachedDescription: string;
};

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

function getProgressPercent(totalActive: number | null, limit: number) {
  if (typeof totalActive !== "number" || limit <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round((totalActive / limit) * 100)));
}

function getStatusConfig(params: {
  isLoadingCount: boolean;
  limitReached: boolean;
  readOnly: boolean;
  value: unknown;
}) {
  const { isLoadingCount, limitReached, readOnly, value } = params;

  if (readOnly) {
    return {
      label: "Только чтение",
      badgeBackground: "#f3f4f6",
      badgeColor: "#4b5563",
      helperColor: "#6b7280",
      borderColor: "#d1d5db",
      backgroundColor: "#ffffff",
      progressColor: "#9ca3af",
    };
  }

  if (isLoadingCount) {
    return {
      label: "Проверяем лимит",
      badgeBackground: "#eff6ff",
      badgeColor: "#1d4ed8",
      helperColor: "#1d4ed8",
      borderColor: "#bfdbfe",
      backgroundColor: "#ffffff",
      progressColor: "#3b82f6",
    };
  }

  if (limitReached) {
    return {
      label: "Лимит достигнут",
      badgeBackground: "#ffedd5",
      badgeColor: "#b45309",
      helperColor: "#b45309",
      borderColor: "#f59e0b",
      backgroundColor: "#fff7ed",
      progressColor: "#f59e0b",
    };
  }

  if (value === true) {
    return {
      label: "Включено",
      badgeBackground: "#ecfdf5",
      badgeColor: "#047857",
      helperColor: "#4b5563",
      borderColor: "#a7f3d0",
      backgroundColor: "#ffffff",
      progressColor: "#10b981",
    };
  }

  return {
    label: "Выключено",
    badgeBackground: "#f3f4f6",
    badgeColor: "#4b5563",
    helperColor: "#6b7280",
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
    progressColor: "#6366f1",
  };
}

export function LimitedCaseBooleanInput(props: LimitedCaseBooleanInputProps) {
  const {
    value,
    onChange,
    readOnly,
    documentType,
    fieldName,
    limit,
    activeFilter,
    enabledDescription,
    limitReachedDescription,
    schemaType,
  } = props;

  /**
   * Базовый client берем один раз от Sanity Studio.
   */
  const baseClient = useClient({ apiVersion: SANITY_API_VERSION });

  /**
   * Важно:
   * делаем стабильный client через useMemo,
   * иначе effect будет перезапускаться бесконечно.
   */
  const client = useMemo(() => {
    return baseClient.withConfig({
      perspective: "published",
    });
  }, [baseClient]);

  /**
   * _id текущего документа читаем прямо из формы Studio.
   */
  const rawDocumentId = useFormValue(["_id"]);
  const documentId =
    typeof rawDocumentId === "string" ? rawDocumentId : undefined;

  const [activeCountWithoutCurrent, setActiveCountWithoutCurrent] = useState<
    number | null
  >(null);
  const [isLoadingCount, setIsLoadingCount] = useState(false);

  const { publishedId, draftId } = getDocumentIds(documentId);

  useEffect(() => {
    let isMounted = true;

    async function loadCount() {
      setIsLoadingCount(true);

      try {
        /**
         * Считаем только опубликованные документы нужного типа,
         * исключая текущий документ и его draft/published пару.
         */
        const count = await client.fetch<number>(
          `
            count(
              *[
                _type == $documentType &&
                ${activeFilter} &&
                _id != $publishedId &&
                _id != $draftId
              ]
            )
          `,
          {
            documentType,
            publishedId,
            draftId,
          },
        );

        if (isMounted) {
          setActiveCountWithoutCurrent(count);
        }
      } catch (error) {
        console.error("[LimitedCaseBooleanInput] count failed", {
          documentType,
          fieldName,
          error,
        });

        if (isMounted) {
          setActiveCountWithoutCurrent(null);
        }
      } finally {
        if (isMounted) {
          setIsLoadingCount(false);
        }
      }
    }

    void loadCount();

    return () => {
      isMounted = false;
    };
  }, [activeFilter, client, documentType, draftId, fieldName, publishedId]);

  /**
   * Запрос считает "остальные" документы.
   * Если текущий тумблер уже включен, добавляем +1 к общему числу.
   */
  const currentDocumentContribution = value === true ? 1 : 0;

  const totalActive =
    typeof activeCountWithoutCurrent === "number"
      ? activeCountWithoutCurrent + currentDocumentContribution
      : null;

  /**
   * Блокируем только новое включение сверх лимита.
   * Выключать текущий активный элемент всегда можно.
   */
  const limitReached =
    typeof activeCountWithoutCurrent === "number" &&
    activeCountWithoutCurrent >= limit &&
    value !== true;

  const isDisabled = Boolean(readOnly) || isLoadingCount || limitReached;

  const helperText = useMemo(() => {
    if (readOnly) {
      return "Поле недоступно для редактирования в текущем состоянии документа.";
    }

    if (isLoadingCount) {
      return "Проверяем доступный лимит…";
    }

    if (limitReached) {
      return `${limitReachedDescription} Сейчас активно: ${totalActive}/${limit}.`;
    }

    if (typeof totalActive === "number") {
      return `${enabledDescription} Сейчас активно: ${totalActive}/${limit}.`;
    }

    return enabledDescription;
  }, [
    enabledDescription,
    isLoadingCount,
    limit,
    limitReached,
    limitReachedDescription,
    readOnly,
    totalActive,
  ]);

  /**
   * Отдельно считаем прогресс для полосы лимита,
   * чтобы редактору было визуально понятно, насколько заполнен слот.
   */
  const progressPercent = getProgressPercent(totalActive, limit);

  /**
   * Собираем визуальные токены состояния в одном месте.
   * Так проще управлять цветами и не плодить условия по JSX.
   */
  const statusConfig = getStatusConfig({
    isLoadingCount,
    limitReached,
    readOnly: Boolean(readOnly),
    value,
  });

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange(set(event.currentTarget.checked));
  }

  return (
    <div
      style={{
        border: `1px solid ${statusConfig.borderColor}`,
        borderRadius: 12,
        padding: 14,
        background: statusConfig.backgroundColor,
        boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#111827",
                lineHeight: 1.35,
              }}
            >
              {schemaType.title}
            </span>

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                borderRadius: 999,
                padding: "4px 8px",
                fontSize: 12,
                fontWeight: 700,
                lineHeight: 1,
                background: statusConfig.badgeBackground,
                color: statusConfig.badgeColor,
                whiteSpace: "nowrap",
              }}
            >
              {statusConfig.label}
            </span>
          </div>

          <div
            style={{
              marginTop: 10,
              display: "grid",
              gap: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                fontSize: 12,
                lineHeight: 1.4,
                color: "#6b7280",
              }}
            >
              <span>Заполнение лимита</span>
              <span style={{ fontWeight: 700, color: "#374151" }}>
                {typeof totalActive === "number"
                  ? `${totalActive}/${limit}`
                  : `—/${limit}`}
              </span>
            </div>

            <div
              style={{
                width: "100%",
                height: 8,
                borderRadius: 999,
                background: "#e5e7eb",
                overflow: "hidden",
              }}
              aria-hidden="true"
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  borderRadius: 999,
                  background: statusConfig.progressColor,
                  transition: "width 180ms ease",
                }}
              />
            </div>
          </div>
        </div>

        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: isDisabled ? "not-allowed" : "pointer",
            opacity: isDisabled ? 0.75 : 1,
            flexShrink: 0,
            paddingTop: 2,
          }}
        >
          <input
            type="checkbox"
            checked={value === true}
            disabled={isDisabled}
            onChange={handleChange}
          />
        </label>
      </div>

      <div
        style={{
          marginTop: 12,
          fontSize: 13,
          lineHeight: 1.5,
          color: statusConfig.helperColor,
        }}
      >
        {helperText}
      </div>

      {value === true && !isLoadingCount && !readOnly ? (
        <div
          style={{
            marginTop: 8,
            fontSize: 12,
            lineHeight: 1.45,
            color: "#6b7280",
          }}
        >
          Этот кейс уже активен. Даже при заполненном лимите его можно выключить
          вручную.
        </div>
      ) : null}
    </div>
  );
}
