import React from "react";
import BestSellingSlider from "./BestSellingSlider";

const BestSelling = () => {
  return (
    <div className="bg-[#f0f0e5]">
      <div className="container mx-auto">
        <h1 className="font-medium text-5xl mb-10">
          Top Picks from Verified Sellers
        </h1>
        <BestSellingSlider />
      </div>
    </div>
  );
};

export default BestSelling;