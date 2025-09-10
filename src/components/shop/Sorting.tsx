"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ViewModeToggle from "@/components/ui/ViewModeToggle";

interface SortingProps {
  onSortChange?: (sort: string) => void;
  selectedSort?: string;
  onViewChange?: (view: "grid" | "list") => void;
  selectedView?: "grid" | "list";
}

const Sorting = ({
  onSortChange,
  selectedSort,
  onViewChange,
  selectedView,
}: SortingProps) => {
  const activeTab = selectedView || "grid";

  const sortOptions = [
    { value: "id:desc", label: "Newest First" },
    { value: "id:asc", label: "Oldest First" },
    { value: "price:asc", label: "Price: Low to High" },
    { value: "price:desc", label: "Price: High to Low" },
    { value: "title:asc", label: "Name: A to Z" },
    { value: "title:desc", label: "Name: Z to A" },
  ];

  return (
    <div className="flex items-center gap-7.5">
      <Select value={selectedSort} onValueChange={onSortChange}>
        <SelectTrigger className="w-[200px] rounded-none shadow-none focus:ring-0 focus:ring-offset-0">
          <SelectValue placeholder="Newest First" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <ViewModeToggle
        viewMode={activeTab}
        onGridClick={() => onViewChange?.("grid")}
        onListClick={() => onViewChange?.("list")}
        showTitle={false}
      />
    </div>
  );
};

export default Sorting;
