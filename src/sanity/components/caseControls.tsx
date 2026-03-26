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
  } = props;

  /**
   * Очень важно:
   * считаем лимиты только по published-перспективе,
   * иначе Studio может учитывать draft/published-версии как отдельные состояния
   * и завышать счетчик.
   */
  const client = useClient({ apiVersion: SANITY_API_VERSION }).withConfig({
    perspective: "published",
  });

  /**
   * Берем _id прямо из формы Studio.
   * Это надежнее, чем читать document из props.
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
         * Считаем все активные документы этого типа,
         * кроме текущего документа (и его draft/published-пары).
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
   * Базовый count считает только "остальные" документы.
   * Если текущий тумблер включен, добавляем его отдельно в итог.
   */
  const currentDocumentContribution = value === true ? 1 : 0;

  const totalActive =
    typeof activeCountWithoutCurrent === "number"
      ? activeCountWithoutCurrent + currentDocumentContribution
      : null;

  /**
   * Лимит достигнут, если:
   * - остальных уже >= limit
   * - и текущий документ сейчас не включен
   *
   * Это позволяет:
   * - заблокировать новое включение сверх лимита
   * - но всегда разрешать выключение уже активного тумблера
   */
  const limitReached =
    typeof activeCountWithoutCurrent === "number" &&
    activeCountWithoutCurrent >= limit &&
    value !== true;

  const isDisabled = Boolean(readOnly) || isLoadingCount || limitReached;

  const helperText = useMemo(() => {
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
    totalActive,
  ]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange(set(event.currentTarget.checked));
  }

  return (
    <div
      style={{
        border: limitReached ? "1px solid #f59e0b" : "1px solid #d1d5db",
        borderRadius: 10,
        padding: 14,
        background: limitReached ? "#fff7ed" : "#ffffff",
      }}
    >
      <label
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          cursor: isDisabled ? "not-allowed" : "pointer",
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#111827",
          }}
        >
          {props.schemaType.title}
        </span>

        <input
          type="checkbox"
          checked={value === true}
          disabled={isDisabled}
          onChange={handleChange}
        />
      </label>

      <div
        style={{
          marginTop: 10,
          fontSize: 13,
          lineHeight: 1.45,
          color: limitReached ? "#b45309" : "#6b7280",
        }}
      >
        {helperText}
      </div>
    </div>
  );
}
