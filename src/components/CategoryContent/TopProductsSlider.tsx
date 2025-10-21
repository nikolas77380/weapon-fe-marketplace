"use client";

import React, { useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useTopProductsByCategory } from "@/hooks/useTopProductsByCategory";
import ShopCard from "../shop/ShopCard";
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

  // Получаем топ товар из каждой основной категории (22 отдельных запроса)
  const { data: topProducts = [] } = useTopProductsByCategory();

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
  if (topProducts.length === 0) {
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
