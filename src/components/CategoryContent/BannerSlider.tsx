"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { bannerData } from "@/mockup/banners";

const BannerSlider = () => {
  return (
    <div className="mb-6 w-full overflow-hidden">
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
              <div className="relative w-full h-[200px] rounded-sm overflow-hidden cursor-pointer">
                <Image
                  src={banner.image}
                  alt={banner.image}
                  width={1000}
                  height={200}
                  className="object-cover w-full h-full"
                  priority={banner.id === 1}
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center p-6 text-white"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation buttons */}
        <button className="banner-prev absolute left-4 top-1/2 z-10 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 shadow-lg">
          <ChevronLeft size={26} className="text-gray-500" />
        </button>

        <button className="banner-next absolute right-4 top-1/2 z-10 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 shadow-lg">
          <ChevronRight size={26} className="text-gray-500" />
        </button>

        {/* Pagination dots */}
        <div className="banner-pagination absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10 flex justify-center"></div>
      </div>
    </div>
  );
};

export default BannerSlider;
