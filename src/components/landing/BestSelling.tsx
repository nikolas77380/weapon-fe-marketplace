import React from "react";
import BestSellingSlider from "./BestSellingSlider";

const BestSelling = () => {
  return (
    <div className="bg-gray-primary py-10">
      <div className="container mx-auto">
        <h1 className="text-center font-bold text-4xl font-roboto">
          Best selling weapons and armour
        </h1>
        <BestSellingSlider />
      </div>
    </div>
  );
};

export default BestSelling;
