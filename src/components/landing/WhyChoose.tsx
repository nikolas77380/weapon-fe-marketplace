import { whyChooseData } from "@/mockup/landing";
import React from "react";
import WhyChooseCard from "./WhyChooseCard";

const WhyChoose = () => {
  return (
    <section className="py-18">
      <div className="container mx-auto">
        <h1 className="text-center font-bold text-4xl font-roboto">
          Why Choose Our Platform
        </h1>
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
