import { howItWorksData } from "@/mockup/landing";
import React from "react";
import HowItWorksCard from "./HowItWorksCard";

const HowItWorks = () => {
  return (
    <section className="mt-5 pb-11">
      <div className="container mx-auto">
        <div className="flex flex-col text-center gap-7">
          <h1 className="flex flex-col items-center font-bold text-4xl font-roboto">
            How it works
          </h1>
          <p className="text-xl">Simple process for buyers and sellers</p>
        </div>
        <div className="mt-14 grid grid-cols-3 gap-66 px-20">
          {howItWorksData.map((item) => (
            <div key={item.id}>
              <HowItWorksCard {...item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
