"use client";

import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import GradientText from "../ui/GradientText";
import { COLORS } from "@/lib/animationVariants";

const MainBanner = () => {
  return (
    <motion.section
      className="w-full h-[808px] relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated background with parallax effect */}
      <motion.div
        className="absolute inset-0 w-full h-[calc(700px+108px)] z-[-1]"
        initial={{ scale: 1.1, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <Image
          src="/landing/hero-banner.png"
          alt="hero banner"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
      </motion.div>

      {/* Animated overlay gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-0"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, delay: 0.3 }}
      />

      <div className="flex justify-center items-center w-full h-full relative z-10">
        <motion.div
          className="flex flex-col"
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Main heading with staggered animation */}
          <motion.h1
            className="text-6xl max-w-[800px] font-bold text-center leading-tight"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <GradientText
              colors={COLORS}
              animationSpeed={9}
              showBorder={false}
              className="select-none"
            >
              Trusted and transparent weapon marketplace
            </GradientText>
          </motion.h1>

          {/* Subtitle with slide up animation */}
          <motion.p
            className="text-xl text-white mt-10 text-center"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Connect buyers and sellers of any kind of weapon
          </motion.p>

          {/* Buttons with staggered animation */}
          <motion.div
            className="flex items-center w-full justify-center gap-5 mt-10"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Button className="py-3 px-6 font-medium text-white bg-gold-main rounded-none">
                Explore catalog
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Button
                variant={"ghost"}
                className="rounded-none border py-3 px-6 font-medium border-gray-200 text-white"
              >
                Start selling
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating particles effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gold-main/30 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 10}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </motion.div>
    </motion.section>
  );
};

export default MainBanner;
