"use client";

import { howItWorksData } from "@/mockup/landing";
import React from "react";
import HowItWorksCard from "./HowItWorksCard";
import { motion } from "framer-motion";
import {
  containerHowItWorksVariants,
  cardHowItWorksVariants,
} from "@/lib/animationVariants";

const HowItWorks = () => {
  return (
    <motion.section
      className="py-25 w-full bg-[#f0f0e5]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto">
        <motion.div
          className="flex flex-col"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-center text-5xl font-medium">How it works</h1>
          <p className="mt-5 text-center text-xl">
            Simple process for buyers and sellers
          </p>
        </motion.div>

        <motion.div
          className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-7.5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={containerHowItWorksVariants}
        >
          {howItWorksData.map((item) => (
            <motion.div key={item.id} variants={cardHowItWorksVariants}>
              <HowItWorksCard {...item} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HowItWorks;
