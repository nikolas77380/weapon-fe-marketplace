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
import { useTranslations, useLocale } from "next-intl";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface FiltersProps {
  onPriceChange: (min: number, max: number) => void;
  onCategoryChange: (categoryId: number | null) => void;
  onSubcategoryChange: (subcategoryId: number | null) => void;
  onClearAll: () => void;
  availableCategories: Category[];
  childCategories: Category[];
  selectedCategoryId: number | null;
  selectedSubcategoryId: number | null;
  priceRange: { min: number; max: number };
  categoryCounts?: { [key: number]: number };
  hideCategoryFilter?: boolean;
  isMobile?: boolean;
  elasticFilters?: any; // Elasticsearch aggregations data
}

const Filters = ({
  onPriceChange,
  onCategoryChange,
  onSubcategoryChange,
  onClearAll,
  availableCategories,
  childCategories,
  selectedCategoryId,
  selectedSubcategoryId,
  priceRange,
  categoryCounts = {},
  hideCategoryFilter = false,
  isMobile = false,
  elasticFilters,
}: FiltersProps) => {
  const t = useTranslations("CompanyDetail.tabProducts");
  const currentLocale = useLocale();

  const getCategoryName = (category: Category) => {
    return currentLocale === "en"
      ? category.name
      : category.translate_ua || category.name;
  };

  return (
    <div
      className={`${
        isMobile
          ? "border-0"
          : "border-r border-t border-b border-border-foreground rounded-sm"
      } h-fit ${isMobile ? "p-0" : "p-5"} flex flex-col gap-3.5`}
    >
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-medium">{t("titleFilter")}</h2>
        </div>
        <Button
          variant="ghost"
          className="py-2 hover:bg-primary-foreground duration-300 transition-all rounded-none"
          onClick={onClearAll}
        >
          {t("buttonClearAll")}
        </Button>
      </div>
      {/* Buttons selected filters */}
      {/* <div></div> */}

      <div className="flex flex-col border-b border-border-foreground pb-3.5">
        <h2 className="font-medium">{t("titleQuickFilters")}</h2>
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

      {/* Elasticsearch Tags Filter */}
      {elasticFilters?.tags && elasticFilters.tags.length > 0 && (
        <div className="border-b border-border-foreground pb-3.5">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="tags" className="border-none">
              <AccordionTrigger className="py-0 hover:no-underline">
                <h2 className="text-sm font-medium font-roboto">Tags</h2>
              </AccordionTrigger>
              <AccordionContent className="pt-3">
                <div className="flex flex-col gap-2">
                  {elasticFilters.tags.map((tag: any) => (
                    <div key={tag.key} className="flex items-center gap-3">
                      <Checkbox id={`tag-${tag.key}`} />
                      <Label
                        htmlFor={`tag-${tag.key}`}
                        className="text-sm font-light"
                      >
                        {tag.key} ({tag.doc_count})
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}

      {/* Elasticsearch Categories Filter */}
      {elasticFilters?.categories && elasticFilters.categories.length > 0 && (
        <div className="border-b border-border-foreground pb-3.5">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="elastic-categories" className="border-none">
              <AccordionTrigger className="py-0 hover:no-underline">
                <h2 className="text-sm font-medium font-roboto">
                  Subcategories
                </h2>
              </AccordionTrigger>
              <AccordionContent className="pt-3">
                <div className="flex flex-col gap-2">
                  {elasticFilters.categories.map((category: any) => (
                    <div key={category.key} className="flex items-center gap-3">
                      <Checkbox id={`elastic-category-${category.key}`} />
                      <Label
                        htmlFor={`elastic-category-${category.key}`}
                        className="text-sm font-light"
                      >
                        {category.key} ({category.doc_count})
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}

      {/* Elasticsearch Availability Filter */}
      {elasticFilters?.availability &&
        elasticFilters.availability.length > 0 && (
          <div className="border-b border-border-foreground pb-3.5">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                value="elastic-availability"
                className="border-none"
              >
                <AccordionTrigger className="py-0 hover:no-underline">
                  <h2 className="text-sm font-medium font-roboto">
                    Availability
                  </h2>
                </AccordionTrigger>
                <AccordionContent className="pt-3">
                  <div className="flex flex-col gap-2">
                    {elasticFilters.availability.map((item: any) => (
                      <div key={item.key} className="flex items-center gap-3">
                        <Checkbox id={`elastic-availability-${item.key}`} />
                        <Label
                          htmlFor={`elastic-availability-${item.key}`}
                          className="text-sm font-light"
                        >
                          {item.key} ({item.doc_count})
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

      {/* Elasticsearch Condition Filter */}
      {elasticFilters?.condition && elasticFilters.condition.length > 0 && (
        <div className="border-b border-border-foreground pb-3.5">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="elastic-condition" className="border-none">
              <AccordionTrigger className="py-0 hover:no-underline">
                <h2 className="text-sm font-medium font-roboto">
                  {t("titleCondition")}
                </h2>
              </AccordionTrigger>
              <AccordionContent className="pt-3">
                <div className="flex flex-col gap-2">
                  {elasticFilters.condition.map((item: any) => (
                    <div key={item.key} className="flex items-center gap-3">
                      <Checkbox id={`elastic-condition-${item.key}`} />
                      <Label
                        htmlFor={`elastic-condition-${item.key}`}
                        className="text-sm font-light"
                      >
                        {item.key} ({item.doc_count})
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}

      {!hideCategoryFilter && (
        <div className="border-b border-border-foreground pb-3.5">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="category" className="border-none">
              <AccordionTrigger className="py-0 hover:no-underline">
                <h2 className="text-sm font-medium font-roboto">
                  {t("titleCategory")}
                </h2>
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
                        {getCategoryName(category)}
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
      )}

      {childCategories.length > 0 &&
        childCategories.filter(
          (subcategory) => (categoryCounts[subcategory.id] || 0) > 0
        ).length > 0 && (
          <div className="border-b border-border-foreground pb-3.5">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="subcategory" className="border-none">
                <AccordionTrigger className="py-0 hover:no-underline">
                  <h2 className="text-sm font-medium font-roboto">
                    {t("titleSubcategory")}
                  </h2>
                </AccordionTrigger>
                <AccordionContent className="pt-3">
                  <TooltipProvider>
                    <div className="flex flex-col gap-2">
                      {childCategories
                        .filter(
                          (subcategory) =>
                            (categoryCounts[subcategory.id] || 0) > 0
                        )
                        .map((subcategory) => (
                          <div
                            key={subcategory.id}
                            className="flex items-center gap-3"
                          >
                            <Checkbox
                              id={`subcategory-${subcategory.id}`}
                              checked={selectedSubcategoryId === subcategory.id}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  onSubcategoryChange(subcategory.id);
                                } else {
                                  onSubcategoryChange(null);
                                }
                              }}
                              className="data-[state=checked]:bg-gold-main data-[state=checked]:border-gold-main data-[state=checked]:text-white rounded-none"
                            />
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Label
                                  htmlFor={`subcategory-${subcategory.id}`}
                                  className={`text-sm font-light cursor-pointer truncate max-w-[150px] block ${
                                    selectedSubcategoryId === subcategory.id
                                      ? "text-foreground"
                                      : "text-foreground/80"
                                  }`}
                                >
                                  {getCategoryName(subcategory)}
                                </Label>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                <p>{getCategoryName(subcategory)}</p>
                              </TooltipContent>
                            </Tooltip>
                            <span
                              className={`text-sm flex-shrink-0 ${
                                selectedSubcategoryId === subcategory.id
                                  ? "text-gray-500"
                                  : "text-gray-500"
                              }`}
                            >
                              ({categoryCounts[subcategory.id] || 0})
                            </span>
                          </div>
                        ))}
                    </div>
                  </TooltipProvider>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

      <div className="border-b border-border-foreground pb-3.5">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="availability" className="border-none">
            <AccordionTrigger className="py-0 hover:no-underline">
              <h2 className="text-sm font-medium font-roboto">
                {t("titleAvailability")}
              </h2>
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
        minLimit={priceRange.min}
        maxLimit={priceRange.max}
        isMobile={isMobile}
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
