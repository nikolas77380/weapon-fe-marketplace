"use client";

import React from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Category } from "@/lib/types";
import { getChildCategories } from "@/lib/categoryUtils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { Shield } from "lucide-react";

interface CategoryDropdownProps {
  category: Category;
  allCategories: Category[];
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  category,
  allCategories,
}) => {
  const currentLocale = useLocale();
  const subCategories = getChildCategories(allCategories, category.id);

  const getCategoryName = (cat: Category) => {
    return currentLocale === "en" ? cat.name : cat.translate_ua || cat.name;
  };
  // If there are no subcategories, we show a regular link
  if (subCategories.length === 0) {
    return (
      <TooltipProvider delayDuration={300}>
        <div className="flex items-center">
          {category.icon?.url ? (
            <Image
              src={category.icon.url}
              alt={category.name}
              width={16}
              height={16}
              className="w-4 h-4 mr-2 object-contain flex-shrink-0"
            />
          ) : (
            <Shield className="w-4 h-4 mr-2 text-gray-600 flex-shrink-0" />
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/category/${category.slug}`}
                className="cursor-pointer hover:text-gold-main transition-colors duration-200 py-2 px-2 
                rounded-md hover:bg-accent/50 block w-64 truncate"
              >
                {getCategoryName(category)}
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              <p>{getCategoryName(category)}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    );
  }

  // Если есть подкатегории, показываем accordion
  return (
    <TooltipProvider delayDuration={300}>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem
          value={`category-${category.id}`}
          className="border-none"
        >
          <div className="flex items-center">
            {category.icon?.url ? (
              <Image
                src={category.icon.url}
                alt={category.name}
                width={16}
                height={16}
                sizes="16px"
                loading="lazy"
                className="w-4 h-4 mr-2 object-contain flex-shrink-0"
              />
            ) : (
              <Shield className="w-4 h-4 mr-2 text-gray-600 flex-shrink-0" />
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/category/${category.slug}`}
                  className="cursor-pointer hover:text-gold-main transition-colors duration-200 py-2 px-2 rounded-md 
                  w-50 truncate font-normal text-md"
                >
                  {getCategoryName(category)}
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                sideOffset={5}
                className="data-[side=bottom]:!slide-in-from-top-0"
              >
                <p>{getCategoryName(category)}</p>
              </TooltipContent>
            </Tooltip>
            <AccordionTrigger
              className="flex-shrink-0 p-2 hover:bg-accent/50 rounded-md 
            [&[data-state=open]]:text-gold-main ml-1"
            >
              <span className="sr-only">Показать подкатегории</span>
            </AccordionTrigger>
          </div>
          <AccordionContent className="pb-2">
            <div className="pl-4 space-y-1">
              {subCategories.map((subCategory) => {
                const subSubCategories = getChildCategories(
                  allCategories,
                  subCategory.id
                );

                if (subSubCategories.length === 0) {
                  // Простая подкатегория без вложенных
                  return (
                    <Tooltip key={subCategory.id}>
                      <TooltipTrigger asChild>
                        <Link
                          href={`/category/${subCategory.slug}`}
                          className="block cursor-pointer hover:text-gold-main transition-colors duration-200 
                          py-1 px-2 w-50 rounded-md truncate"
                        >
                          {getCategoryName(subCategory)}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" sideOffset={5}>
                        <p>{getCategoryName(subCategory)}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                // Подкатегория с вложенными подкатегориями
                return (
                  <Accordion
                    key={subCategory.id}
                    type="single"
                    collapsible
                    className="w-57"
                  >
                    <AccordionItem
                      value={`subcategory-${subCategory.id}`}
                      className="border-none"
                    >
                      <div className="flex items-center">
                        {/* Ссылка на подкатегорию */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href={`/category/${subCategory.slug}`}
                              className="flex-1 cursor-pointer hover:text-gold-main transition-colors duration-200 
                              py-1 px-2 ml-2 rounded-md truncate font-medium"
                            >
                              {getCategoryName(subCategory)}
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" sideOffset={5}>
                            <p>{getCategoryName(subCategory)}</p>
                          </TooltipContent>
                        </Tooltip>
                        <AccordionTrigger className="flex-shrink-0 p-1 hover:bg-accent/50 rounded-md [&[data-state=open]]:bg-accent/50">
                          <span className="sr-only">
                            Показать под-подкатегории
                          </span>
                        </AccordionTrigger>
                      </div>
                      <AccordionContent className="pb-1">
                        <div className="pl-4 space-y-1">
                          {subSubCategories.map((subSubCategory) => (
                            <Tooltip key={subSubCategory.id}>
                              <TooltipTrigger asChild>
                                <Link
                                  href={`/category/${subSubCategory.slug}`}
                                  className="block cursor-pointer hover:text-gold-main transition-colors duration-200 py-1 px-2 rounded-md truncate"
                                >
                                  {getCategoryName(subSubCategory)}
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" sideOffset={5}>
                                <p>{getCategoryName(subSubCategory)}</p>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </TooltipProvider>
  );
};

export default CategoryDropdown;
