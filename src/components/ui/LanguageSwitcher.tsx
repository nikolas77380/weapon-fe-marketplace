"use client";

import { setUserLocale } from "@/i18n/locale";
import { defaultLocale, locales } from "@/i18n/config";
import { useRouter } from "next/navigation";

export default function LanguageSwitcher() {
  const router = useRouter();

  // Initialize with correct locale immediately
  const getInitialLocale = () => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      const localeFromUrl = pathname.split("/")[1];

      if (localeFromUrl && (localeFromUrl === "en" || localeFromUrl === "ua")) {
        return localeFromUrl as "en" | "ua";
      }

      const savedLocale =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("i18Lang="))
          ?.split("=")[1] || defaultLocale;
      return savedLocale as "en" | "ua";
    }
    return defaultLocale;
  };

  const currentLocale = getInitialLocale();

  const handleLanguageChange = async (locale: string) => {
    await setUserLocale(locale as any);
    router.refresh();
  };

  return (
    <div className="relative inline-flex items-center bg-primary-foreground rounded-lg p-1]">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => handleLanguageChange(locale)}
          className={`
            relative cursor-pointer px-2.5 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ease-in-out
            ${
              currentLocale === locale
                ? "bg-primary-foreground border border-border-foreground text-gray-900 shadow-sm"
                : "text-gray-secondary hover:text-gray-secondary hover:bg-primary-foreground"
            }
          `}
        >
          <span className="flex items-center gap-2">
            {locale === "en" ? (
              <>
                <span>En</span>
              </>
            ) : (
              <>
                <span>Ua</span>
              </>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}
