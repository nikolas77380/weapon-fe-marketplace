"use client";

import { setUserLocale } from "@/i18n/locale";
import { locales } from "@/i18n/config";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const getLanguageConfig = (locale: string) => {
  const configs = {
    en: { code: "EN" },
    ua: { code: "UA" },
  };
  return configs[locale as keyof typeof configs];
};

interface LanguageSwitcherProps {
  classNameMainDiv?: string;
  classNameSelectTrigger?: string;
  classNameSelectValue?: string;
}

export default function LanguageSwitcher({
  classNameMainDiv,
  classNameSelectTrigger,
  classNameSelectValue,
}: LanguageSwitcherProps) {
  const router = useRouter();
  const currentLocale = useLocale();

  const handleLanguageChange = async (newLocale: string) => {
    await setUserLocale(newLocale as any);
    router.refresh();
  };

  const getCurrentLanguage = () => {
    return getLanguageConfig(currentLocale);
  };

  return (
    <div className={cn("flex items-center gap-2", classNameMainDiv)}>
      <Globe className="h-5 w-5 text-gold-main" />
      <Select value={currentLocale} onValueChange={handleLanguageChange}>
        <SelectTrigger
          size="sm"
          className={cn(
            "w-18 border !h-7 border-white/60 bg-transparent transition-colors",
            classNameSelectTrigger
          )}
        >
          <SelectValue>
            <span className={cn("text-sm font-medium", classNameSelectValue)}>
              {getCurrentLanguage()?.code}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {locales.map((locale) => {
            const config = getLanguageConfig(locale);
            return (
              <SelectItem
                key={locale}
                value={locale}
                className="cursor-pointer hover:bg-accent"
              >
                <span className="text-sm font-medium">{config?.code}</span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
