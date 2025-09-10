"use client";

import { getIcon, IconName } from "@/lib/iconUtils";
import { motion } from "framer-motion";

interface HowItWorksCardProps {
  id: number;
  title: string;
  description: string;
  iconName: IconName;
}

const HowItWorksCard = ({
  id,
  title,
  description,
  iconName,
}: HowItWorksCardProps) => {
  return (
    <div className="relative flex flex-col w-full">
      <motion.div
        className="absolute top-0 right-0 text-[150px] font-bold bg-gradient-to-b from-gold-main via-[#e4c6ba]/50 to-transparent bg-clip-text text-transparent select-none pointer-events-none z-0 leading-none"
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        {id}
      </motion.div>

      <motion.div
        className="size-10 flex items-center justify-center"
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {getIcon(iconName)}
      </motion.div>

      <motion.h1
        className="relative z-10 mt-5 font-bold text-2xl bg-gradient-to-b from-[#c29e8a] to-gray-secondary bg-clip-text text-transparent"
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {title}
      </motion.h1>

      <motion.p
        className="font-light mt-5"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {description}
      </motion.p>
    </div>
  );
};

export default HowItWorksCard;
