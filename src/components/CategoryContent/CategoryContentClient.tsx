"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { useCategories } from "@/hooks/useCategories";
import SkeletonComponent from "../ui/SkeletonComponent";
import ShopCard from "../shop/ShopCard";
import { Product, Category, Promo } from "@/lib/types";
import { usePromosQuery } from "@/hooks/usePromosQuery";
import CategoryDropdown from "./CategoryDropdown";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

// Lazy loading для слайдеров
const ViewedProductsSliderLazy = dynamic(
  () => import("./ViewedProductsSlider"),
  {
    ssr: false,
    loading: () => (
      <div
        className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 
  lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 w-full mt-2"
      >
        <SkeletonComponent type="productCard" count={6} className="w-full" />
      </div>
    ),
  }
);

const TopProductsSliderLazy = dynamic(
  () =>
    import("./TopProductsSlider").then((mod) => ({
      default: mod.default,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 
    lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 w-full mt-2"
      >
        <SkeletonComponent type="productCard" count={6} className="w-full" />
      </div>
    ),
  }
);

const BannerSliderLazy = dynamic(() => import("./BannerSlider"), {
  ssr: false,
  loading: () => (
    <div className="h-64 animate-pulse bg-gray-200 rounded mb-2" />
  ),
});

interface CategoryContentClientProps {
  initialProducts: {
    data: Product[];
    meta: {
      pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
      };
    };
  };
  initialPromos: {
    data: Promo[];
  };
  initialCategories: Category[];
  initialTopProducts?: Product[];
}

const CategoryContentClient: React.FC<CategoryContentClientProps> = ({
  initialProducts,
  initialPromos,
  initialCategories,
  initialTopProducts,
}) => {
  const t = useTranslations("TopPropositions");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Проверяем валидность initialData
  useEffect(() => {
    if (!initialProducts || !initialPromos || !initialCategories) {
      console.error("[CategoryContentClient] Invalid initial data:", {
        hasProducts: !!initialProducts,
        hasPromos: !!initialPromos,
        hasCategories: !!initialCategories,
      });
      setError("Invalid initial data");
    }
  }, [initialProducts, initialPromos, initialCategories]);

  // Используем React Query с initialData
  const {
    data: response,
    isLoading,
    error: queryError,
  } = useProductsQuery(
    {
      pagination: {
        page: 1,
        pageSize: 12,
      },
      sort: "viewsCount:desc",
    },
    initialProducts
  );

  // Используем данные из query или initialData
  const productsResponse = response || initialProducts;
  const loading = isLoading && !initialProducts?.data?.length;

  const { categories } = useCategories(initialCategories);
  const { data: promosResponse } = usePromosQuery(undefined, initialPromos);

  // Используем данные из query или initialData
  const promos = promosResponse || initialPromos;

  // Логируем ошибки
  useEffect(() => {
    if (queryError) {
      console.error("[CategoryContentClient] Query error:", queryError);
      setError(
        queryError instanceof Error ? queryError.message : "Unknown error"
      );
    }
  }, [queryError]);

  // Отключаем isInitialLoad после первой успешной загрузки
  useEffect(() => {
    if (!isLoading && productsResponse?.data) {
      setIsInitialLoad(false);
    }
  }, [isLoading, productsResponse?.data]);

  // Используем категории из query или initialData
  const availableCategories = useMemo(() => {
    const categoriesToUse =
      categories.length > 0 ? categories : initialCategories;
    if (categoriesToUse.length > 0) {
      const mainCategories = categoriesToUse.filter(
        (category) => !category.parent
      );
      // Сортируем по order или name
      return mainCategories.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return (a.name || "").localeCompare(b.name || "");
      });
    }
    return [];
  }, [categories, initialCategories]);

  // Если есть критическая ошибка, показываем сообщение
  if (error && !initialProducts?.data?.length) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading content: {error}</p>
          <p className="text-gray-600 text-sm">
            Please refresh the page or try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full gap-0 lg:gap-10 overflow-hidden">
      {/* Filters - Hidden on mobile, visible on desktop */}
      <div
        className="hidden lg:flex flex-col gap-2 border-r border-b border-border-foreground py-5 w-64 
      flex-shrink-0 pr-2 rounded-br-sm"
      >
        {isInitialLoad && loading ? (
          <SkeletonComponent type="leftSidebar" />
        ) : (
          availableCategories.map((category) => (
            <CategoryDropdown
              key={category.id}
              category={category}
              allCategories={
                categories.length > 0 ? categories : initialCategories
              }
            />
          ))
        )}
      </div>
      {/* Shop Content - Full width on mobile, flex-1 on desktop */}
      <div className="w-full lg:flex-1 min-w-0 overflow-hidden mt-6">
        {/* Swiper Slide Banners */}
        <BannerSliderLazy promos={promos?.data || []} />

        {/* Viewed Products Slider */}
        <ViewedProductsSliderLazy />

        {/* Top Products Slider */}
        <TopProductsSliderLazy initialTopProducts={initialTopProducts} />

        {/* Products Grid */}
        {!loading && productsResponse?.data?.length > 0 && (
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 px-2 sm:px-0">
            {t("title")}
          </h3>
        )}
        <div
          className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 
        lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 w-full"
        >
          {loading ? (
            <SkeletonComponent
              type="productCard"
              count={6}
              className="w-full"
            />
          ) : productsResponse?.data?.length > 0 ? (
            productsResponse.data.map((item: Product) => (
              <ShopCard item={item} key={item.id} />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No products found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryContentClient;
