"use client";

import { useEffect } from "react";
import { useNavigation } from "@/context/NavigationContext";

/**
 * Хук для автоматического перехвата кликов на все Link компоненты
 * и показа loading screen при навигации
 */
export function useGlobalLinkHandler() {
  const { setIsNavigating } = useNavigation();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Находим ближайший элемент <a> (может быть сам target или его родитель)
      const linkElement = target.closest("a");

      if (!linkElement) return;

      const href = linkElement.getAttribute("href");
      if (!href) return;

      // Пропускаем внешние ссылки, anchor ссылки и специальные протоколы
      if (
        href.startsWith("http") ||
        href.startsWith("//") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        (linkElement.hasAttribute("target") &&
          linkElement.getAttribute("target") === "_blank")
      ) {
        return;
      }

      // Пропускаем если это тот же путь (только query params изменились)
      const currentPath = window.location.pathname;
      const targetPath = href.split("?")[0];

      // Если путь отличается, показываем loading
      if (targetPath !== currentPath) {
        setIsNavigating(true);

        // Автоматически скрываем через 3 секунды на случай если что-то пошло не так
        const timeout = setTimeout(() => {
          setIsNavigating(false);
        }, 3000);

        // Сохраняем timeout для очистки
        (linkElement as any).__navigationTimeout = timeout;
      }
    };

    // Добавляем обработчик на весь document
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [setIsNavigating]);
}
