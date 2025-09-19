"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import NavigationButton from "../ui/NavigationButton";
import { bannerData } from "@/mockup/banners";

const BannerSlider = () => {
  return (
    <div className="mb-4 sm:mb-6 w-full overflow-hidden px-2 sm:px-0">
      <div className="relative w-full">
        <Swiper
          modules={[Pagination, Navigation, Autoplay]}
          slidesPerView={1}
          spaceBetween={0}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            el: ".banner-pagination",
          }}
          navigation={{
            prevEl: ".banner-prev",
            nextEl: ".banner-next",
          }}
          className="banner-slider w-full"
        >
          {bannerData.map((banner) => (
            <SwiperSlide key={banner.id}>
              <div className="relative w-full h-[150px] sm:h-[180px] lg:h-[200px] rounded-sm overflow-hidden cursor-pointer">
                <Image
                  src={banner.image}
                  alt={banner.image}
                  width={1000}
                  height={200}
                  className="object-cover w-full h-full"
                  priority={banner.id === 1}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation buttons - Hidden on mobile */}
        <div className="banner-prev hidden sm:block">
          <NavigationButton direction="left" onClick={() => {}} />
        </div>
        <div className="banner-next hidden sm:block">
          <NavigationButton direction="right" onClick={() => {}} />
        </div>

        {/* Pagination dots */}
        <div className="banner-pagination"></div>
      </div>
    </div>
  );
};

export default BannerSlider;
