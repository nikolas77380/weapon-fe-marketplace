import Image from "next/image";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";
import Link from "next/link";

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
      <div className="overflow-hidden flex justify-center">
        <Image
          src={image}
          alt={title}
          width={200}
          height={266}
          className="object-cover overflow-hidden"
        />
      </div>
      <div
        className={cn(`absolute top-2 left-0 px-2.5 py-1
        ${condition === "New" && "bg-green-500 text-white"}
        ${condition === "Pre-Order" && "bg-yellow-500 text-black"}
        ${condition === "In Stock" && "bg-blue-500 text-white"}
        `)}
      >
        {condition}
      </div>
      <div className="w-full flex flex-col mt-7.5">
        <p className="text-sm text-foreground/50">{subTitle}</p>
        <h1 className="mt-2.5 text-xl font-medium">{title}</h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <p className="text-sm text-foreground/50">Seller:</p>
            <p className="border-b border-border-secondary text-sm">{seller}</p>
          </div>
          <div className="flex items-center gap-1">
            <Eye size={16} className="text-foreground/50" />
            <p className="text-sm text-foreground/50">{views}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-5.5">
          <p className="text-xl font-medium text-gold-main">${price}</p>
          <Link
            href={"/auth"}
            className="rounded-none py-2.5 px-5 bg-gold-main hover:bg-gold-main/90 text-white"
          >
            Contact seller
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BestSellingCard;
