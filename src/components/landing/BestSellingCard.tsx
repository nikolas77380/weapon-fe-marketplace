"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface BestSellingCardProps {
  title: string;
  image: string;
  subTitle: string;
  seller: string;
  price: string;
  views: string;
  condition: string;
}

const BestSellingCard = ({
  title,
  image,
  subTitle,
  seller,
  price,
  views,
  condition,
}: BestSellingCardProps) => {
  return (
    <div className="border border-border-foreground bg-[#e4c6ba]/30 p-7.5 flex flex-col relative">
      <motion.div
        className="overflow-hidden flex justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Image
          src={image}
          alt={title}
          width={200}
          height={266}
          className="object-cover overflow-hidden"
        />
      </motion.div>

      <motion.div
        className={cn(`absolute top-2 left-0 px-2.5 py-1
        ${condition === "New" && "bg-green-500 text-white"}
        ${condition === "Pre-Order" && "bg-yellow-500 text-black"}
        ${condition === "In Stock" && "bg-blue-500 text-white"}
        `)}
        initial={{ x: -20, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {condition}
      </motion.div>

      <div className="w-full flex flex-col mt-7.5">
        <motion.p
          className="text-sm text-foreground/50"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {subTitle}
        </motion.p>

        <motion.h1
          className="mt-2.5 text-xl font-medium"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {title}
        </motion.h1>

        <motion.div
          className="flex items-center justify-between"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center gap-2.5">
            <p className="text-sm text-foreground/50">Seller:</p>
            <p className="border-b border-border-secondary text-sm">{seller}</p>
          </div>
          <div className="flex items-center gap-1">
            <Eye size={16} className="text-foreground/50" />
            <p className="text-sm text-foreground/50">{views}</p>
          </div>
        </motion.div>

        <motion.div
          className="flex items-center justify-between mt-5.5"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p className="text-xl font-medium text-gold-main">${price}</p>
          <Link
            href={"/auth"}
            className="rounded-none py-2.5 px-5 bg-gold-main hover:bg-gold-main/90 text-white"
          >
            Contact seller
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default BestSellingCard;
