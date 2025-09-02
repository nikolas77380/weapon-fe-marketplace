import React from "react";
import FilteringContent from "@/components/shop/FilteringContent";

const ShopPage = () => {
  return (
    <div className="border-t border-[#D3D3D3] mb-20">
      <div className="container mx-auto">
        {/* Shop Filtering Content */}
        <FilteringContent />
      </div>
    </div>
  );
};

export default ShopPage;
