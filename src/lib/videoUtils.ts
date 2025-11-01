/**
 * Преобразует URL видео в embed URL для различных платформ
 */
export function getVideoEmbedUrl(url: string): string | null {
  if (!url) return null;

  try {
    const videoUrl = url.trim();

    // YouTube
    // Поддержка разных форматов YouTube URL
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = videoUrl.match(youtubeRegex);
    if (youtubeMatch) {
      const videoId = youtubeMatch[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Vimeo
    // Поддержка разных форматов Vimeo URL
    const vimeoRegex = /(?:vimeo\.com\/)(?:.*\/)?(\d+)/;
    const vimeoMatch = videoUrl.match(vimeoRegex);
    if (vimeoMatch) {
      const videoId = vimeoMatch[1];
      return `https://player.vimeo.com/video/${videoId}`;
    }

    // Если URL уже является embed URL, возвращаем как есть
    if (
      videoUrl.includes("/embed/") ||
      videoUrl.includes("/player.vimeo.com/")
    ) {
      return videoUrl;
    }

    // Если URL валидный, но не распознан, пробуем использовать как есть
    // (для других платформ, которые поддерживают прямой embed)
    try {
      new URL(videoUrl);
      return videoUrl;
    } catch {
      return null;
    }
  } catch (error) {
    console.error("Error parsing video URL:", error);
    return null;
  }
}

/**
 * Проверяет, является ли URL валидным видео URL
 */
export function isValidVideoUrl(url: string): boolean {
  if (!url || url.trim() === "") return false;
  return getVideoEmbedUrl(url) !== null;
}
