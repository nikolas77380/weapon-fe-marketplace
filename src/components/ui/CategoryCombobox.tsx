"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Category } from "@/lib/types";
import { useLocale, useTranslations } from "next-intl";
import { getCategoryPath } from "@/lib/categoryUtils";
import { useCallback, useMemo, useState } from "react";

interface CategoryComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  categories: Category[];
  loading: boolean;
  error: string | null;
  placeholder?: string;
  className?: string;
}

const CategoryCombobox: React.FC<CategoryComboboxProps> = ({
  value,
  onValueChange,
  categories,
  loading,
  error,
  placeholder = "Select category...",
  className = "w-full",
}) => {
  const currentLocale = useLocale();
  const t = useTranslations("AddProduct.addProductForm");
  const [open, setOpen] = useState(false);

  // Get leaf categories (categories without children)
  const leafCategories = useMemo(() => {
    return categories.filter((category) => {
      const hasChildren = categories.some((c) => c.parent?.id === category.id);
      return !hasChildren;
    });
  }, [categories]);

  // Get category display name
  const getCategoryDisplayName = useCallback(
    (category: Category) => {
      return currentLocale === "ua" && category.translate_ua
        ? category.translate_ua
        : category.name;
    },
    [currentLocale]
  );

  // Get full category path for display
  const getCategoryFullPath = useCallback(
    (category: Category) => {
      const path = getCategoryPath(categories, category.id);
      return path.map(getCategoryDisplayName).join(" > ");
    },
    [categories, getCategoryDisplayName]
  );

  // Get parent path (without the leaf category)
  const getCategoryParentPath = useCallback(
    (category: Category) => {
      const path = getCategoryPath(categories, category.id);
      if (path.length <= 1) return "";
      const parentPath = path.slice(0, -1);
      return parentPath.map(getCategoryDisplayName).join(" > ");
    },
    [categories, getCategoryDisplayName]
  );

  // Get selected category - only leaf category name for display
  const selectedCategory = useMemo(() => {
    if (!value) return null;
    const category = leafCategories.find((cat) => cat.id.toString() === value);
    return category ? getCategoryDisplayName(category) : null;
  }, [value, leafCategories, getCategoryDisplayName]);

  // Get selected category full path for tooltip
  const selectedCategoryFullPath = useMemo(() => {
    if (!value) return null;
    const category = leafCategories.find((cat) => cat.id.toString() === value);
    return category ? getCategoryFullPath(category) : null;
  }, [value, leafCategories, getCategoryFullPath]);

  if (loading) {
    return (
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={false}
        className={cn(className, "justify-between")}
        disabled
      >
        {placeholder}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  if (error) {
    return (
      <div className={cn(className, "text-sm text-red-500")}>
        {t("errorCategories") || error}
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          type="button"
          title={selectedCategoryFullPath || undefined}
          className={cn(
            className,
            "justify-between p-2.5 border-border min-w-0"
          )}
        >
          <span className="truncate text-left flex-1 min-w-0">
            {selectedCategory || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          className,
          "p-0 border-border max-w-[calc(100vw-2rem)] sm:max-w-none min-w-[var(--radix-popover-trigger-width)]"
        )}
        align="start"
        collisionPadding={8}
      >
        <Command>
          <CommandInput
            placeholder={
              t("placeholderCategorySearch") || "Search categories..."
            }
          />
          <CommandList>
            <CommandEmpty>
              {t("noCategoriesFound") || "No categories found."}
            </CommandEmpty>
            <CommandGroup>
              {leafCategories.map((category) => {
                const categoryName = getCategoryDisplayName(category);
                const parentPath = getCategoryParentPath(category);
                const fullPath = getCategoryFullPath(category);
                return (
                  <CommandItem
                    key={category.id}
                    value={`${fullPath} ${categoryName}`}
                    onSelect={() => {
                      onValueChange(
                        value === category.id.toString()
                          ? ""
                          : category.id.toString()
                      );
                      setOpen(false);
                    }}
                    className="min-w-0 flex flex-col items-start py-2.5"
                  >
                    <div className="flex items-center w-full min-w-0">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 shrink-0",
                          value === category.id.toString()
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <div className="flex-1 min-w-0 flex flex-col">
                        {parentPath && (
                          <span className="text-xs text-muted-foreground truncate">
                            {parentPath}
                          </span>
                        )}
                        <span className="font-medium truncate text-sm">
                          {categoryName}
                        </span>
                      </div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategoryCombobox;
