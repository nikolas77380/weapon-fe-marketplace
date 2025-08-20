import { ShopCategory } from "@/mockup/shop";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { MessageSquare, Star } from "lucide-react";
import { Button } from "../ui/button";

interface ShopCardProps {
  item: ShopCategory;
}

const ShopCard = ({ item }: ShopCardProps) => {
  const badge = item.badge || "";
  return (
    <div className="border border-[#D3D3D3] rounded-lg flex flex-col">
      <div className="relative border-b border-[#D3D3D3] overflow-hidden">
        <Image
          src={item.img}
          alt={item.title}
          width={300}
          height={200}
          className="w-full h-[125px] object-cover rounded-t-lg"
        />
        <div className="absolute top-2 left-2">
          <Badge
            className={`
              text-xs font-semibold
              ${badge === "New" && "bg-green-500 text-white"}
              ${badge === "Pre-order" && "bg-yellow-500 text-black"}
              ${badge === "In Stock" && "bg-blue-500 text-white"}
            `}
          >
            {item.badge}
          </Badge>
        </div>
      </div>
      <div className="flex flex-col p-2">
        <div className="flex items-center justify-between">
          <div className="px-2.5 py-0.5 bg-[#D9D9D9] rounded-sm">
            <p className="text-xs">{item.category}</p>
          </div>
          <p className="text-sm font-semibold">{item.price}$</p>
        </div>

        <div className="flex flex-col gap-2 mt-6.5">
          <p className="font-extrabold text-sm">{item.title}</p>
          <p className="font-light text-sm">{item.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-7.5 rounded-full bg-black flex items-center justify-center">
                <p className="text-xs text-white font-bold">{item.seller}</p>
              </div>
              <div className="flex items-center gap-1">
                <Star size={24} className="text-yellow-400" />
                <p className="text-xs font-medium">{item.rating}</p>
              </div>
            </div>

            <div className="rounded-sm bg-green-500 py-0.5 px-2">
              <p className="text-xs text-white font-semibold">{item.status}</p>
            </div>

            <div>
              <p className="text-xs font-bold text-[#D3D3D3]">1040 views</p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Button className="flex items-center gap-2 py-2 w-2/3">
              <MessageSquare size={15} />
              <p className="text-xs font-semibold">Contact Seller</p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;
