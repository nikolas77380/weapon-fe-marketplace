"use client";

import React from "react";
import ShopCard from "./ShopCard";
import { Product } from "@/lib/types";
import SkeletonComponent from "@/components/ui/SkeletonComponent";
import ViewModeToggle from "@/components/ui/ViewModeToggle";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
            : "flex flex-col"
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
        <div className="mt-12.5 w-full flex items-center justify-center">
          <Pagination className="w-full flex">
            <PaginationContent>
              {/* Previous Button */}
              <div>
                {pagination.page > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => onPageChange?.(pagination.page - 1)}
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                )}
              </div>

              <div className="flex items-center">
                {/* Page Numbers */}
                {Array.from(
                  { length: pagination.pageCount },
                  (_, i) => i + 1
                ).map((pageNum) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage =
                    pageNum === 1 ||
                    pageNum === pagination.pageCount ||
                    Math.abs(pageNum - pagination.page) <= 1;

                  if (!showPage) {
                    // Show ellipsis if there's a gap
                    if (
                      (pageNum === 2 && pagination.page > 4) ||
                      (pageNum === pagination.pageCount - 1 &&
                        pagination.page < pagination.pageCount - 3)
                    ) {
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  }

                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => onPageChange?.(pageNum)}
                        isActive={pageNum === pagination.page}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
              </div>

              <div>
                {/* Next Button */}
                {pagination.page < pagination.pageCount && (
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => onPageChange?.(pagination.page + 1)}
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                )}
              </div>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ShopContent;
