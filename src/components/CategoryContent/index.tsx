"use client";

import React from "react";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { useCategories } from "@/hooks/useCategories";
import SkeletonComponent from "../ui/SkeletonComponent";
import ShopCard from "../shop/ShopCard";
import { Product } from "@/lib/types";
import Link from "next/link";
import BannerSlider from "./BannerSlider";
import ViewedProductsSlider from "./ViewedProductsSlider";
import { useLocale } from "next-intl";

const FilteringContent = () => {
  const { data: response, isLoading } = useProductsQuery({
    pagination: {
      page: 1,
      pageSize: 5,
    },
  });

  const allProducts = response?.data || [];
  const loading = isLoading;
  const { getMainCategories } = useCategories();
  const currentLocale = useLocale();

  const paginatedProducts = allProducts;

  const availableCategories = getMainCategories();

  return (
    <div className="flex h-full w-full gap-10 overflow-hidden">
      {/* Filters */}
      <div className="flex flex-col gap-2 border-r border-b border-border-foreground py-5 w-64 flex-shrink-0 pr-2">
        {availableCategories.map((category) => (
          <Link
            href={`/category/${category.slug}`}
            className="cursor-pointer hover:text-gold-main"
            key={category.id}
          >
            {currentLocale === "en" ? category.name : category.translate_ua}
          </Link>
        ))}
      </div>
      {/* Shop Content */}
      <div className="flex-1 min-w-0 overflow-hidden mt-6">
        {/* Swiper Slide Banners */}
        <BannerSlider />

        {/* Viewed Products Slider */}
        <ViewedProductsSlider />

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full">
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
      </div>
    </div>
  );
};

export default FilteringContent;
