/**
 * Нормализует дату, поступающую от message-service, в валидную ISO-строку.
 * На бэкенде timestamp может приходить без таймзоны (Postgres `timestamp`),
 * поэтому на фронте такие строки интерпретируются как локальное время
 * пользователя и "уезжают" на несколько часов.
 */
export const normalizeToIsoString = (
  value?: string | Date | null
): string => {
  if (!value) {
    return new Date().toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  let raw = value.toString().trim();

  if (!raw) {
    return new Date().toISOString();
  }

  // Приводим формат "YYYY-MM-DD HH:mm:ss" к ISO с "T"
  if (!raw.includes("T") && raw.includes(" ")) {
    raw = raw.replace(" ", "T");
  }

  const hasTimezone =
    /([+-]\d{2}:\d{2}|Z)$/i.test(raw) ||
    raw.endsWith("z") ||
    raw.endsWith("Z");

  const isoCandidate = hasTimezone ? raw : `${raw}Z`;
  const timestamp = Date.parse(isoCandidate);

  if (Number.isNaN(timestamp)) {
    return new Date().toISOString();
  }

  return new Date(timestamp).toISOString();
};

