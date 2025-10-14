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
  onSubcategoryChange: (subcategoryId: number | null) => void;
  onClearAll: () => void;
  availableCategories: any[];
  selectedSubcategoryId: number | null;
  priceRange: { min: number; max: number };
  selectedPriceRange?: { min: number; max: number };
  categories: Record<number, number>;
  hideCategoryFilter: boolean;
  elasticFilters: any;
  onAvailabilityChange: (availability: string[]) => void;
  onConditionChange: (condition: string[]) => void;
  onCategoriesChange: (categories: string[]) => void;
  selectedAvailability: string[];
  selectedCondition: string[];
  selectedCategories: string[];
  isDisabled?: boolean;
}

const FilterDrawer = ({
  isOpen,
  onClose,
  onPriceChange,
  onSubcategoryChange,
  onClearAll,
  availableCategories,
  selectedSubcategoryId,
  priceRange,
  selectedPriceRange,
  categories,
  hideCategoryFilter,
  elasticFilters,
  onAvailabilityChange,
  onConditionChange,
  onCategoriesChange,
  selectedAvailability,
  selectedCondition,
  selectedCategories,
  isDisabled = false,
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
            onSubcategoryChange={onSubcategoryChange}
            onClearAll={onClearAll}
            availableCategories={availableCategories}
            selectedSubcategoryId={selectedSubcategoryId}
            priceRange={priceRange}
            selectedPriceRange={selectedPriceRange}
            categories={categories}
            hideCategoryFilter={hideCategoryFilter}
            isMobile={true}
            elasticFilters={elasticFilters}
            onAvailabilityChange={onAvailabilityChange}
            onConditionChange={onConditionChange}
            onCategoriesChange={onCategoriesChange}
            selectedAvailability={selectedAvailability}
            selectedCondition={selectedCondition}
            selectedCategories={selectedCategories}
            isDisabled={isDisabled}
          />

          {/* Separator */}
          <div className="border-t border-border-foreground my-4"></div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FilterDrawer;
