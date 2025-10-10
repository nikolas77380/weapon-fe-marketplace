"use client";

import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { X } from "lucide-react";
import Filters from "./Filters";
import { useTranslations } from "next-intl";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onPriceChange: (min: number, max: number) => void;
  onCategoryChange: (categoryId: number | null) => void;
  onSubcategoryChange: (subcategoryId: number | null) => void;
  onClearAll: () => void;
  availableCategories: any[];
  childCategories: any[];
  selectedCategoryId: number | null;
  selectedSubcategoryId: number | null;
  priceRange: { min: number; max: number };
  categoryCounts: Record<number, number>;
  hideCategoryFilter: boolean;
}

const FilterDrawer = ({
  isOpen,
  onClose,
  onPriceChange,
  onCategoryChange,
  onSubcategoryChange,
  onClearAll,
  availableCategories,
  childCategories,
  selectedCategoryId,
  selectedSubcategoryId,
  priceRange,
  categoryCounts,
  hideCategoryFilter,
}: FilterDrawerProps) => {
  const t = useTranslations("CategoryDetail");
  return (
    <Drawer
      open={isOpen}
      onOpenChange={onClose}
      direction="left"
      dismissible={false}
    >
      <DrawerContent className="h-[100vh] border-none fixed inset-y-0 left-0 right-auto w-80 max-w-[95vw] rounded-none">
        <DrawerHeader className="flex items-center justify-between p-3 sm:p-4 border-b">
          <div>
            <DrawerTitle className="text-base sm:text-lg font-semibold">
              {t("titleFilters")}
            </DrawerTitle>
            <DrawerDescription className="sr-only">
              {t("srDescriptionFilters")}
            </DrawerDescription>
          </div>
          <DrawerClose asChild>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-accent rounded-full transition-colors"
              aria-label="Close filters"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>
          </DrawerClose>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-2 sm:p-4">
          <Filters
            onPriceChange={onPriceChange}
            onCategoryChange={onCategoryChange}
            onSubcategoryChange={onSubcategoryChange}
            onClearAll={onClearAll}
            availableCategories={availableCategories}
            childCategories={childCategories}
            selectedCategoryId={selectedCategoryId}
            selectedSubcategoryId={selectedSubcategoryId}
            priceRange={priceRange}
            categoryCounts={categoryCounts}
            hideCategoryFilter={hideCategoryFilter}
            isMobile={true}
          />

          {/* Separator */}
          <div className="border-t border-border-foreground my-4"></div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FilterDrawer;
