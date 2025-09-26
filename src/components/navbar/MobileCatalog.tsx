"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, ArrowLeft } from "lucide-react";
import { Category } from "@/lib/types";
import { getChildCategories } from "@/lib/categoryUtils";
import { useTranslations, useLocale } from "next-intl";

interface MobileCatalogProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  allCategories: Category[];
}

interface MobileSubCategoriesProps {
  category: Category;
  allCategories: Category[];
  currentLocale: string;
  onBack: () => void;
  onClose: () => void;
}

const MobileSubCategories: React.FC<MobileSubCategoriesProps> = ({
  category,
  allCategories,
  currentLocale,
  onBack,
  onClose,
}) => {
  const getCategoryName = useCallback(
    (cat: Category) => {
      return currentLocale === "en" ? cat.name : cat.translate_ua || cat.name;
    },
    [currentLocale]
  );

  const subCategories = useMemo(
    () => getChildCategories(allCategories, category.id),
    [allCategories, category.id]
  );

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h2 className="font-semibold text-lg text-gray-800">
            {getCategoryName(category)}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <X size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4">
        {subCategories.map((subCategory) => {
          const subSubCategories = getChildCategories(
            allCategories,
            subCategory.id
          );

          return (
            <div key={subCategory.id} className="space-y-3">
              {/* Subcategory */}
              <Link
                href={`/category/${subCategory.slug}`}
                onClick={onClose}
                className="block font-semibold text-lg text-gray-800 hover:text-gold-main transition-colors py-2 border-b border-gray-100"
              >
                {getCategoryName(subCategory)}
              </Link>

              {/* Sub-sub categories */}
              {subSubCategories.length > 0 && (
                <div className="pl-4 space-y-2">
                  {subSubCategories.map((subSubCategory) => (
                    <Link
                      key={subSubCategory.id}
                      href={`/category/${subSubCategory.slug}`}
                      onClick={onClose}
                      className="block text-base text-gray-600 hover:text-gold-main transition-colors py-1"
                    >
                      {getCategoryName(subSubCategory)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MobileCatalog: React.FC<MobileCatalogProps> = ({
  isOpen,
  onClose,
  categories,
  allCategories,
}) => {
  const t = useTranslations("CatalogModal");
  const currentLocale = useLocale();
  const pathname = usePathname();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

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

  // Function to reset catalog state
  const resetCatalogState = useCallback(() => {
    setSelectedCategory(null);
  }, []);

  const prevPathnameRef = useRef(pathname);

  // Resetting the directory state when the route changes (when the user follows the link)
  useEffect(() => {
    if (pathname !== prevPathnameRef.current) {
      if (selectedCategory) {
        resetCatalogState();
      }
      prevPathnameRef.current = pathname;
    }
  }, [pathname, selectedCategory, resetCatalogState]);

  // Resetting the state when closing a directory
  useEffect(() => {
    if (!isOpen && selectedCategory) {
      resetCatalogState();
    }
  }, [isOpen, selectedCategory, resetCatalogState]);

  const getCategoryName = useCallback(
    (cat: Category) => {
      return currentLocale === "en" ? cat.name : cat.translate_ua || cat.name;
    },
    [currentLocale]
  );

  const handleCategoryClick = useCallback(
    (category: Category) => {
      const subCategories = getChildCategories(allCategories, category.id);
      if (subCategories.length > 0) {
        setSelectedCategory(category);
      }
    },
    [allCategories]
  );

  const handleBack = useCallback(() => {
    resetCatalogState();
  }, [resetCatalogState]);

  // Optimized category list
  const categoryItems = useMemo(
    () =>
      categories.map((category) => {
        const subCategories = getChildCategories(allCategories, category.id);
        const hasSubCategories = subCategories.length > 0;

        return (
          <div
            key={category.id}
            className="border-b border-gray-100 last:border-b-0"
          >
            {hasSubCategories ? (
              <button
                onClick={() => handleCategoryClick(category)}
                className="w-full flex items-center justify-between py-4 px-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {category.icon?.url && (
                    <Image
                      src={category.icon.url}
                      alt={category.name}
                      width={24}
                      height={24}
                      className="flex-shrink-0"
                    />
                  )}
                  <span className="font-medium text-base text-gray-800">
                    {getCategoryName(category)}
                  </span>
                </div>
                <ArrowLeft
                  size={16}
                  className="text-gray-400 transform rotate-180"
                />
              </button>
            ) : (
              <Link
                href={`/category/${category.slug}`}
                onClick={onClose}
                className="w-full flex items-center gap-3 py-4 px-4 hover:bg-gray-50 transition-colors"
              >
                {category.icon?.url && (
                  <Image
                    src={category.icon.url}
                    alt={category.name}
                    width={24}
                    height={24}
                    className="flex-shrink-0"
                  />
                )}
                <span className="font-medium text-base text-gray-800">
                  {getCategoryName(category)}
                </span>
              </Link>
            )}
          </div>
        );
      }),
    [categories, allCategories, getCategoryName, handleCategoryClick, onClose]
  );

  if (!isOpen) return null;

  // If a category is selected, show subcategories
  if (selectedCategory) {
    return (
      <MobileSubCategories
        category={selectedCategory}
        allCategories={allCategories}
        currentLocale={currentLocale}
        onBack={handleBack}
        onClose={onClose}
      />
    );
  }

  // Showing the main categories
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="font-semibold text-lg text-gray-800">{t("title")}</h1>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <X size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="divide-y divide-gray-100">{categoryItems}</div>
      </div>
    </div>
  );
};

export default MobileCatalog;
