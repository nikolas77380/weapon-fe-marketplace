"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/lib/types";
import { useLocale } from "next-intl";

interface CategorySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  categories: Category[];
  loading: boolean;
  error: string | null;
  placeholder?: string;
  className?: string;
  getMainCategories?: () => Category[];
  getSubCategories?: (parentId: number) => Category[];
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  value,
  onValueChange,
  categories,
  loading,
  error,
  placeholder = "Select Category",
  className = "w-1/2",
  getMainCategories,
  getSubCategories,
}) => {
  const currentLocale = useLocale();
  const [localeKey, setLocaleKey] = useState(currentLocale);

  // Forcefully update the component when changing the locale
  useEffect(() => {
    setLocaleKey(currentLocale);
  }, [currentLocale]);

  const getCategoryDisplayName = useCallback(
    (category: Category) => {
      return currentLocale === "ua" && category.translate_ua
        ? category.translate_ua
        : category.name;
    },
    [currentLocale]
  );

  const renderMainCategory = useCallback(
    (category: Category) => {
      return (
        <SelectItem
          key={`main-${category.id}`}
          value={`main-${category.id}`}
          disabled={true}
          className="font-semibold text-gray-900 cursor-not-allowed"
        >
          {getCategoryDisplayName(category)}
        </SelectItem>
      );
    },
    [getCategoryDisplayName]
  );

  const renderSubCategory = useCallback(
    (category: Category) => {
      // Checking if a subcategory has its own children (third level)
      const hasChildren = categories.some((c) => c.parent?.id === category.id);

      return (
        <SelectItem
          key={category.id}
          value={category.id.toString()}
          disabled={hasChildren}
          className={
            hasChildren
              ? "pl-6 font-normal text-gray-600 cursor-not-allowed"
              : "pl-6 font-normal text-gray-800"
          }
        >
          {getCategoryDisplayName(category)}
        </SelectItem>
      );
    },
    [categories, getCategoryDisplayName]
  );

  const renderSubSubCategory = useCallback(
    (category: Category) => {
      return (
        <SelectItem
          key={category.id}
          value={category.id.toString()}
          className="pl-12 font-normal text-sm text-gray-700"
        >
          {getCategoryDisplayName(category)}
        </SelectItem>
      );
    },
    [getCategoryDisplayName]
  );

  const renderCategoriesHierarchy = useMemo(() => {
    if (!getMainCategories || !getSubCategories) {
      // Fallback to old logic if functions are not passed
      return categories
        .filter((category) => !category.parent)
        .sort((a, b) => a.order - b.order)
        .map((category) => {
          const subCategories = categories.filter(
            (c) => c.parent?.id === category.id
          );
          return (
            <React.Fragment key={category.id}>
              {renderMainCategory(category)}
              {subCategories.map((subCat) => {
                const subSubCategories = categories.filter(
                  (c) => c.parent?.id === subCat.id
                );
                return (
                  <React.Fragment key={subCat.id}>
                    {renderSubCategory(subCat)}
                    {subSubCategories.map((subSubCat) =>
                      renderSubSubCategory(subSubCat)
                    )}
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          );
        });
    }

    const mainCategories = getMainCategories().sort(
      (a, b) => a.order - b.order
    );

    return mainCategories.map((mainCategory) => {
      const subCategories = getSubCategories(mainCategory.id).sort(
        (a, b) => a.order - b.order
      );

      return (
        <React.Fragment key={mainCategory.id}>
          {renderMainCategory(mainCategory)}
          {subCategories.map((subCategory) => {
            const subSubCategories = getSubCategories(subCategory.id).sort(
              (a, b) => a.order - b.order
            );

            return (
              <React.Fragment key={subCategory.id}>
                {renderSubCategory(subCategory)}
                {subSubCategories.map((subSubCategory) =>
                  renderSubSubCategory(subSubCategory)
                )}
              </React.Fragment>
            );
          })}
        </React.Fragment>
      );
    });
  }, [
    categories,
    getMainCategories,
    getSubCategories,
    renderMainCategory,
    renderSubCategory,
    renderSubSubCategory,
  ]);

  return (
    <Select
      onValueChange={onValueChange}
      value={value}
      key={`${value}-${localeKey}`}
      disabled={loading}
    >
      <SelectTrigger className={className}>
        <SelectValue
          placeholder={
            loading
              ? "Loading categories..."
              : error
              ? "Error loading categories"
              : placeholder
          }
        />
      </SelectTrigger>
      <SelectContent>
        {loading ? (
          <SelectItem value="loading" disabled>
            Loading categories...
          </SelectItem>
        ) : error ? (
          <SelectItem value="error" disabled>
            Error loading categories
          </SelectItem>
        ) : categories.length === 0 ? (
          <SelectItem value="no-categories" disabled>
            No categories available
          </SelectItem>
        ) : (
          renderCategoriesHierarchy
        )}
      </SelectContent>
    </Select>
  );
};

export default CategorySelect;
