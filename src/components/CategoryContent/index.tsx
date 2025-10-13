"use client";

import React, { useMemo, useState } from "react";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { useCategories } from "@/hooks/useCategories";
import SkeletonComponent from "../ui/SkeletonComponent";
import ShopCard from "../shop/ShopCard";
import { Product } from "@/lib/types";
import BannerSlider from "./BannerSlider";
import { usePromosQuery } from "@/hooks/usePromosQuery";
import ViewedProductsSlider from "./ViewedProductsSlider";
import CategoryDropdown from "./CategoryDropdown";
import { useTranslations } from "next-intl";
import PaginationTopProduct from "../ui/PaginationTopProduct";

const FilteringContent = () => {
  const t = useTranslations("TopPropositions");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const { data: response, isLoading } = useProductsQuery({
    pagination: {
      page: currentPage,
      pageSize: pageSize,
    },
  });

  const loading = isLoading;
  const { getMainCategories, categories } = useCategories();
  const { data: promosResponse } = usePromosQuery();
  console.log("promosResponse", promosResponse);

  const pagination = response?.meta?.pagination;

  const paginatedProducts = useMemo(() => {
    const allProducts = response?.data || [];
    return allProducts
      .slice()
      .sort(
        (a: Product, b: Product) => Number(b.viewsCount) - Number(a.viewsCount)
      );
  }, [response?.data]);

  const availableCategories = getMainCategories();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex h-full w-full gap-0 lg:gap-10 overflow-hidden">
      {/* Filters - Hidden on mobile, visible on desktop */}
      <div
        className="hidden lg:flex flex-col gap-2 border-r border-b border-border-foreground py-5 w-64 
      flex-shrink-0 pr-2 rounded-br-sm"
      >
        {loading ? (
          <SkeletonComponent type="leftSidebar" />
        ) : (
          availableCategories.map((category) => (
            <CategoryDropdown
              key={category.id}
              category={category}
              allCategories={categories}
            />
          ))
        )}
      </div>
      {/* Shop Content - Full width on mobile, flex-1 on desktop */}
      <div className="w-full lg:flex-1 min-w-0 overflow-hidden mt-6">
        {/* Swiper Slide Banners */}
        <BannerSlider promos={promosResponse?.data || []} />

        {/* Viewed Products Slider */}
        <ViewedProductsSlider />

        {/* Products Grid */}
        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 px-2 sm:px-0">
          {t("title")}
        </h3>
        <div
          className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 
        lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 w-full"
        >
          {loading ? (
            <SkeletonComponent
              type="productCard"
              count={6}
              className="w-full"
            />
          ) : (
            paginatedProducts.map((item: Product) => (
              <ShopCard item={item} key={item.id} />
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination && (
          <PaginationTopProduct
            currentPage={pagination.page}
            totalPages={pagination.pageCount}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default FilteringContent;
