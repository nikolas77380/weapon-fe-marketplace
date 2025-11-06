"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { containerGetStartedVariants } from "@/lib/animationVariants";

const GetStarted = () => {
  return (
    <motion.section
      className="w-full h-[473px] relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="absolute z-[-1] inset-0 w-full h-full"
        initial={{ scale: 1.1, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <Image
          src="/landing/bg-started.png"
          alt="bg started"
          fill
          priority
          sizes="100vw"
          className="object-cover w-full h-full"
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20 z-0"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 1, delay: 0.3 }}
      />

      <motion.div
        className="flex flex-col items-center justify-center w-full h-full relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={containerGetStartedVariants}
      >
        <motion.h1
          className="text-center max-w-[918px] font-bold text-5xl bg-gradient-to-b from-[#f0f0e5] to-gray-secondary bg-clip-text text-transparent"
          initial={{ y: 80, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Join professionals already using our platform to buy and sell weapon
          prototypes.
        </motion.h1>

        <motion.div
          className="mt-10"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link
            href={"/auth?mode=register"}
            className="py-3 px-6 bg-gold-main rounded-none hover:bg-gold-main/90 
          duration-300 transition-all text-white"
          >
            Create Account
          </Link>
        </motion.div>
      </motion.div>

      {/* Floating particles effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-gold-main/40 rounded-full"
            style={{
              left: `${15 + i * 12}%`,
              top: `${20 + (i % 4) * 15}%`,
            }}
            animate={{
              y: [-15, 15, -15],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </motion.section>
  );
};

export default GetStarted;
