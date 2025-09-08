"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { bestSelling } from "@/mockup/landing";
import BestSellingCard from "./BestSellingCard";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const BestSellingSlider = () => {
  return (
    <div className="relative">
      <Swiper
        modules={[Pagination, Navigation]}
        slidesPerView={4}
        spaceBetween={30}
        pagination={{ clickable: true, el: ".custom-pagination" }}
        navigation={{
          prevEl: ".custom-prev",
          nextEl: ".custom-next",
        }}
        className="mt-14"
      >
        {bestSelling.map((item) => (
          <SwiperSlide key={item.id}>
            <BestSellingCard {...item} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Стрелки */}
      {/* <button className="custom-prev absolute left-[-40px] top-1/2 z-10 transform -translate-y-1/2">
        &#10094;
      </button>
      <button className="custom-next absolute right-[-40px] top-1/2 z-10 transform -translate-y-1/2">
        &#10095;
      </button> */}

      {/* Пагинация */}
      <div className="custom-pagination flex justify-center gap-3 mt-8"></div>
    </div>
  );
};

export default BestSellingSlider;
