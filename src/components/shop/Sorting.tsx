"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ViewModeToggle from "@/components/ui/ViewModeToggle";
import { useTranslations } from "next-intl";

interface SortingProps {
  onSortChange?: (sort: string) => void;
  selectedSort?: string;
  onViewChange?: (view: "grid" | "list") => void;
  selectedView?: "grid" | "list";
}

const Sorting = ({
  onSortChange,
  selectedSort,
  onViewChange,
  selectedView,
}: SortingProps) => {
  const t = useTranslations("CategoryDetail.sort");

  const activeTab = selectedView || "grid";

  const sortOptions = [
    { value: "id:desc", label: t("newest") },
    { value: "id:asc", label: t("oldest") },
    { value: "price:asc", label: t("priceLowToHigh") },
    { value: "price:desc", label: t("priceHighToLow") },
    { value: "title:asc", label: t("nameAToZ") },
    { value: "title:desc", label: t("nameZToA") },
  ];

  return (
    <div className="flex items-center gap-3 min-[500px]:gap-4 sm:gap-7.5 w-full sm:w-auto justify-between sm:justify-start">
      <Select value={selectedSort} onValueChange={onSortChange}>
        <SelectTrigger className="w-[160px] min-[500px]:w-[160px] sm:w-[200px] rounded-sm shadow-none 
        focus:ring-0 focus:ring-offset-0 text-xs min-[500px]:text-sm">
          <SelectValue placeholder="Newest First" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <ViewModeToggle
        viewMode={activeTab}
        onGridClick={() => onViewChange?.("grid")}
        onListClick={() => onViewChange?.("list")}
        showTitle={false}
      />
    </div>
  );
};

export default Sorting;
