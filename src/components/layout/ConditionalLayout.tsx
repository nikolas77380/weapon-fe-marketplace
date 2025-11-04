"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/landing/Footer";
import { useNavigation } from "@/context/NavigationContext";
import { useGlobalLinkHandler } from "@/hooks/useGlobalLinkHandler";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();
  const { setIsNavigating } = useNavigation();
  const prevPathnameRef = useRef(pathname);

  // Глобальный перехватчик кликов на все ссылки
  useGlobalLinkHandler();

  // Скрываем loading когда страница загрузилась
  useEffect(() => {
    // Если путь изменился, скрываем loading после небольшой задержки
    if (pathname !== prevPathnameRef.current) {
      prevPathnameRef.current = pathname;

      // Скрываем loading через небольшую задержку чтобы страница успела отрендериться
      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [pathname, setIsNavigating]);

  // Скрываем loading при первой загрузке
  useEffect(() => {
    setIsNavigating(false);
  }, [setIsNavigating]);

  // List of paths where Navbar and Footer should NOT be shown
  const hideNavbarFooterPaths = ["/auth"];

  // List of paths where only Footer should NOT be shown
  const hideFooterOnlyPaths = ["/messages"];

  const shouldHideNavbarFooter = hideNavbarFooterPaths.some((path) =>
    pathname.startsWith(path)
  );

  const shouldHideFooter =
    shouldHideNavbarFooter ||
    hideFooterOnlyPaths.some((path) => pathname.startsWith(path));

  return (
    <>
      <div className="relative">{!shouldHideNavbarFooter && <Navbar />}</div>
      {children}
      {!shouldHideFooter && <Footer />}
    </>
  );
}
