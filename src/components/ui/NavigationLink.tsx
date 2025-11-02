"use client";

import Link, { LinkProps } from "next/link";
import { useNavigation } from "@/context/NavigationContext";
import { MouseEvent } from "react";

interface NavigationLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Кастомный Link компонент, который показывает loading при клике
 * Использовать вместо обычного Link из next/link для внутренней навигации
 */
export function NavigationLink({
  children,
  onClick,
  href,
  className,
  ...props
}: NavigationLinkProps) {
  const { setIsNavigating } = useNavigation();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Вызываем пользовательский onClick если есть
    onClick?.(e);

    // Проверяем, что это внутренняя ссылка
    const hrefStr = typeof href === "string" ? href : href.pathname || "";

    // Пропускаем если это внешняя ссылка, anchor или специальный протокол
    if (
      hrefStr.startsWith("http") ||
      hrefStr.startsWith("#") ||
      hrefStr.startsWith("mailto:") ||
      hrefStr.startsWith("tel:")
    ) {
      return;
    }

    // Показываем loading только если это действительно новый путь
    const currentPath = window.location.pathname;
    const targetPath = hrefStr.split("?")[0]; // Убираем query params для сравнения

    if (targetPath !== currentPath) {
      setIsNavigating(true);

      // Автоматически скрываем через 3 секунды на случай если что-то пошло не так
      setTimeout(() => {
        setIsNavigating(false);
      }, 3000);
    }
  };

  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
