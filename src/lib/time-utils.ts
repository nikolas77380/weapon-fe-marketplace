/**
 * Форматирует время в короткий формат: "1h", "6h", "13h", "2d", "1w"
 */
export const formatRelativeTimeShort = (dateString: string | undefined): string => {
  if (!dateString) {
    return "now";
  }

  try {
    const date = new Date(dateString);
    const now = new Date();

    // Проверяем валидность даты
    if (isNaN(date.getTime())) {
      console.warn("[formatRelativeTimeShort] Invalid date:", dateString);
      return "now";
    }

    const diffInMs = now.getTime() - date.getTime();

    // Если разница отрицательная (будущее время), показываем "now"
    if (diffInMs < 0) {
      return "now";
    }

    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);

    // Для сообщений меньше 10 секунд показываем "just now"
    if (diffInSeconds < 10) {
      return "just now";
    }

    if (diffInWeeks > 0) {
      return `${diffInWeeks}w`;
    }
    if (diffInDays > 0) {
      return `${diffInDays}d`;
    }
    if (diffInHours > 0) {
      return `${diffInHours}h`;
    }
    if (diffInMinutes > 0) {
      return `${diffInMinutes}m`;
    }
    return "now";
  } catch (error) {
    console.error("[formatRelativeTimeShort] Error formatting time:", error, dateString);
    return "now";
  }
};


