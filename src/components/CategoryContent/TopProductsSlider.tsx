"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { useCategories } from "@/hooks/useCategories";
import ShopCard from "../shop/ShopCard";
import { Product } from "@/lib/types";
import NavigationButton from "../ui/NavigationButton";
import CustomScrollbar from "../ui/CustomScrollbar";
import { useTranslations } from "next-intl";
import useBreakpoint from "@/hooks/useBreakpoint";

import "swiper/css";
import "swiper/css/navigation";
import { VIEWED_PRODUCTS_BREAKPOINTS } from "@/lib/swiperBreakpoints";

const TopProductsSlider = () => {
  const t = useTranslations("TopProducts");
  const { currentSlidesPerView } = useBreakpoint();
  const { getMainCategories, categories } = useCategories();
  const [swiperRef, setSwiperRef] = useState<any>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [progress, setProgress] = useState(0);

  const handleScrollLeft = () => {
    if (swiperRef) {
      swiperRef.slidePrev();
    }
  };

  const handleScrollRight = () => {
    if (swiperRef) {
      swiperRef.slideNext();
    }
  };

  // Checking the scrolling capability
  const checkScrollPosition = (swiper: any) => {
    setCanScrollLeft(!swiper.isBeginning);
    setCanScrollRight(!swiper.isEnd);
  };

  // Получаем все товары
  const { data: response, isLoading } = useProductsQuery({
    pagination: {
      page: 1,
      pageSize: 1000, // Большое количество чтобы получить все товары
    },
  });

  // Получаем топ товар из каждой главной категории (включая все подкатегории)
  const topProducts = useMemo(() => {
    const allProducts = response?.data || [];
    const mainCategories = getMainCategories();
    const topProductsByCategory: Product[] = [];

    // Функция для получения всех подкатегорий (рекурсивно)
    const getAllSubCategories = (parentId: number): number[] => {
      const directChildren = categories.filter(
        (cat) => cat.parent?.id === parentId
      );
      let allChildren: any[] = [...directChildren];

      // Рекурсивно получаем всех потомков
      directChildren.forEach((child) => {
        const subChildren = getAllSubCategories(child.id);
        allChildren = [
          ...allChildren,
          ...subChildren
            .map((id) => categories.find((cat) => cat.id === id))
            .filter(Boolean),
        ];
      });

      return allChildren.map((cat) => cat.id);
    };

    mainCategories.forEach((mainCategory) => {
      // Получаем все подкатегории для главной категории
      const subCategoryIds = getAllSubCategories(mainCategory.id);

      // Создаем массив всех ID категорий (главная + все подкатегории)
      const allCategoryIds = [mainCategory.id, ...subCategoryIds];

      console.log(`Main category: ${mainCategory.name} (${mainCategory.id})`);
      console.log(`Sub categories:`, subCategoryIds);
      console.log(`All category IDs:`, allCategoryIds);

      // Фильтруем товары по всем категориям (главная + подкатегории)
      const categoryProducts = allProducts.filter(
        (product: Product) =>
          product.category?.id && allCategoryIds.includes(product.category.id)
      );

      console.log(
        `Found ${categoryProducts.length} products for category ${mainCategory.name}`
      );

      if (categoryProducts.length > 0) {
        // Сортируем по viewsCount и берем первый (самый популярный)
        const topProduct = categoryProducts.sort(
          (a: Product, b: Product) =>
            Number(b.viewsCount) - Number(a.viewsCount)
        )[0];

        console.log(
          `Top product for ${mainCategory.name}:`,
          topProduct.name,
          `views: ${topProduct.viewsCount}`
        );
        topProductsByCategory.push(topProduct);
      }
    });

    console.log(`Total top products found: ${topProductsByCategory.length}`);

    return topProductsByCategory;
  }, [response?.data, getMainCategories, categories]);

  // Tracking changes in Swiper
  const handleSlideChange = (swiper: any) => {
    checkScrollPosition(swiper);
  };

  // Updating progress for a custom scrollbar
  const handleProgress = (swiper: any, progress: number) => {
    setProgress(progress);
  };

  // Handling progress changes from the scrollbar
  const handleScrollbarProgressChange = useCallback(
    (newProgress: number) => {
      if (!swiperRef) return;
      swiperRef.setProgress(newProgress);
      checkScrollPosition(swiperRef);
    },
    [swiperRef]
  );

  // Callbacks for drag state
  const handleDragStart = useCallback(() => {
    if (swiperRef) {
      swiperRef.setTransition(0);
    }
  }, [swiperRef]);

  const handleDragEnd = useCallback(() => {
    if (swiperRef) {
      swiperRef.setTransition(100);
    }
  }, [swiperRef]);

  // Не показываем слайдер если нет товаров
  if (isLoading || topProducts.length === 0) {
    return null;
  }

  return (
    <div className="mb-10">
      {topProducts.length > 0 && (
        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 px-2 sm:px-0">
          {t("title")}
        </h3>
      )}

      <div className="relative">
        <Swiper
          modules={[Navigation]}
          slidesPerView={1}
          spaceBetween={16}
          onSwiper={setSwiperRef}
          onSlideChange={handleSlideChange}
          onProgress={handleProgress}
          navigation={{
            prevEl: ".top-products-prev",
            nextEl: ".top-products-next",
          }}
          breakpoints={VIEWED_PRODUCTS_BREAKPOINTS}
          className="top-products-slider custom-scrollbar"
        >
          {topProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <ShopCard item={product} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom scrollbar */}
        {topProducts.length > currentSlidesPerView && (
          <CustomScrollbar
            progress={progress}
            onProgressChange={handleScrollbarProgressChange}
            totalItems={topProducts.length}
            visibleItems={currentSlidesPerView}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        )}

        {/* Navigation buttons */}
        {topProducts.length > currentSlidesPerView && (
          <>
            <div className="top-products-prev">
              <NavigationButton
                direction="left"
                onClick={handleScrollLeft}
                showLeftButton={canScrollLeft}
              />
            </div>
            <div className="top-products-next">
              <NavigationButton
                direction="right"
                onClick={handleScrollRight}
                showLeftButton={canScrollRight}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TopProductsSlider;
