"use client";

import { setUserLocale } from "@/i18n/locale";
import { locales } from "@/i18n/config";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
  const router = useRouter();
  const currentLocale = useLocale();

  const handleLanguageChange = async (newLocale: string) => {
    await setUserLocale(newLocale as any);
    
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
