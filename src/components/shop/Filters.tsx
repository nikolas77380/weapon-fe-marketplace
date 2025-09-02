"use client";

import { quickFilters } from "@/data/leftFilters";
import { SlidersHorizontal } from "lucide-react";
import React from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import PriceRange from "./filters/PriceRange";
import { Category } from "@/lib/types";
import { Button } from "../ui/button";

interface FiltersProps {
  onPriceChange: (min: number, max: number) => void;
  onCategoryChange: (categoryId: number | null) => void;
  onClearAll: () => void;
  availableCategories: Category[];
  selectedCategoryId: number | null;
  priceRange: { min: number; max: number };
}

const Filters = ({
  onPriceChange,
  onCategoryChange,
  onClearAll,
  availableCategories,
  selectedCategoryId,
  priceRange,
}: FiltersProps) => {
  const handleCategorySelect = (value: string) => {
    if (value === "all") {
      onCategoryChange(null);
    } else {
      onCategoryChange(Number(value));
    }
  };

  return (
    <div className="border border-[#D3D3D3] rounded-lg pl-10 pr-6 pt-5.5 flex flex-col gap-5.5">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={20} className="text-black" />
          <h2 className="text-sm font-medium font-roboto">Filters</h2>
        </div>
        <Button variant="ghost" className="py-2" onClick={onClearAll}>
          Clear All
        </Button>
      </div>

      <div className="flex flex-col border-b border-[#D3D3D3] pb-3.5">
        <h2 className="text-sm font-medium font-roboto">Quick filters</h2>
        <div className="flex flex-col gap-2 mt-3">
          {quickFilters.map((filter) => (
            <div key={filter.id} className="flex items-center gap-3">
              <Checkbox id="filter" />
              <Label htmlFor="filter" className="text-[#1E1E1E]/80">
                {filter.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="border-b border-[#D3D3D3] pb-9">
        <h2 className="text-sm font-medium font-roboto">Category</h2>
        <div className="mt-3">
          <Select
            onValueChange={handleCategorySelect}
            value={selectedCategoryId?.toString() || "all"}
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categories</SelectLabel>
                <SelectItem value="all">All Categories</SelectItem>
                {availableCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-b border-[#D3D3D3] pb-9">
        <h2 className="text-sm font-medium font-roboto">Condition</h2>
        <div className="mt-3">
          <Select>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="All Conditions" />
            </SelectTrigger>
          </Select>
        </div>
        <h2 className="text-sm font-medium font-roboto mt-6.5">Availability</h2>
        <div className="mt-3">
          <Select>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="All Availability" />
            </SelectTrigger>
          </Select>
        </div>
      </div>

      <PriceRange
        onPriceChange={onPriceChange}
        initialMin={priceRange.min}
        initialMax={priceRange.max}
        minLimit={1}
        maxLimit={500000}
      />

      <div>
        <h2 className="text-sm font-medium font-roboto mt-6.5">Location</h2>
        <div className="mt-3">
          <Select>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default Filters;
