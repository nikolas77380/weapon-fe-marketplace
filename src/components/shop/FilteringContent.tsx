"use client";

import React, { useCallback, useState } from "react";
import Filters from "./Filters";
import ShopContent from "./ShopContent";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { useCategories, useCategoryBySlug } from "@/hooks/useCategories";
import { useViewMode } from "@/hooks/useViewMode";
import { useCategoryCounts } from "@/hooks/useCategoryCounts";
import Sorting from "./Sorting";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import BreadcrumbComponent from "../ui/BreadcrumbComponent";

interface FilterState {
  minPrice: number;
  maxPrice: number;
  categoryId: number | null;
  search: string;
  page: number;
  sort: string;
}

const FilteringContent = ({ categorySlug }: { categorySlug: string }) => {
  const { viewMode, setViewMode } = useViewMode("grid");
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 1,
    maxPrice: 500000,
    categoryId: null,
    search: "",
    page: 1,
    sort: "id:desc",
  });

  const { data: response, isLoading } = useProductsQuery({
    category: filters.categoryId || undefined,
    categorySlug: categorySlug || undefined,
    search: filters.search !== "" ? filters.search : undefined,
    sort: filters.sort !== "id:desc" ? filters.sort : undefined,
    priceRange: {
      min: filters.minPrice,
      max: filters.maxPrice,
    },
    pagination: {
      page: filters.page,
      pageSize: 5,
    },
  });

  const allProducts = response?.data || [];
  const pagination = response?.meta?.pagination;
  const loading = isLoading;
  const { categories } = useCategories();
  const { categoryCounts } = useCategoryCounts();
  const { category: currentCategory } = useCategoryBySlug(categorySlug);

  const paginatedProducts = allProducts;

  const availableCategories = categories;

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value,
      categoryId: null,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleSortChange = useCallback((sort: string) => {
    setFilters((prev) => ({ ...prev, sort, page: 1 }));
  }, []);

  const handleClearAll = () => {
    setFilters({
      minPrice: 1,
      maxPrice: 500000,
      categoryId: null,
      search: "",
      page: 1,
      sort: "id:desc",
    });
    setViewMode("grid");
  };

  return (
    <>
    <BreadcrumbComponent />
      {currentCategory && (
        <div className="mt-5 mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            {currentCategory.name}
          </h1>
          {currentCategory.description && (
            <p className="text-muted-foreground mt-2">
              {currentCategory.description}
            </p>
          )}
        </div>
      )}
      <div
        className="flex items-center justify-between w-full"
      >
        {/* <Search /> */}
        {/* <div className="relative w-2/3">
          <Input
            placeholder="Search..."
            value={filters.search}
            onChange={handleSearchChange}
            className="pl-9 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 
            placeholder:text-foreground/40 h-10 w-1/2 rounded-none border-border-secondary shadow-none text-foreground"
          />
          <Search
            size={14}
            strokeWidth={0.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer text-foreground"
          />
        </div> */}

        {/* Results */}
        <h2>
          Found {pagination?.total || paginatedProducts.length}{" "}
          {(pagination?.total || paginatedProducts.length) === 1 ? "Result" : "Results"}
        </h2>

        {/* Sorting */}
        <Sorting
          onSortChange={handleSortChange}
          selectedSort={filters.sort}
          onViewChange={setViewMode}
          selectedView={viewMode}
        />
      </div>
      {/* Shop Filtering Content */}
      <div className="flex gap-7.5 h-full w-full mt-3">
        {/* Filters */}
        <Filters
          onPriceChange={handlePriceChange}
          onCategoryChange={handleCategoryChange}
          onClearAll={handleClearAll}
          availableCategories={categorySlug ? [] : availableCategories}
          selectedCategoryId={filters.categoryId}
          priceRange={{ min: filters.minPrice, max: filters.maxPrice }}
          categoryCounts={categoryCounts}
          hideCategoryFilter={!!categorySlug}
        />
        {/* Shop Content */}
        <div className="w-full h-full">
          <ShopContent
            products={paginatedProducts}
            pagination={pagination}
            onPageChange={handlePageChange}
            viewMode={viewMode}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default FilteringContent;
