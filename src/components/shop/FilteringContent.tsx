"use client";

import React, { useCallback, useState, useMemo } from "react";
import Filters from "./Filters";
import ShopContent from "./ShopContent";
import FilterDrawer from "./FilterDrawer";
import {
  useCategoryProductsElastic,
  useCategoryFiltersElastic,
} from "@/hooks/useProductsQuery";
import { useCategories, useCategoryBySlug } from "@/hooks/useCategories";
import { useViewMode } from "@/hooks/useViewMode";
import Sorting from "./Sorting";
import BreadcrumbComponent from "../ui/BreadcrumbComponent";
import { Funnel } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePromosQuery } from "@/hooks/usePromosQuery";
import BannerSlider from "../CategoryContent/BannerSlider";

interface FilterState {
  minPrice: number;
  maxPrice: number;
  categoryId: number | null;
  page: number;
  sort: string;
  subcategoryId: number | null;
  availability: string[];
  condition: string[];
  categories: string[];
}

const FilteringContent = ({ categorySlug }: { categorySlug: string }) => {
  const t = useTranslations("CategoryDetail");
  const { viewMode, setViewMode } = useViewMode("grid");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 1,
    maxPrice: 500000,
    categoryId: null,
    page: 1,
    sort: "id:desc",
    subcategoryId: null,
    availability: [],
    condition: [],
    categories: [],
  });

  const { data: response, isLoading } = useCategoryProductsElastic({
    categorySlug: categorySlug,
    sort: filters.sort !== "id:desc" ? filters.sort : undefined,
    priceRange: {
      min: filters.minPrice,
      max: filters.maxPrice,
    },
    page: filters.page,
    pageSize: 5,
    availability:
      filters.availability.length > 0 ? filters.availability : undefined,
    condition: filters.condition.length > 0 ? filters.condition : undefined,
    categories: filters.categories.length > 0 ? filters.categories : undefined,
  });

  const { data: filtersData } = useCategoryFiltersElastic({
    categorySlug: categorySlug,
    priceRange: {
      min: filters.minPrice,
      max: filters.maxPrice,
    },
  });

  const allProducts = response?.data || [];
  const pagination = response?.meta?.pagination;
  const loading = isLoading;

  // Use Elasticsearch data for filters instead of old hooks
  const elasticFilters = useMemo(() => filtersData?.data, [filtersData]);
  const { categories } = useCategories();
  const { category: currentCategory } = useCategoryBySlug(categorySlug);

  const { data: promosResponse } = usePromosQuery({
    categorySlug,
  });

  const handlePriceChange = useCallback((min: number, max: number) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: min,
      maxPrice: max,
      page: 1,
    }));
  }, []);

  const handleCategoryChange = useCallback((categoryId: number | null) => {
    setFilters((prev) => ({ ...prev, categoryId, page: 1 }));
  }, []);

  const handleSubcategoryChange = useCallback(
    (subcategoryId: number | null) => {
      setFilters((prev) => ({ ...prev, subcategoryId, page: 1 }));
    },
    []
  );

  const handleAvailabilityChange = useCallback((availability: string[]) => {
    setFilters((prev) => ({ ...prev, availability, page: 1 }));
  }, []);

  const handleConditionChange = useCallback((condition: string[]) => {
    setFilters((prev) => ({ ...prev, condition, page: 1 }));
  }, []);

  const handleCategoriesChange = useCallback((categories: string[]) => {
    setFilters((prev) => ({ ...prev, categories, page: 1 }));
  }, []);

  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFilters((prev) => ({
  //     ...prev,
  //     search: e.target.value,
  //     categoryId: null,
  //     page: 1,
  //   }));
  // };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleSortChange = (sort: string) => {
    setFilters((prev) => ({ ...prev, sort, page: 1 }));
  };

  const handleClearAll = () => {
    setFilters({
      minPrice: 1,
      maxPrice: 500000,
      categoryId: null,
      subcategoryId: null,
      availability: [],
      condition: [],
      categories: [],
      page: 1,
      sort: "id:desc",
    });
    setViewMode("grid");
  };

  const handleOpenFilterDrawer = () => {
    setIsFilterDrawerOpen(true);
  };

  const handleCloseFilterDrawer = () => {
    setIsFilterDrawerOpen(false);
  };

  const count = pagination?.total || allProducts.length;

  const customLabels = currentCategory
    ? {
        [categorySlug]: currentCategory.name,
      }
    : {};

  // Memoize priceRange objects to prevent infinite re-renders
  const desktopPriceRange = useMemo(
    () => ({
      min: elasticFilters?.priceStats?.min,
      max: elasticFilters?.priceStats?.max,
    }),
    [elasticFilters]
  );

  const mobilePriceRange = useMemo(
    () => ({
      min: elasticFilters?.priceStats?.min,
      max: elasticFilters?.priceStats?.max,
    }),
    [elasticFilters]
  );

  // Memoize other objects that might cause re-renders
  const memoizedCategoryCounts = useMemo(
    () => elasticFilters?.categories || {},
    [elasticFilters?.categories]
  );
  const availableCategoriesList = useMemo(
    () => (categorySlug ? [] : categories),
    [categorySlug, categories]
  );

  return (
    <div className="min-h-screen h-full w-full mt-3 px-2 sm:px-4 lg:px-6">
      <BreadcrumbComponent customLabels={customLabels} />
      {currentCategory && (
        <div className="mt-5 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {currentCategory.name}
          </h1>
          {currentCategory.description && (
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              {currentCategory.description}
            </p>
          )}
        </div>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full sm:gap-0">
        {/* Mobile Filters Button + Results */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Filters Button - Only on mobile */}
          <button
            onClick={handleOpenFilterDrawer}
            className="lg:hidden flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 min-[500px]:px-3 min-[500px]:py-2 border border-border-foreground rounded text-xs min-[500px]:text-sm hover:bg-accent transition-colors cursor-pointer"
          >
            <Funnel className="w-3 h-3 min-[500px]:w-4 min-[500px]:h-4" />
            <span className="hidden min-[400px]:inline">
              {t("titleFilters")}
            </span>
          </button>

          {/* Results */}
          <h2 className="text-xs min-[500px]:text-sm sm:text-base">
            {t("results", { count })}
          </h2>
        </div>

        {/* Sorting - Full width on mobile with justify-between */}
        <div className="w-full sm:w-auto flex justify-between sm:justify-end items-center sm:gap-0">
          <Sorting
            onSortChange={handleSortChange}
            selectedSort={filters.sort}
            onViewChange={setViewMode}
            selectedView={viewMode}
          />
        </div>
      </div>
      {/* Shop Filtering Content */}
      <div className="flex h-full w-full mt-3 gap-0 lg:gap-6">
        {/* Filters - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block">
          <Filters
            onPriceChange={handlePriceChange}
            onSubcategoryChange={handleSubcategoryChange}
            onAvailabilityChange={handleAvailabilityChange}
            onConditionChange={handleConditionChange}
            onCategoriesChange={handleCategoriesChange}
            onClearAll={handleClearAll}
            availableCategories={availableCategoriesList}
            selectedSubcategoryId={filters.subcategoryId}
            selectedAvailability={filters.availability}
            selectedCondition={filters.condition}
            selectedCategories={filters.categories}
            priceRange={desktopPriceRange}
            categories={memoizedCategoryCounts}
            hideCategoryFilter={!!categorySlug}
            elasticFilters={elasticFilters}
          />
        </div>
        {/* Shop Content - Full width on mobile, flex-1 on desktop */}
        <div className="w-full lg:flex-1 h-full">
          <BannerSlider promos={promosResponse?.data || []} />
          <ShopContent
            products={allProducts}
            pagination={pagination}
            onPageChange={handlePageChange}
            viewMode={viewMode}
            loading={loading}
          />
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {/* <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={handleCloseFilterDrawer}
        onPriceChange={handlePriceChange}
        onCategoryChange={handleCategoryChange}
        onSubcategoryChange={handleSubcategoryChange}
        onClearAll={handleClearAll}
        availableCategories={availableCategoriesList}
        selectedCategoryId={filters.categoryId}
        priceRange={mobilePriceRange}
        categoryCounts={memoizedCategoryCounts}
        hideCategoryFilter={!!categorySlug}
      /> */}
    </div>
  );
};

export default FilteringContent;
