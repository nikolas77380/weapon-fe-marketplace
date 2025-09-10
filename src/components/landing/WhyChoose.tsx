"use client";

import { whyChooseData } from "@/mockup/landing";
import React from "react";
import WhyChooseCard from "./WhyChooseCard";
import { motion } from "framer-motion";
import {
  containerWhyChooseVariants,
  cardWhyChooseVariants,
} from "@/lib/animationVariants";

const WhyChoose = () => {
  return (
    <motion.section
      className="py-25 bg-[#f0f0e5] relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      variants={containerWhyChooseVariants}
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-gold-main/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-24 h-24 bg-gray-secondary/10 rounded-full blur-xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </motion.div>

      <div className="container mx-auto relative z-10">
        <motion.div
          className="mt-14 grid grid-cols-3 gap-25"
          variants={containerWhyChooseVariants}
        >
          {whyChooseData.map((item, index) => (
            <motion.div key={index} variants={cardWhyChooseVariants}>
              <WhyChooseCard {...item} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default WhyChoose;
