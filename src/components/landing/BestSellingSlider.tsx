"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { bestSelling } from "@/mockup/landing";
import BestSellingCard from "./BestSellingCard";
import { motion } from "framer-motion";
import {
  containerBestSellingVariants,
  cardBestSellingVariants,
} from "@/lib/animationVariants";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const BestSellingSlider = () => {
  return (
    <motion.div
      className="relative"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      variants={containerBestSellingVariants}
    >
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
            <motion.div variants={cardBestSellingVariants}>
              <BestSellingCard {...item} />
            </motion.div>
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
    </motion.div>
  );
};

export default BestSellingSlider;
