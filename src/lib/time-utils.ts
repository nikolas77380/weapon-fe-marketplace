/**
 * Форматирует время в короткий формат: "1h", "6h", "13h", "2d", "1w"
 * @param dateString - дата в формате строки
 * @param t - опциональная функция перевода для i18n
 */
export const formatRelativeTimeShort = (
  dateString: string | undefined,
  t?: (key: string, params?: any) => string
): string => {
  if (!dateString) {
    return t ? t("timeFormat.now") : "now";
  }

  try {
    const date = new Date(dateString);
    const now = new Date();

    // Проверяем валидность даты
    if (isNaN(date.getTime())) {
      console.warn("[formatRelativeTimeShort] Invalid date:", dateString);
      return t ? t("timeFormat.now") : "now";
    }

    const diffInMs = now.getTime() - date.getTime();

    // Если разница отрицательная (будущее время), показываем "now"
    if (diffInMs < 0) {
      return t ? t("timeFormat.now") : "now";
    }

    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);

    // Для сообщений меньше 10 секунд показываем "just now"
    if (diffInSeconds < 10) {
      return t ? t("timeFormat.justNow") : "just now";
    }

    if (t) {
      // Используем переводы
      console.log('[formatRelativeTimeShort] Using translations, diffInWeeks:', diffInWeeks, 'diffInDays:', diffInDays, 'diffInHours:', diffInHours, 'diffInMinutes:', diffInMinutes);
      if (diffInWeeks > 0) {
        const result = t("timeFormat.weeksShort", { count: diffInWeeks });
        console.log('[formatRelativeTimeShort] Weeks result:', result);
        return result;
      }
      if (diffInDays > 0) {
        const result = t("timeFormat.daysShort", { count: diffInDays });
        console.log('[formatRelativeTimeShort] Days result:', result);
        return result;
      }
      if (diffInHours > 0) {
        const result = t("timeFormat.hoursShort", { count: diffInHours });
        console.log('[formatRelativeTimeShort] Hours result:', result);
        return result;
      }
      if (diffInMinutes > 0) {
        const result = t("timeFormat.minutesShort", { count: diffInMinutes });
        console.log('[formatRelativeTimeShort] Minutes result:', result);
        return result;
      }
      return t("timeFormat.now");
    } else {
      // Fallback на старый формат без переводов
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
    }
  } catch (error) {
    console.error("[formatRelativeTimeShort] Error formatting time:", error, dateString);
    return t ? t("timeFormat.now") : "now";
  }
};
