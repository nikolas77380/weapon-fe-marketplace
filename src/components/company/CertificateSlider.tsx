"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useCertificates, Certificate } from "@/hooks/useCertificates";
import CertificateCard from "@/components/ui/CertificateCard";
import NavigationButton from "@/components/ui/NavigationButton";
import { CERTIFICATE_BREAKPOINTS } from "@/lib/swiperBreakpoints";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

import "swiper/css";
import "swiper/css/navigation";

interface CertificateSliderProps {
  sellerId: number;
}

const CertificateSlider = ({ sellerId }: CertificateSliderProps) => {
  const t = useTranslations("CertificateSlider");
  const [swiperRef, setSwiperRef] = useState<any>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { data, isLoading, error } = useCertificates({
    certificateType: "seller",
    seller: sellerId,
    scope: "public",
  });

  const certificates = (data as any)?.data || [];

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

  const checkScrollPosition = (swiper: any) => {
    setCanScrollLeft(!swiper.isBeginning);
    setCanScrollRight(!swiper.isEnd);
  };

  const handleSlideChange = (swiper: any) => {
    checkScrollPosition(swiper);
  };

  const handleSwiperInit = (swiper: any) => {
    setSwiperRef(swiper);
    checkScrollPosition(swiper);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="h-32 sm:h-40 w-full rounded-lg" />
            <div className="space-y-2 p-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{t("errorLoading")}</p>
      </div>
    );
  }

  if (!certificates || certificates.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{t("noCertificates")}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation]}
        breakpoints={CERTIFICATE_BREAKPOINTS}
        onSwiper={handleSwiperInit}
        onSlideChange={handleSlideChange}
        className="certificate-slider"
      >
        {certificates.map((certificate: Certificate) => (
          <SwiperSlide key={certificate.id}>
            <CertificateCard certificate={certificate} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation buttons */}
      {certificates.length > 1 && (
        <>
          <div className="certificate-prev">
            <NavigationButton
              direction="left"
              onClick={handleScrollLeft}
              showLeftButton={canScrollLeft}
            />
          </div>
          <div className="certificate-next">
            <NavigationButton
              direction="right"
              onClick={handleScrollRight}
              showLeftButton={canScrollRight}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CertificateSlider;
