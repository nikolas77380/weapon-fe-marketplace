import { Product } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Ellipsis, Eye, MessageSquare, SquarePen, Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";

interface SellerListenedCardProps {
  product: Product;
}

const SellerListenedCard = ({ product }: SellerListenedCardProps) => {
  return (
    <div className="border border-gray-primary rounded-xl px-8 py-6 flex justify-between w-full">
      {/* 1 */}
      <div className="flex gap-2.5">
        <Image
          src={"/gun.jpg"}
          alt={product.title}
          width={80}
          height={60}
          className="rounded-md object-cover aspect-square"
        />
        <div className="flex flex-col">
          <h2 className="font-roboto text-xl">{product.title}</h2>
          <div className="flex items-center mt-1 gap-6 font-roboto font-extralight text-sm text-black">
            <p>{product.category?.name}</p>
            <p>{product.price}$</p>
            <p>Posted: {formatDate(product.createdAt)}</p>
          </div>
          <div className="mt-1 flex items-center gap-6 font-roboto font-medium text-sm text-gray-primary">
            <div className="flex items-center gap-1.5">
              <Eye size={18} />
              <p>15 views</p>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageSquare size={18} />
              <p>10 Inquires</p>
            </div>
          </div>
        </div>
      </div>
      {/* 2 */}
      <div className="flex flex-col gap-8">
        <div className="bg-black text-white px-2.5 py-1 rounded-md text-sm font-medium self-start">
          {product.status}
        </div>
        <div className="flex items-center gap-3">
          <SquarePen size={20} className="cursor-pointer" />
          <Trash2 size={20} className="cursor-pointer text-red-500" />
          <Ellipsis size={20} className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default SellerListenedCard;
