"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/lib/types";

interface CategorySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  categories: Category[];
  loading: boolean;
  error: string | null;
  placeholder?: string;
  className?: string;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  value,
  onValueChange,
  categories,
  loading,
  error,
  placeholder = "Select Category",
  className = "w-1/2",
}) => {
  const renderCategoryItem = (category: Category, level: number = 0) => {
    const indent = "  ".repeat(level);
    // Убеждаемся, что у категории есть валидное имя
    const categoryName = category.name || `Category ${category.id}`;
    return (
      <SelectItem key={category.id} value={categoryName}>
        {indent}
        {categoryName}
      </SelectItem>
    );
  };

  const renderCategoriesHierarchy = (
    categories: Category[],
    level: number = 0
  ) => {
    return categories.map((category) => {
      const children = categories.filter((c) => c.parent?.id === category.id);

      return (
        <React.Fragment key={category.id}>
          {renderCategoryItem(category, level)}
          {children.length > 0 &&
            renderCategoriesHierarchy(children, level + 1)}
        </React.Fragment>
      );
    });
  };

  const mainCategories = categories.filter((category) => !category.parent);

  return (
    <Select
      onValueChange={onValueChange}
      value={value}
      key={value}
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
        ) : mainCategories.length === 0 ? (
          <SelectItem value="no-categories" disabled>
            No categories available
          </SelectItem>
        ) : (
          renderCategoriesHierarchy(mainCategories)
        )}
      </SelectContent>
    </Select>
  );
};

export default CategorySelect;
