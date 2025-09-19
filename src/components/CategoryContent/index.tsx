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

const FilteringContent = () => {
  const { data: response, isLoading } = useProductsQuery({
    pagination: {
      page: 1,
      pageSize: 6,
    },
  });

  const allProducts = response?.data || [];
  const loading = isLoading;
  const { categories } = useCategories();

  const paginatedProducts = allProducts;

  const availableCategories = categories;

  return (
    <div className="flex h-full w-full gap-0 lg:gap-10 overflow-hidden">
      {/* Filters - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:flex flex-col gap-2 border-r border-b border-border-foreground py-5 w-64 flex-shrink-0 pr-2">
        {availableCategories.map((category) => (
          <Link
            href={`/category/${category.slug}`}
            className="cursor-pointer hover:text-gold-main"
            key={category.id}
          >
            {category.name}
          </Link>
        ))}
      </div>
      {/* Shop Content - Full width on mobile, flex-1 on desktop */}
      <div className="w-full lg:flex-1 min-w-0 overflow-hidden mt-6">
        {/* Swiper Slide Banners */}
        <BannerSlider />

        {/* Viewed Products Slider */}
        <ViewedProductsSlider />

        {/* Products Grid */}
        <div
          className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 
        lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 w-full gap-4"
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
      </div>
    </div>
  );
};

export default FilteringContent;
