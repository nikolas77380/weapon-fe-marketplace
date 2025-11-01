"use client";

import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/lib/types";
import { useLocale, useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

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
  const t = useTranslations("AddProduct.addProductForm");
  const [localeKey, setLocaleKey] = useState(currentLocale);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Forcefully update the component when changing the locale
  useEffect(() => {
    setLocaleKey(currentLocale);
  }, [currentLocale]);

  // Focus input when select opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to ensure SelectContent is fully rendered
      const timeoutId = setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  // Reset search when select closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  const getCategoryDisplayName = useCallback(
    (category: Category) => {
      return currentLocale === "ua" && category.translate_ua
        ? category.translate_ua
        : category.name;
    },
    [currentLocale]
  );

  // Filter categories based on search query
  const filterCategoriesBySearch = useCallback(
    (categoriesToFilter: Category[]): Category[] => {
      if (!searchQuery.trim()) {
        return categoriesToFilter;
      }

      const query = searchQuery.toLowerCase().trim();
      const matchingCategoryIds = new Set<number>();

      const matchesSearch = (category: Category): boolean => {
        const name = category.name?.toLowerCase() || "";
        const translate = category.translate_ua?.toLowerCase() || "";
        return name.includes(query) || translate.includes(query);
      };

      // Find all categories that match the search
      const directlyMatchingCategories =
        categoriesToFilter.filter(matchesSearch);

      // For each matching category, add it and all its parent categories
      directlyMatchingCategories.forEach((category) => {
        matchingCategoryIds.add(category.id);

        // Add all parent categories for context
        let current = category;
        while (current.parent) {
          const parent = categoriesToFilter.find(
            (c) => c.id === current.parent?.id
          );
          if (parent) {
            matchingCategoryIds.add(parent.id);
            current = parent;
          } else {
            break;
          }
        }
      });

      // Return filtered categories maintaining original order
      return categoriesToFilter.filter((cat) =>
        matchingCategoryIds.has(cat.id)
      );
    },
    [searchQuery]
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

  const filteredCategories = useMemo(
    () => filterCategoriesBySearch(categories),
    [categories, filterCategoriesBySearch]
  );

  // Helper to calculate category level based on parent chain
  const getCategoryLevel = useCallback(
    (category: Category, allCategories: Category[]): number => {
      if (!category.parent) return 0;

      const parent = allCategories.find((c) => c.id === category.parent?.id);
      if (!parent) return 0;

      return getCategoryLevel(parent, allCategories) + 1;
    },
    []
  );

  const renderCategoriesHierarchy = useMemo(() => {
    const categoriesToRender = searchQuery.trim()
      ? filteredCategories
      : categories;

    if (!getMainCategories || !getSubCategories) {
      // Fallback to old logic if functions are not passed
      const mainCats = categoriesToRender.filter(
        (category) => !category.parent
      );
      const subCats = categoriesToRender.filter((category) => category.parent);
      const subSubCats = categoriesToRender.filter((category) => {
        const parent = subCats.find((c) => c.id === category.parent?.id);
        return parent !== undefined;
      });

      // If searching, render flat list with hierarchy indicators
      if (searchQuery.trim()) {
        return categoriesToRender
          .sort((a, b) => {
            // Sort: main categories first, then sub, then sub-sub
            const aLevel = getCategoryLevel(a, categoriesToRender);
            const bLevel = getCategoryLevel(b, categoriesToRender);
            if (aLevel !== bLevel) return aLevel - bLevel;
            return a.order - b.order;
          })
          .map((category) => {
            const hasChildren = categoriesToRender.some(
              (c) => c.parent?.id === category.id
            );
            const level = getCategoryLevel(category, categoriesToRender);

            if (level === 0) {
              return renderMainCategory(category);
            } else if (level === 1 && !hasChildren) {
              return (
                <SelectItem
                  key={category.id}
                  value={category.id.toString()}
                  className="pl-6 font-normal text-gray-800"
                >
                  {getCategoryDisplayName(category)}
                </SelectItem>
              );
            } else {
              return (
                <SelectItem
                  key={category.id}
                  value={category.id.toString()}
                  className="pl-12 font-normal text-sm text-gray-700"
                >
                  {getCategoryDisplayName(category)}
                </SelectItem>
              );
            }
          });
      }

      // Normal hierarchy rendering when not searching
      return mainCats
        .sort((a, b) => a.order - b.order)
        .map((category) => {
          const subCategories = subCats.filter(
            (c) => c.parent?.id === category.id
          );
          return (
            <React.Fragment key={category.id}>
              {renderMainCategory(category)}
              {subCategories.map((subCat) => {
                const subSubCategories = subSubCats.filter(
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

    // If searching, show filtered flat list
    if (searchQuery.trim()) {
      return filteredCategories
        .sort((a, b) => {
          const aLevel = getCategoryLevel(a, filteredCategories);
          const bLevel = getCategoryLevel(b, filteredCategories);
          if (aLevel !== bLevel) return aLevel - bLevel;
          return a.order - b.order;
        })
        .map((category) => {
          const hasChildren = filteredCategories.some(
            (c) => c.parent?.id === category.id
          );
          const level = getCategoryLevel(category, filteredCategories);

          if (level === 0) {
            return renderMainCategory(category);
          } else if (level === 1 && !hasChildren) {
            return (
              <SelectItem
                key={category.id}
                value={category.id.toString()}
                className="pl-6 font-normal text-gray-800"
              >
                {getCategoryDisplayName(category)}
              </SelectItem>
            );
          } else {
            return (
              <SelectItem
                key={category.id}
                value={category.id.toString()}
                className="pl-12 font-normal text-sm text-gray-700"
              >
                {getCategoryDisplayName(category)}
              </SelectItem>
            );
          }
        });
    }

    // Normal hierarchy rendering when not searching
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
    filteredCategories,
    getMainCategories,
    getSubCategories,
    renderMainCategory,
    renderSubCategory,
    renderSubSubCategory,
    searchQuery,
    getCategoryDisplayName,
    getCategoryLevel,
  ]);

  return (
    <Select
      onValueChange={onValueChange}
      value={value}
      key={`${value}-${localeKey}`}
      disabled={loading}
      onOpenChange={setIsOpen}
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
      <SelectContent
        onCloseAutoFocus={(e) => {
          // Prevent auto-focus on trigger when closing
          e.preventDefault();
        }}
        className="max-w-[calc(100vw-1rem)] sm:max-w-none min-w-[var(--radix-select-trigger-width)]"
        sideOffset={4}
        align="start"
        position="popper"
        collisionPadding={8}
      >
        {/* Search input inside SelectContent */}
        {!loading && !error && categories.length > 0 && (
          <div className="sticky top-0 z-10 bg-popover border-b border-border p-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                ref={inputRef}
                type="text"
                placeholder={t("placeholderCategorySearch")}
                value={searchQuery}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSearchQuery(newValue);
                }}
                onKeyDown={(e) => {
                  // For normal input characters (letters, numbers, symbols)
                  // Prevent Select from handling these events
                  if (
                    e.key.length === 1 ||
                    e.key === "Backspace" ||
                    e.key === "Delete"
                  ) {
                    e.stopPropagation();
                    // Allow default browser input handling
                    return;
                  }

                  // Handle Escape - clear search and let Select close
                  if (e.key === "Escape") {
                    setSearchQuery("");
                    // Let event bubble - Select will handle closing
                    return;
                  }

                  // For Arrow keys, Tab, Enter - don't stop propagation
                  // Let Select handle navigation and selection
                  // This allows arrow keys to navigate the list even when input is focused
                }}
                onMouseDown={(e) => {
                  // Prevent Select from closing when clicking input
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="pl-8 h-9 bg-background"
                autoComplete="off"
              />
            </div>
          </div>
        )}

        {/* Categories list */}
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
        ) : searchQuery.trim() && filteredCategories.length === 0 ? (
          <SelectItem
            value="no-results"
            disabled
            className="text-muted-foreground"
          >
            {t("noCategoriesFound")}
          </SelectItem>
        ) : (
          renderCategoriesHierarchy
        )}
      </SelectContent>
    </Select>
  );
};

export default CategorySelect;
