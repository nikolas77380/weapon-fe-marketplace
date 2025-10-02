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
import Image from "next/image";

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
  // Если нет подкатегорий, показываем обычную ссылку
  if (subCategories.length === 0) {
    return (
      <div>
        <Image
          src={category.icon?.url || ""}
          alt={category.name}
          width={20}
          height={20}
        />
        <Link
          href={`/category/${category.slug}`}
          className="cursor-pointer hover:text-gold-main transition-colors duration-200 py-2 px-2 rounded-md hover:bg-accent/50 block"
        >
          {getCategoryName(category)}
        </Link>
      </div>
    );
  }

  // Если есть подкатегории, показываем accordion
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={`category-${category.id}`} className="border-none">
        <div className="flex items-center">
          <Image
            src={category.icon?.url || ""}
            alt={category.name}
            width={20}
            height={20}
          />
          <Link
            href={`/category/${category.slug}`}
            className="cursor-pointer hover:text-gold-main transition-colors duration-200 py-2 px-2 rounded-md"
          >
            {getCategoryName(category)}
          </Link>
          <AccordionTrigger className="flex-shrink-0 p-2 hover:bg-accent/50 rounded-md [&[data-state=open]]:text-gold-main">
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
                  <Link
                    key={subCategory.id}
                    href={`/category/${subCategory.slug}`}
                    className="block cursor-pointer hover:text-gold-main transition-colors duration-200 py-1 px-2 rounded-md"
                  >
                    {getCategoryName(subCategory)}
                  </Link>
                );
              }

              // Подкатегория с вложенными подкатегориями
              return (
                <Accordion
                  key={subCategory.id}
                  type="single"
                  collapsible
                  className="w-full"
                >
                  <AccordionItem
                    value={`subcategory-${subCategory.id}`}
                    className="border-none"
                  >
                    <div className="flex items-center">
                      {/* Ссылка на подкатегорию */}
                      <Link
                        href={`/category/${subCategory.slug}`}
                        className="flex-1 cursor-pointer hover:text-gold-main transition-colors duration-200 py-1 px-2 rounded-md"
                      >
                        {getCategoryName(subCategory)}
                      </Link>
                      <AccordionTrigger className="flex-shrink-0 p-1 hover:bg-accent/50 rounded-md [&[data-state=open]]:bg-accent/50">
                        <span className="sr-only">
                          Показать под-подкатегории
                        </span>
                      </AccordionTrigger>
                    </div>
                    <AccordionContent className="pb-1">
                      <div className="pl-4 space-y-1">
                        {subSubCategories.map((subSubCategory) => (
                          <Link
                            key={subSubCategory.id}
                            href={`/category/${subSubCategory.slug}`}
                            className="block cursor-pointer hover:text-gold-main transition-colors duration-200 py-1 px-2 rounded-md"
                          >
                            {getCategoryName(subSubCategory)}
                          </Link>
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
  );
};

export default CategoryDropdown;
