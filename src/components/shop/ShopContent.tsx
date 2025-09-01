"use client";

import React from "react";
import ShopCard from "./ShopCard";
import { Button } from "../ui/button";
import { useProducts } from "@/hooks/useProducts";

const ShopContent = () => {
  const { products } = useProducts();
  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold">
        {products.length} {products.length === 1 ? "Result" : "Results"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-13">
        {products.map((item) => (
          <ShopCard item={item} key={item.id} />
        ))}
      </div>
      <div className="mt-12.5 flex items-center justify-center">
        <Button
          className="py-4.5 px-16 text-lg font-semibold text-[#D3D3D3] bg-transparent border 
        border-[#D3D3D3] cursor-pointer hover:bg-[#D3D3D3] hover:text-white transition-colors duration-300"
        >
          Load More
        </Button>
      </div>
    </div>
  );
};

export default ShopContent;
