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

  const { products: allProducts, loading } = useProducts({
    search: filters.search !== "" ? filters.search : undefined,
    sort: filters.sort !== "id:desc" ? filters.sort : undefined,
  });

  const { categories } = useCategories();

  // All filtered products (by price and category)
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Filter by price
      const priceMatch =
        product.price >= filters.minPrice && product.price <= filters.maxPrice;

      // Filter by category
      const categoryMatch =
        filters.categoryId === null ||
        product.category?.id === filters.categoryId;

      return priceMatch && categoryMatch;
    });
  }, [allProducts, filters.minPrice, filters.maxPrice, filters.categoryId]);

  // Products filtered by price only (for category synchronization)
  const priceFilteredProducts = useMemo(() => {
    return allProducts.filter(
      (product) =>
        product.price >= filters.minPrice && product.price <= filters.maxPrice
    );
  }, [allProducts, filters.minPrice, filters.maxPrice]);

  // Available categories based on price filter
  const availableCategories = useMemo(() => {
    const categoryIds = new Set(
      priceFilteredProducts
        .map((product) => product.category?.id)
        .filter((id): id is number => id !== undefined)
    );
    return categories.filter((category) => categoryIds.has(category.id));
  }, [categories, priceFilteredProducts]);

  // Client-side pagination of filtered products
  const pageSize = 6;
  const startIndex = (filters.page - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + pageSize
  );

  // Pagination data for filtered products
  const paginationData = {
    page: filters.page,
    pageSize: pageSize,
    pageCount: Math.ceil(filteredProducts.length / pageSize),
    total: filteredProducts.length,
  };

  const handlePriceChange = (min: number, max: number) => {
    setFilters((prev) => {
      // Get products filtered by new price
      const newPriceProducts = allProducts.filter(
        (product) => product.price >= min && product.price <= max
      );

      // Extract available categories from filtered products
      const availableCategoryIds = new Set(
        newPriceProducts
          .map((product) => product.category?.id)
          .filter((id): id is number => id !== undefined)
      );

      return {
        ...prev,
        minPrice: min,
        maxPrice: max,
        page: 1,
        categoryId:
          prev.categoryId && availableCategoryIds.has(prev.categoryId)
            ? prev.categoryId
            : null,
      };
    });
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

  const handleViewChange = (view: "grid" | "list") => {
    setViewMode(view);
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
          onViewChange={handleViewChange}
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
            pagination={paginationData}
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
