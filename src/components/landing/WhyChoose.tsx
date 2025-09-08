import { whyChooseData } from "@/mockup/landing";
import React from "react";
import WhyChooseCard from "./WhyChooseCard";

const WhyChoose = () => {
  return (
    <section className="py-25 bg-[#f0f0e5]">
      <div className="container mx-auto">
        <div className="mt-14 grid grid-cols-3 gap-25">
          {whyChooseData.map((item, index) => (
            <div key={index}>
              <WhyChooseCard {...item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
