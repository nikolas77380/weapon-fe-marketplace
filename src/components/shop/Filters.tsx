"use client";

import { quickFilters } from "@/data/leftFilters";
import React from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import PriceRange from "./filters/PriceRange";
import { Category } from "@/lib/types";
import { Button } from "../ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

interface FiltersProps {
  onPriceChange: (min: number, max: number) => void;
  onCategoryChange: (categoryId: number | null) => void;
  onClearAll: () => void;
  availableCategories: Category[];
  selectedCategoryId: number | null;
  priceRange: { min: number; max: number };
  categoryCounts?: { [key: number]: number };
}

const Filters = ({
  onPriceChange,
  onCategoryChange,
  onClearAll,
  availableCategories,
  selectedCategoryId,
  priceRange,
  categoryCounts = {},
}: FiltersProps) => {
  return (
    <div className="border border-border-foreground h-fit p-5 flex flex-col gap-3.5">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-medium">Filter</h2>
        </div>
        <Button
          variant="ghost"
          className="py-2 hover:bg-primary-foreground duration-300 transition-all rounded-none"
          onClick={onClearAll}
        >
          Clear All
        </Button>
      </div>
      {/* Buttons selected filters */}
      {/* <div></div> */}

      <div className="flex flex-col border-b border-border-foreground pb-3.5">
        <h2 className="font-medium">Quick filters</h2>
        <div className="flex flex-col gap-2 mt-3">
          {quickFilters.map((filter) => (
            <div key={filter.id} className="flex items-center gap-3">
              <Checkbox id="filter" />
              <Label htmlFor="filter" className="text-sm font-light">
                {filter.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="border-b border-border-foreground pb-3.5">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="category" className="border-none">
            <AccordionTrigger className="py-0 hover:no-underline">
              <h2 className="text-sm font-medium font-roboto">Category</h2>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <div className="flex flex-col gap-2">
                {availableCategories.map((category) => (
                  <div key={category.id} className="flex items-center gap-3">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategoryId === category.id}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onCategoryChange(category.id);
                        } else {
                          onCategoryChange(null);
                        }
                      }}
                      className="data-[state=checked]:bg-gold-main data-[state=checked]:border-gold-main data-[state=checked]:text-white rounded-none"
                    />
                    <Label
                      htmlFor={`category-${category.id}`}
                      className={`text-sm font-light flex-1 cursor-pointer ${
                        selectedCategoryId === category.id
                          ? "text-foreground"
                          : "text-foreground/80"
                      }`}
                    >
                      {category.name}
                    </Label>
                    <span
                      className={`text-sm ${
                        selectedCategoryId === category.id
                          ? "text-gray-500"
                          : "text-gray-500"
                      }`}
                    >
                      ({categoryCounts[category.id] || 0})
                    </span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="border-b border-border-foreground pb-3.5">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="condition" className="border-none">
            <AccordionTrigger className="py-0 hover:no-underline">
              <h2 className="text-sm font-medium font-roboto">Condition</h2>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <div className="flex flex-col gap-2">
                {[
                  { id: "new", name: "New", count: 15 },
                  { id: "used", name: "Used", count: 8 },
                  { id: "refurbished", name: "Refurbished", count: 3 },
                ].map((condition) => (
                  <div key={condition.id} className="flex items-center gap-3">
                    <Checkbox
                      id={`condition-${condition.id}`}
                      className="data-[state=checked]:bg-gold-main data-[state=checked]:border-gold-main data-[state=checked]:text-white rounded-none"
                    />
                    <Label
                      htmlFor={`condition-${condition.id}`}
                      className="text-sm font-light flex-1 cursor-pointer text-foreground/80"
                    >
                      {condition.name}
                    </Label>
                    <span className="text-sm text-gray-500">
                      ({condition.count})
                    </span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="border-b border-border-foreground pb-3.5">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="availability" className="border-none">
            <AccordionTrigger className="py-0 hover:no-underline">
              <h2 className="text-sm font-medium font-roboto">Availability</h2>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <div className="flex flex-col gap-2">
                {[
                  { id: "available", name: "Available", count: 20 },
                  { id: "reserved", name: "Reserved", count: 5 },
                  { id: "sold", name: "Sold", count: 1 },
                ].map((availability) => (
                  <div
                    key={availability.id}
                    className="flex items-center gap-3"
                  >
                    <Checkbox
                      id={`availability-${availability.id}`}
                      className="data-[state=checked]:bg-gold-main data-[state=checked]:border-gold-main data-[state=checked]:text-white rounded-none"
                    />
                    <Label
                      htmlFor={`availability-${availability.id}`}
                      className="text-sm font-light flex-1 cursor-pointer text-foreground/80"
                    >
                      {availability.name}
                    </Label>
                    <span className="text-sm text-gray-500">
                      ({availability.count})
                    </span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <PriceRange
        onPriceChange={onPriceChange}
        initialMin={priceRange.min}
        initialMax={priceRange.max}
        minLimit={1}
        maxLimit={500000}
      />

      {/* <div>
        <h2 className="text-sm font-medium font-roboto mt-6.5">Location</h2>
        <div className="mt-3">
          <Select defaultValue="all">
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div> */}
    </div>
  );
};

export default Filters;
