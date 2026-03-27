import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";

const builder = imageUrlBuilder(client);

/**
 * Берем тип источника изображения напрямую из сигнатуры builder.image().
 * Это самый устойчивый вариант:
 * - не завязаны на внутренние типы пакета
 * - не дублируем вручную форму объекта
 * - если библиотека обновит сигнатуру, TypeScript подхватит это автоматически
 */
export type SanityImageSource = Parameters<typeof builder.image>[0];

/**
 * Базовый builder для всех изображений Sanity.
 * Оставляем универсальным, чтобы не ломать текущие места использования
 * в блоге, кейсах и других блоках.
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Оптимизированный URL для Hero-изображений.
 *
 * Логика:
 * - визуальный размер блока: 520x500
 * - для retina-экранов отдаем 2x размер, чтобы картинка не выглядела мягкой
 * - формат webp уменьшает вес файла
 * - quality 80 дает хороший баланс качества и размера
 */
export function getHeroImageUrl(source: SanityImageSource) {
  return builder
    .image(source)
    .width(1040)
    .height(1000)
    .fit("crop")
    .format("webp")
    .quality(80)
    .url();
}

/**
 * Верхний ряд MoreExamplesBlock.
 *
 * Реальный ratio карточки по SCSS:
 * 588 / 330 ≈ 1.7818
 *
 * Для четкости на retina используем 2x:
 * 1176 / 660
 *
 * Это почти идеальное попадание в реальную карточку,
 * поэтому crop будет вести себя предсказуемо.
 */
export function getMoreExamplesTopImageUrl(source: SanityImageSource) {
  return builder
    .image(source)
    .width(1176)
    .height(660)
    .fit("crop")
    .format("webp")
    .quality(80)
    .url();
}

/**
 * Нижний ряд MoreExamplesBlock.
 *
 * Реальный ratio карточки по SCSS:
 * 389 / 280 ≈ 1.3893
 *
 * Для четкости на retina используем 2x:
 * 778 / 560
 *
 * Это точное соответствие карточке нижнего ряда,
 * поэтому галерея будет выглядеть ровнее при разных исходниках.
 */
export function getMoreExamplesBottomImageUrl(source: SanityImageSource) {
  return builder
    .image(source)
    .width(778)
    .height(560)
    .fit("crop")
    .format("webp")
    .quality(80)
    .url();
}
