"use client";

import React from "react";
import BestSellingSlider from "./BestSellingSlider";
import { motion } from "framer-motion";

const BestSelling = () => {
  return (
    <motion.div
      className="bg-[#f0f0e5]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto">
        <motion.h1
          className="font-medium text-5xl mb-10"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Top Picks from Verified Sellers
        </motion.h1>
        <BestSellingSlider />
      </div>
    </motion.div>
  );
};

export default BestSelling;
