"use client";

import React, { useState, useEffect, useRef } from "react";
import { useCategories } from "@/hooks/useCategories";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { Category, Product, ImageType } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Eye, LayoutGrid } from "lucide-react";
import { getBestImageUrl, handleImageError } from "@/lib/imageUtils";
import { formatPrice } from "@/lib/formatUtils";
import { useTranslations } from "next-intl";

interface CatalogDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const CatalogDropdown = ({ isOpen, onClose }: CatalogDropdownProps) => {
  const t = useTranslations("CatalogModal");

  const { categories, loading: categoriesLoading } = useCategories();
  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // We get products for the current induced category
  const { data: productsResponse, isLoading: productsLoading } =
    useProductsQuery({
      category: hoveredCategory?.id,
      pagination: {
        page: 1,
        pageSize: 6,
      },
    });

  const products = productsResponse?.data || [];

  // Closing when clicking outside the region
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // We get the main categories (without parental)
  const mainCategories = categories.filter((category) => !category.parent);

  if (!isOpen) return null;

  return (
    <>
      {/* Disruption of the background */}
      <div
        className="fixed inset-0 bg-black/20 z-40 animate-in fade-in-0 duration-200"
        onClick={onClose}
      />

      <div
        ref={dropdownRef}
        className="absolute top-full left-0 z-50 bg-white border border-gray-200 shadow-2xl w-[900px] max-h-[80vh] rounded-b-lg animate-in fade-in-0 slide-in-from-top-2 duration-200"
        style={{ marginTop: "10px" }}
      >
        <div className="flex h-full max-h-[80vh]">
          {/* Left panel with categories */}
          <div className="w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto catalog-scroll max-h-[60vh]">
            <div className="p-3">
              <h3 className="font-semibold text-sm mb-3 border-b border-gray-200 pb-2">
                {t("title")}
              </h3>
              {categoriesLoading ? (
                <div className="space-y-1">
                  {[...Array(8)].map((_, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 bg-gray-200 rounded-md p-2 animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {mainCategories.map((category) => (
                    <div
                      key={category.id}
                      className={`
                      flex items-center justify-between py-1.5 px-2 rounded-md cursor-pointer
                      transition-all duration-200 group
                      ${
                        hoveredCategory?.id === category.id
                          ? "bg-gold-main/15 text-gold-main"
                          : "hover:bg-white hover:shadow-sm text-foreground"
                      }
                    `}
                      onMouseEnter={() => setHoveredCategory(category)}
                    >
                      <Link
                        href={`/category/${category.slug}`}
                        className="flex-1 font-medium text-xs group-hover:text-gold-main transition-colors"
                        onClick={onClose}
                      >
                        {category.name}
                      </Link>
                      <ChevronRight
                        size={12}
                        className={`
                        transition-transform duration-200
                        ${
                          hoveredCategory?.id === category.id
                            ? "text-gold-main transform translate-x-1"
                            : "text-gray-400 group-hover:text-gold-main"
                        }
                      `}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right panel with products */}
          <div className="w-2/3 p-4 bg-white">
            {hoveredCategory ? (
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                  <h3 className="font-bold text-lg text-gray-800">
                    {hoveredCategory.name}
                  </h3>
                  <Link
                    href={`/category/${hoveredCategory.slug}`}
                    className="text-gold-main hover:text-gold-main/80 text-sm font-medium flex items-center gap-1 hover:underline transition-colors"
                    onClick={onClose}
                  >
                    {t('titleSeeAll')}
                    <ChevronRight size={14} />
                  </Link>
                </div>

                {productsLoading ? (
                  <div className="grid grid-cols-3 gap-3">
                    {[...Array(6)].map((_, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-2 animate-pulse"
                      >
                        <div className="w-full h-24 bg-gray-200 rounded mb-2" />
                        <div className="h-3 bg-gray-200 rounded mb-1" />
                        <div className="h-2 bg-gray-200 rounded w-2/3" />
                      </div>
                    ))}
                  </div>
                ) : products.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {products.slice(0, 6).map((product: Product) => (
                      <Link
                        key={product.id}
                        href={`/marketplace/${product.id}`}
                        className="border border-gray-200 rounded-lg p-3 hover:shadow-lg hover:border-gold-main/30 transition-all duration-200 group bg-white"
                        onClick={onClose}
                      >
                        <div className="relative w-full h-24 mb-2 overflow-hidden rounded">
                          <Image
                            src={
                              getBestImageUrl(
                                product.images?.[0] as ImageType,
                                "small"
                              ) || "/shop/1.jpg"
                            }
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                            onError={(e) => handleImageError(e, "/shop/1.jpg")}
                          />
                        </div>
                        <h4 className="font-medium text-xs text-gray-800 mb-1 line-clamp-2 group-hover:text-gold-main transition-colors">
                          {product.title}
                        </h4>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-gold-main">
                            {formatPrice(product.price, "$")}
                          </span>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Eye size={10} />
                            <span className="text-xs">
                              {product.viewsCount}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                      <LayoutGrid size={20} className="text-gray-400" />
                    </div>
                    <p className="text-sm font-medium">
                      {t('descriptionNotHaveProducts')}
                    </p>
                    <p className="text-xs mt-1">
                      {t('descriptionNotHaveProducts2')}
                    </p>
                  </div>
                )}

                {/* Дополнительная информация о категории */}
                {hoveredCategory.description && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-gold-main/5 to-gold-main/10 rounded-lg border-l-4 border-gold-main">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {hoveredCategory.description}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <div className="w-16 h-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <LayoutGrid size={28} className="text-gray-400" />
                </div>
                <p className="text-base font-medium mb-2">{t('descriptionNotification')}</p>
                <p className="text-sm text-center max-w-xs">
                  {t('descriptionNotification2')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CatalogDropdown;
