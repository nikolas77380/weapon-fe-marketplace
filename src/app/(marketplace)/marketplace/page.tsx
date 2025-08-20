import FiltersTop from "@/components/shop/FiltersTop";
import LeftFilters from "@/components/shop/LeftFilters";
import ShopCards from "@/components/shop/ShopCards";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

const ShopPage = () => {
  return (
    <div className="border-t border-[#D3D3D3]">
      <div className="container mx-auto">
        <div
          className="mt-12 border border-[#D3D3D3] rounded-lg h-21 flex items-center justify-between
        px-6 w-full"
        >
          {/* <Search /> */}
          <div className="relative w-1/2">
            <Input
              placeholder="Search weapons, armour, accessories ..."
              className="pl-9 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 
            placeholder:text-[#B3B3B3] h-10 w-1/2 border-transparent shadow-none"
            />
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#B3B3B3]"
            />
          </div>
          {/* Filters top */}
          <FiltersTop />
        </div>
        {/* Shop Content */}
        <div className="mt-12 flex gap-12 h-full w-full">
          {/* Left Filters */}
          <LeftFilters />
          
          {/* Right Content */}
          <div className="w-full h-full">
            <ShopCards />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
