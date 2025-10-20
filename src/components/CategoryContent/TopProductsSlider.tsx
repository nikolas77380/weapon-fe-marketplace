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

  // Получаем товары с сортировкой по просмотрам
  const { data: response, isLoading } = useProductsQuery({
    sort: "viewsCount:desc",
    pagination: {
      page: 1,
      pageSize: 20,
    },
  });

  // Получаем топ товар из каждой главной категории (включая все подкатегории)
  const topProducts = useMemo(() => {
    const allProducts = response?.data || [];
    const mainCategories = getMainCategories();
    const topProductsByCategory: Product[] = [];
    const usedCategories = new Set<number>(); // Отслеживаем уже использованные категории

    // Проходим по товарам (уже отсортированным по viewsCount)
    for (const product of allProducts) {
      if (!product.category?.id) continue;

      // Находим главную категорию для этого товара
      const findMainCategory = (categoryId: number): any => {
        const category = categories.find((cat) => cat.id === categoryId);
        if (!category) return null;

        // Если это главная категория
        if (!category.parent) return category;

        // Иначе ищем родительскую категорию
        return findMainCategory(category.parent.id);
      };

      const mainCategory = findMainCategory(product.category.id);
      if (!mainCategory || usedCategories.has(mainCategory.id)) continue;

      // Добавляем товар и отмечаем категорию как использованную
      topProductsByCategory.push(product);
      usedCategories.add(mainCategory.id);

      // Если нашли товар для каждой главной категории, останавливаемся
      if (topProductsByCategory.length >= mainCategories.length) break;
    }

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
