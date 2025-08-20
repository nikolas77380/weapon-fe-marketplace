import { shopCategories } from "@/mockup/shop";
import React from "react";
import ShopCard from "./ShopCard";
import { Button } from "../ui/button";

const ShopContent = () => {
  const shopCards = shopCategories;
  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold">{shopCards.length} Results</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-13">
        {shopCards.map((item) => (
          <ShopCard item={item} key={item.id} />
        ))}
      </div>
      <div className="mt-12.5 flex items-center justify-center">
        <Button className="py-4.5 px-16 text-lg font-semibold text-[#D3D3D3] bg-transparent border 
        border-[#D3D3D3] cursor-pointer hover:bg-[#D3D3D3] hover:text-white transition-colors duration-300">
          Load More
        </Button>
      </div>
    </div>
  );
};

export default ShopContent;
