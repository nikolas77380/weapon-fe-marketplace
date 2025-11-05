"use client";

import React from "react";
import { useViewedProducts } from "@/hooks/useViewedProducts";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { useAuthContext } from "@/context/AuthContext";
import { useTranslations } from "next-intl";
import ProductsSlider from "../ui/ProductsSlider";
import SkeletonComponent from "../ui/SkeletonComponent";

const VIEWED_PRODUCTS_BASE_KEY = "viewedProducts";

// Синхронное получение ID из localStorage (для немедленного показа скелетона)
const getViewedProductIdsSync = (
  userId: number | string | undefined
): number[] => {
  if (!userId || typeof window === "undefined") return [];
  try {
    const storageKey = `${VIEWED_PRODUCTS_BASE_KEY}_${userId}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const viewedProducts: Array<{ id: number; timestamp: number }> =
        JSON.parse(stored);
      if (Array.isArray(viewedProducts) && viewedProducts.length > 0) {
        return viewedProducts
          .sort((a, b) => b.timestamp - a.timestamp)
          .map((item) => item.id);
      }
    }
  } catch (error) {
    // Игнорируем ошибки
  }
  return [];
};

const ViewedProductsSlider = () => {
  const t = useTranslations("ViewedRecommendedProductsSlider");
  const { currentUser } = useAuthContext();
  const { viewedProductIds, hasViewedProducts } = useViewedProducts();

  // Синхронно получаем ID из localStorage для немедленного показа скелетона (без useMemo - каждый рендер)
  const viewedIdsSync = getViewedProductIdsSync(currentUser?.id);
  const hasIdsSync = viewedIdsSync.length > 0;

  // Используем синхронные ID если они есть, иначе из хука
  const idsToUse = hasIdsSync ? viewedIdsSync : viewedProductIds;
  const shouldFetch =
    hasIdsSync || (hasViewedProducts && viewedProductIds.length > 0);

  // Only fetch products if we have viewed product IDs
  const { data: response, isLoading: isLoadingProducts } = useProductsQuery(
    shouldFetch && idsToUse.length > 0
      ? {
          ids: idsToUse,
          pagination: {
            page: 1,
            pageSize: idsToUse.length || 15,
          },
        }
      : undefined
  );

  const allProducts = response?.data || [];

  // Показываем скелетон если:
  // 1. Есть ID в localStorage (синхронно) но продуктов еще нет
  // 2. Или идет загрузка
  const shouldShowSkeleton =
    (hasIdsSync && allProducts.length === 0) || isLoadingProducts;

  if (!currentUser) {
    return null;
  }

  // Если нет ID ни в localStorage, ни в state - не показываем
  if (!hasIdsSync && !hasViewedProducts) {
    return null;
  }

  if (shouldShowSkeleton) {
    return (
      <div className="w-full">
        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 px-2 sm:px-0">
          {t("title")}
        </h3>
        <div
          className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 
        lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 w-full"
        >
          <SkeletonComponent type="productCard" count={6} className="w-full" />
        </div>
      </div>
    );
  }

  return (
    <ProductsSlider
      products={allProducts}
      title={t("title")}
      navigationPrefix="viewed"
      sliderClassName="viewed-products-slider custom-scrollbar"
    />
  );
};

export default ViewedProductsSlider;
