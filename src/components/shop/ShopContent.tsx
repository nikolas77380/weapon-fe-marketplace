"use client";

import React from "react";
import ShopCard from "./ShopCard";
import { Product } from "@/lib/types";
import SkeletonComponent from "@/components/ui/SkeletonComponent";
import ViewModeToggle from "@/components/ui/ViewModeToggle";
import PaginationTopProduct from "@/components/ui/PaginationTopProduct";
import { useTranslations } from "next-intl";

interface ShopContentProps {
  products: Product[];
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
  onPageChange?: (page: number) => void;
  viewMode?: "grid" | "list";
  onViewModeChange?: (viewMode: "grid" | "list") => void;
  loading?: boolean;
  showViewToggle?: boolean;
}

const ShopContent = ({
  products,
  pagination,
  onPageChange,
  viewMode = "grid",
  onViewModeChange,
  loading = false,
  showViewToggle = false,
}: ShopContentProps) => {
  const t = useTranslations("CategoryDetail");

  if (!loading && products.length === 0) {
    return (
      <div className="mb-12">
        <div className="mt-8 text-center">
          <p className="text-gray-500">{t("titleNotFound")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      {showViewToggle && onViewModeChange ? (
        <ViewModeToggle
          viewMode={viewMode}
          onGridClick={() => onViewModeChange("grid")}
          onListClick={() => onViewModeChange("list")}
          count={pagination?.total || products.length}
          title="Products"
        />
      ) : null}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4"
            : "flex flex-col gap-0 md:gap-4"
        }
      >
        {loading ? (
          <SkeletonComponent type="productCard" count={6} className="w-full" />
        ) : (
          products.map((item) => (
            <ShopCard item={item} key={item.id} viewMode={viewMode} />
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && pagination && pagination.pageCount > 1 && (
        <div className="mt-6">
          <PaginationTopProduct
            currentPage={pagination.page}
            totalPages={pagination.pageCount}
            onPageChange={onPageChange || (() => {})}
          />
        </div>
      )}
    </div>
  );
};

export default ShopContent;
