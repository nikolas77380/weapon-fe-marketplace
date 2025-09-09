"use client";

import { getIcon, IconName } from "@/lib/iconUtils";
import { motion } from "framer-motion";

interface WhyChooseCardProps {
  icon: IconName;
  title: string;
  description: string;
}

const WhyChooseCard = ({ icon, title, description }: WhyChooseCardProps) => {
  return (
    <div className="p-7.5 border border-border-foreground bg-[#e4c6ba]/50 w-full flex flex-col">
      <motion.div
        className="flex items-center gap-3.5"
        initial={{ x: -20, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="size-10 flex items-center justify-center">
          {getIcon(icon)}
        </div>
        <motion.h1
          className="text-2xl font-medium bg-gradient-to-b from-gold-main to-gray-secondary bg-clip-text text-transparent"
          initial={{ x: -10, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {title}
        </motion.h1>
      </motion.div>

      <motion.p
        className="mt-6 font-light"
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

export default WhyChooseCard;
