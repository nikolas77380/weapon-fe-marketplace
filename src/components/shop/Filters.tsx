"use client";

import { quickFilters } from "@/data/leftFilters";
import React, { useState } from "react";
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

interface FiltersProps {
  onPriceChange: (min: number, max: number) => void;
  onSubcategoryChange: (subcategoryId: number | null) => void;
  onAvailabilityChange: (availability: string[]) => void;
  onConditionChange: (condition: string[]) => void;
  onCategoriesChange: (categories: string[]) => void;
  onClearAll: () => void;
  availableCategories: Category[];
  selectedSubcategoryId: number | null;
  selectedAvailability: string[];
  selectedCondition: string[];
  selectedCategories: string[];
  priceRange: { min: number; max: number };
  selectedPriceRange?: { min: number; max: number };
  categories?: { [key: number]: number };
  hideCategoryFilter?: boolean;
  isMobile?: boolean;
  elasticFilters?: any; // Elasticsearch aggregations data
  isDisabled?: boolean;
}

const Filters = ({
  onPriceChange,
  onSubcategoryChange,
  onAvailabilityChange,
  onConditionChange,
  onCategoriesChange,
  onClearAll,
  availableCategories,
  selectedSubcategoryId,
  selectedAvailability,
  selectedCondition,
  selectedCategories,
  priceRange,
  selectedPriceRange,
  categories = {},
  hideCategoryFilter = false,
  isMobile = false,
  elasticFilters,
  isDisabled = false,
}: FiltersProps) => {
  const t = useTranslations("CompanyDetail.tabProducts");
  const currentLocale = useLocale();

  // Состояние для отслеживания открытых аккордеонов
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);

  const getCategoryName = (category: Category) => {
    return currentLocale === "en"
      ? category.name
      : category.translate_ua || category.name;
  };

  const prepareConditionName = (condition: string) => {
    if (currentLocale === "en") {
      return condition === "new"
        ? "New"
        : condition === "used"
        ? "Used"
        : condition;
    } else if (currentLocale === "ua") {
      return condition === "new"
        ? "Новый"
        : condition === "used"
        ? "Б/У"
        : condition;
    }
  };

  const prepareAvailabilityName = (availability: string) => {
    if (currentLocale === "en") {
      return availability === "available"
        ? "Available"
        : availability === "preorder"
        ? "Preorder"
        : availability === "unavailable"
        ? "Unavailable"
        : availability;
    } else if (currentLocale === "ua") {
      return availability === "available"
        ? "Доступний"
        : availability === "preorder"
        ? "Презамовлення"
        : availability === "unavailable"
        ? "Недоступний"
        : availability;
    }
  };

  console.log(elasticFilters);

  return (
    <div
      className={`${
        isMobile
          ? "border-0"
          : "border-r border-t border-b border-border-foreground rounded-sm"
      } h-fit ${
        isMobile ? "p-0" : "p-5"
      } flex flex-col gap-3.5 w-80 max-w-80 min-w-80`}
    >
      <div className="flex justify-between mb-4 w-full min-w-0 lg:min-w-50">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-medium">{t("titleFilter")}</h2>
        </div>
        <Button
          variant="outline"
          className="py-1 px-1.5 border-gold-main hover:opacity-80 duration-300 transition-all rounded-sm"
          onClick={onClearAll}
        >
          {t("buttonClearAll")}
        </Button>
      </div>
      {/* Buttons selected filters */}
      {/* <div></div> */}

      {/* <div className="flex flex-col border-b border-border-foreground pb-3.5">
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
      </div> */}

      {/* Elasticsearch Tags Filter */}
      {elasticFilters?.tags && elasticFilters.tags.length > 0 && (
        <div className="border-b border-border-foreground pb-3.5">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            value={openAccordions.includes("tags") ? "tags" : ""}
            onValueChange={(value) => {
              setOpenAccordions((prev) =>
                prev.includes(value)
                  ? prev.filter((item) => item !== value)
                  : [...prev, value]
              );
            }}
          >
            <AccordionItem value="tags" className="border-none">
              <AccordionTrigger className="py-0 hover:no-underline">
                <h2 className="text-sm font-medium font-roboto">
                  {t("titleTags")}
                </h2>
              </AccordionTrigger>
              <AccordionContent className="pt-3">
                <div className="flex flex-col gap-2">
                  {elasticFilters.tags.map((tag: any) => (
                    <div key={tag.key} className="flex items-center gap-3">
                      <Checkbox id={`tag-${tag.key}`} disabled={isDisabled} />
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
          <Accordion
            type="single"
            collapsible
            className="w-full"
            value={
              openAccordions.includes("elastic-categories")
                ? "elastic-categories"
                : ""
            }
            onValueChange={(value) => {
              setOpenAccordions((prev) =>
                prev.includes(value)
                  ? prev.filter((item) => item !== value)
                  : [...prev, value]
              );
            }}
          >
            <AccordionItem value="elastic-categories" className="border-none">
              <AccordionTrigger className="py-0 hover:no-underline">
                <h2 className="text-sm font-medium font-roboto">
                  {t("titleCategory")}
                </h2>
              </AccordionTrigger>
              <AccordionContent className="pt-3">
                <div className="flex flex-col gap-2">
                  {elasticFilters.categories.map((category: any) => (
                    <div key={category.key} className="flex items-center gap-3">
                      <Checkbox
                        disabled={isDisabled}
                        id={`elastic-category-${category.key}`}
                        checked={selectedCategories.includes(category.key)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            onCategoriesChange([
                              ...selectedCategories,
                              category.key,
                            ]);
                          } else {
                            onCategoriesChange(
                              selectedCategories.filter(
                                (c) => c !== category.key
                              )
                            );
                          }
                        }}
                        className="data-[state=checked]:bg-gold-main data-[state=checked]:border-gold-main data-[state=checked]:text-white rounded-none"
                      />
                      <Label
                        htmlFor={`elastic-category-${category.key}`}
                        className="text-sm font-light cursor-pointer truncate max-w-[200px] block"
                        title={getCategoryName(category) || category.key}
                      >
                        {getCategoryName(category) || category.key} (
                        {category.doc_count})
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
            <Accordion
              type="single"
              collapsible
              className="w-full"
              value={
                openAccordions.includes("elastic-availability")
                  ? "elastic-availability"
                  : ""
              }
              onValueChange={(value) => {
                setOpenAccordions((prev) =>
                  prev.includes(value)
                    ? prev.filter((item) => item !== value)
                    : [...prev, value]
                );
              }}
            >
              <AccordionItem
                value="elastic-availability"
                className="border-none"
              >
                <AccordionTrigger className="py-0 hover:no-underline">
                  <h2 className="text-sm font-medium font-roboto">
                    {t("titleAvailability")}
                  </h2>
                </AccordionTrigger>
                <AccordionContent className="pt-3">
                  <div className="flex flex-col gap-2">
                    {elasticFilters.availability.map((item: any) => (
                      <div key={item.key} className="flex items-center gap-3">
                        <Checkbox
                          disabled={isDisabled}
                          id={`elastic-availability-${item.key}`}
                          checked={selectedAvailability.includes(item.key)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              onAvailabilityChange([
                                ...selectedAvailability,
                                item.key,
                              ]);
                            } else {
                              onAvailabilityChange(
                                selectedAvailability.filter(
                                  (a) => a !== item.key
                                )
                              );
                            }
                          }}
                          className="data-[state=checked]:bg-gold-main data-[state=checked]:border-gold-main data-[state=checked]:text-white rounded-none"
                        />
                        <Label
                          htmlFor={`elastic-availability-${item.key}`}
                          className="text-sm font-light cursor-pointer"
                        >
                          {prepareAvailabilityName(item.key)} ({item.doc_count})
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
          <Accordion
            type="single"
            collapsible
            className="w-full"
            value={
              openAccordions.includes("elastic-condition")
                ? "elastic-condition"
                : ""
            }
            onValueChange={(value) => {
              setOpenAccordions((prev) =>
                prev.includes(value)
                  ? prev.filter((item) => item !== value)
                  : [...prev, value]
              );
            }}
          >
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
                      <Checkbox
                        disabled={isDisabled}
                        id={`elastic-condition-${item.key}`}
                        checked={selectedCondition.includes(item.key)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            onConditionChange([...selectedCondition, item.key]);
                          } else {
                            onConditionChange(
                              selectedCondition.filter((c) => c !== item.key)
                            );
                          }
                        }}
                        className="data-[state=checked]:bg-gold-main data-[state=checked]:border-gold-main data-[state=checked]:text-white rounded-none"
                      />
                      <Label
                        htmlFor={`elastic-condition-${item.key}`}
                        className="text-sm font-light cursor-pointer"
                      >
                        {prepareConditionName(item.key)} ({item.doc_count})
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}

      {/* {Object.keys(categories).length > 0 && (
        <div className="border-b border-border-foreground pb-3.5">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="subcategory" className="border-none">
              <AccordionTrigger className="py-0 hover:no-underline">
                <h2 className="text-sm font-medium font-roboto">
                  {t("titleSubcategory")}
                </h2>
              </AccordionTrigger>
              <AccordionContent className="pt-3">
                <div className="flex flex-col gap-2">
                  {Object.entries(categories).map(([categoryId, count]) => {
                    const category = availableCategories.find(
                      (cat) => cat.id === parseInt(categoryId)
                    );
                    if (!category) return null;

                    return (
                      <div key={categoryId} className="flex items-center gap-3">
                        <Checkbox
                          id={`subcategory-${categoryId}`}
                          checked={
                            selectedSubcategoryId === parseInt(categoryId)
                          }
                          onCheckedChange={(checked) => {
                            console.log(
                              "Subcategory checkbox changed:",
                              categoryId,
                              checked
                            );
                            if (checked) {
                              onSubcategoryChange(parseInt(categoryId));
                            } else {
                              onSubcategoryChange(null);
                            }
                          }}
                          className="data-[state=checked]:bg-gold-main data-[state=checked]:border-gold-main data-[state=checked]:text-white rounded-none"
                        />
                        <Label
                          htmlFor={`subcategory-${categoryId}`}
                          className={`text-sm font-light cursor-pointer truncate max-w-[200px] block ${
                            selectedSubcategoryId === parseInt(categoryId)
                              ? "text-foreground"
                              : "text-foreground/80"
                          }`}
                          title={getCategoryName(category)}
                        >
                          {getCategoryName(category)}
                        </Label>
                        <span className="text-sm flex-shrink-0 text-gray-500">
                          ({count})
                        </span>
                      </div>
                    );
                  })}
                </div>
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
      </div> */}

      <PriceRange
        onPriceChange={onPriceChange}
        minLimit={priceRange.min}
        maxLimit={priceRange.max}
        initialMin={selectedPriceRange?.min}
        initialMax={selectedPriceRange?.max}
        isMobile={isMobile}
        isDisabled={isDisabled}
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
