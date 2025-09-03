/**
 * Утилита для работы с изображениями
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

/**
 * Формирует полный URL для изображения
 * @param imagePath - относительный путь изображения
 * @returns полный URL изображения
 */
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return "";

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  return `${API_BASE_URL}${imagePath}`;
};

/**
 * Получает URL лучшего размера изображения из formats
 * @param image - объект изображения с форматами
 * @param preferredSize - предпочитаемый размер (small, medium, large)
 * @returns URL изображения
 */
export const getBestImageUrl = (
  image:
    | { url?: string; formats?: Record<string, { url?: string }> }
    | undefined,
  preferredSize: "thumbnail" | "small" | "medium" | "large" = "medium"
): string => {
  if (!image) return "";

  // Сначала пробуем получить предпочитаемый размер
  if (image.formats?.[preferredSize]?.url) {
    return getImageUrl(image.formats[preferredSize].url);
  }

  // Если нет предпочитаемого, ищем любой доступный в порядке убывания качества
  const fallbackOrder = ["medium", "small", "thumbnail"];
  for (const size of fallbackOrder) {
    if (image.formats?.[size]?.url) {
      return getImageUrl(image.formats[size].url);
    }
  }

  // В крайнем случае возвращаем оригинальное изображение
  return getImageUrl(image.url || "");
};

/**
 * Обработчик ошибки загрузки изображения
 * @param e - событие ошибки
 * @param fallbackSrc - путь к fallback изображению
 */
export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc: string
) => {
  const target = e.target as HTMLImageElement;
  target.src = fallbackSrc;
};
