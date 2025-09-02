"use client";

import { LayoutGrid, List } from "lucide-react";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <div className="flex items-center gap-22">
      <Select value={selectedSort} onValueChange={onSortChange}>
        <SelectTrigger className="w-[200px] border-transparent shadow-none focus:ring-0 focus:ring-offset-0">
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
      <div className="flex items-center gap-1">
        <div
          onClick={() => onViewChange?.("grid")}
          className={`p-2 rounded-md cursor-pointer ${
            activeTab === "grid" ? "bg-black" : "bg-[#D9D9D9]"
          }`}
        >
          <LayoutGrid
            size={20}
            className={activeTab === "grid" ? "text-white" : "text-black"}
          />
        </div>
        <div
          onClick={() => onViewChange?.("list")}
          className={`p-2 rounded-md cursor-pointer ${
            activeTab === "list" ? "bg-black" : "bg-[#D9D9D9]"
          }`}
        >
          <List
            size={20}
            className={activeTab === "list" ? "text-white" : "text-black"}
          />
        </div>
      </div>
    </div>
  );
};

export default Sorting;
