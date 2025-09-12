"use client";

import React from "react";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { useCategories } from "@/hooks/useCategories";
import SkeletonComponent from "../ui/SkeletonComponent";
import ShopCard from "../shop/ShopCard";
import { Product } from "@/lib/types";
import Link from "next/link";

const FilteringContent = () => {
  const { data: response, isLoading } = useProductsQuery({
    pagination: {
      page: 1,
      pageSize: 5,
    },
  });

  const allProducts = response?.data || [];
  const loading = isLoading;
  const { categories } = useCategories();

  const paginatedProducts = allProducts;

  const availableCategories = categories;

  return (
    <div className="flex gap-7.5 h-full w-full">
      {/* Filters */}
      <div className="flex flex-col gap-2">
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
      {/* Shop Content */}
      <div className="w-full h-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7.5">
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
