"use client";

import React, { useState, useEffect, useRef } from "react";
import { useCategories } from "@/hooks/useCategories";
import { Category } from "@/lib/types";
import Link from "next/link";
import { ChevronRight, Menu } from "lucide-react";
import { getChildCategories } from "@/lib/categoryUtils";
import { useTranslations, useLocale } from "next-intl";

interface CatalogDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DesktopCategoriesDisplayProps {
  categories: Category[];
  allCategories: Category[];
  currentLocale: string;
  onClose: () => void;
  t: (key: string) => string;
}

const DesktopCategoriesDisplay: React.FC<DesktopCategoriesDisplayProps> = ({
  categories,
  allCategories,
  currentLocale,
  onClose,
  t,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);

  const getCategoryName = (cat: Category) => {
    return currentLocale === "en" ? cat.name : cat.translate_ua || cat.name;
  };

  return (
    <div className="flex h-[450px]">
      {/* Left side - main categories */}
      <div className="w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto catalog-scroll">
        <div className="p-3">
          <div className="space-y-1">
            {categories.map((category) => {
              const subCategories = getChildCategories(
                allCategories,
                category.id
              );

              return (
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
                  onMouseLeave={() =>
                    subCategories.length === 0 && setHoveredCategory(null)
                  }
                >
                  <Link
                    href={`/category/${category.slug}`}
                    onClick={onClose}
                    className="flex-1 font-medium text-sm group-hover:text-gold-main transition-colors"
                  >
                    {getCategoryName(category)}
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
              );
            })}
          </div>
        </div>
      </div>

      {/* Right side - sub categories */}
      <div className="w-2/3 bg-white overflow-y-auto scrollbar-hide">
        <div className="p-4">
          {hoveredCategory ? (
            <div>
              <div className="mb-4 border-b border-gray-100 pb-3">
                <h3 className="font-bold text-lg text-gray-800">
                  {getCategoryName(hoveredCategory)}
                </h3>
              </div>

              <div className="space-y-3">
                {getChildCategories(allCategories, hoveredCategory.id).map(
                  (subCategory) => {
                    const subSubCategories = getChildCategories(
                      allCategories,
                      subCategory.id
                    );

                    return (
                      <div key={subCategory.id} className="space-y-2">
                        {/* Sub-category */}
                        <Link
                          href={`/category/${subCategory.slug}`}
                          onClick={onClose}
                          className="block font-medium text-base hover:text-gold-main transition-colors py-1 px-2 rounded-md hover:bg-accent/30"
                        >
                          {getCategoryName(subCategory)}
                        </Link>

                        {/* Sub-sub-categories */}
                        {subSubCategories.length > 0 && (
                          <div className="pl-4 space-y-1 border-l border-gray-200">
                            {subSubCategories.map((subSubCategory) => (
                              <Link
                                key={subSubCategory.id}
                                href={`/category/${subSubCategory.slug}`}
                                onClick={onClose}
                                className="block text-sm text-gray-600 hover:text-gold-main transition-colors py-1 px-2 rounded-md hover:bg-accent/20"
                              >
                                {getCategoryName(subSubCategory)}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>

              {/* Category description */}
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
                <Menu size={32} className="text-gray-300" />
              </div>
              <p className="text-base font-medium mb-2">
                {t("descriptionNotification")}
              </p>
              <p className="text-sm text-center max-w-xs">
                {t("descriptionNotification2")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CatalogDropdown = ({ isOpen, onClose }: CatalogDropdownProps) => {
  const t = useTranslations("CatalogModal");
  const currentLocale = useLocale();

  const {
    getMainCategories,
    categories,
    loading: categoriesLoading,
  } = useCategories();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const mainCategories = getMainCategories();

  // Block body scrolling when the directory is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 z-40 animate-in fade-in-0 duration-200"
        onClick={onClose}
      />

      <div
        ref={dropdownRef}
        className="absolute top-full left-0 z-50 bg-white border border-gray-200 shadow-2xl w-[900px] max-h-[80vh] rounded-b-lg animate-in fade-in-0 slide-in-from-top-2 duration-200"
        style={{ marginTop: "10px" }}
      >
        <div className="p-3 border-b border-gray-200">
          <h3 className="font-semibold text-sm text-gray-700">{t("title")}</h3>
        </div>

        {categoriesLoading ? (
          <div className="flex h-[450px]">
            <div className="w-1/3 bg-gray-50 border-r border-gray-200 p-3">
              <div className="space-y-1">
                {[...Array(8)].map((_, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 bg-gray-200 rounded-md p-2 animate-pulse"
                  />
                ))}
              </div>
            </div>
            <div className="w-2/3 bg-white p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4" />
                <div className="space-y-2">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="h-3 bg-gray-200 rounded" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <DesktopCategoriesDisplay
            categories={mainCategories}
            allCategories={categories}
            currentLocale={currentLocale}
            onClose={onClose}
            t={t}
          />
        )}
      </div>
    </>
  );
};

export default CatalogDropdown;
