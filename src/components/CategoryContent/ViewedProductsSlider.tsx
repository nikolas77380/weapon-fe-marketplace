"use client";

import React, { useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useViewedProducts } from "@/hooks/useViewedProducts";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { useAuthContext } from "@/context/AuthContext";
import ShopCard from "../shop/ShopCard";
import { Product } from "@/lib/types";
import NavigationButton from "../ui/NavigationButton";
import CustomScrollbar from "../ui/CustomScrollbar";

import "swiper/css";
import "swiper/css/navigation";
import { VIEWED_PRODUCTS_BREAKPOINTS } from "@/lib/swiperBreakpoints";
import { useTranslations } from "next-intl";

const ViewedProductsSlider = () => {
  const t = useTranslations("ViewedRecommendedProductsSlider");
  const { currentUser } = useAuthContext();
  const { viewedProductIds, hasViewedProducts } = useViewedProducts();
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

  const { data: response } = useProductsQuery({
    pagination: {
      page: 1,
      pageSize: 100,
    },
  });

  const allProducts = response?.data || [];

  // Filter only viewed products in the correct order
  const viewedProducts: Product[] = viewedProductIds
    .map((id) => allProducts.find((product: Product) => product.id === id))
    .filter((product): product is Product => product !== undefined);

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

  if (!currentUser || !hasViewedProducts || viewedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mb-10">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{t("title")}</h3>

      <div className="relative">
        <Swiper
          modules={[Navigation]}
          slidesPerView={6}
          spaceBetween={0}
          onSwiper={setSwiperRef}
          onSlideChange={handleSlideChange}
          onProgress={handleProgress}
          navigation={{
            prevEl: ".viewed-prev",
            nextEl: ".viewed-next",
          }}
          breakpoints={VIEWED_PRODUCTS_BREAKPOINTS}
          className="viewed-products-slider custom-scrollbar"
        >
          {viewedProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <ShopCard item={product} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom scrollbar */}
        <CustomScrollbar
          progress={progress}
          onProgressChange={handleScrollbarProgressChange}
          totalItems={viewedProducts.length}
          visibleItems={6}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />

        {/* Navigation buttons */}
        {viewedProducts.length > 6 && (
          <>
            <div className="viewed-prev">
              <NavigationButton
                direction="left"
                onClick={handleScrollLeft}
                showLeftButton={canScrollLeft}
              />
            </div>
            <div className="viewed-next">
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

export default ViewedProductsSlider;
