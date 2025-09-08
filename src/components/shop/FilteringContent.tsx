"use client";

import React, { useState, useMemo } from "react";
import Filters from "./Filters";
import ShopContent from "./ShopContent";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useViewMode } from "@/hooks/useViewMode";
import Sorting from "./Sorting";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

interface FilterState {
  minPrice: number;
  maxPrice: number;
  categoryId: number | null;
  search: string;
  page: number;
  sort: string;
}

const FilteringContent = () => {
  const { viewMode, setViewMode } = useViewMode("grid");
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 1,
    maxPrice: 500000,
    categoryId: null,
    search: "",
    page: 1,
    sort: "id:desc",
  });

  const {
    products: allProducts,
    pagination,
    loading,
  } = useProducts({
    category: filters.categoryId || undefined,
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
  const { categories } = useCategories();

  const paginatedProducts = allProducts;

  const availableCategories = categories;

  const handlePriceChange = (min: number, max: number) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: min,
      maxPrice: max,
      page: 1,
    }));
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setFilters((prev) => ({ ...prev, categoryId, page: 1 }));
  };

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

  const handleSortChange = (sort: string) => {
    setFilters((prev) => ({ ...prev, sort, page: 1 }));
  };

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
      <div
        className="mt-12 border border-[#D3D3D3] rounded-lg h-21 flex items-center justify-between
        px-6 w-full"
      >
        {/* <Search /> */}
        <div className="relative w-2/3">
          <Input
            placeholder="Search weapons, armour, accessories ..."
            value={filters.search}
            onChange={handleSearchChange}
            className="pl-9 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 
            placeholder:text-[#B3B3B3] h-10 w-1/2 border-transparent shadow-none"
          />
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#B3B3B3]"
          />
        </div>
        {/* Sorting */}
        <Sorting
          onSortChange={handleSortChange}
          selectedSort={filters.sort}
          onViewChange={setViewMode}
          selectedView={viewMode}
        />
      </div>
      {/* Shop Filtering Content */}
      <div className="mt-12 flex gap-12 h-full w-full">
        {/* Filters */}
        <Filters
          onPriceChange={handlePriceChange}
          onCategoryChange={handleCategoryChange}
          onClearAll={handleClearAll}
          availableCategories={availableCategories}
          selectedCategoryId={filters.categoryId}
          priceRange={{ min: filters.minPrice, max: filters.maxPrice }}
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
