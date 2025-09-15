import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

const Breadcrumb = () => {
  const t = useTranslations("Auth");
  return (
    <Link
      href="/"
      className="flex items-center gap-2 cursor-pointer hover:text-black/70 border-b border-border-secondary pb-1"
    >
      <ChevronLeft size={20} className="text-black" />
      <h1 className="font-medium">{t("breadcrumb")}</h1>
    </Link>
  );
};

export default Breadcrumb;
