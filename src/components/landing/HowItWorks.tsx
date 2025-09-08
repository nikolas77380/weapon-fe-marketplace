import { howItWorksData } from "@/mockup/landing";
import React from "react";
import HowItWorksCard from "./HowItWorksCard";

const HowItWorks = () => {
  return (
    <section className="py-25 w-full bg-[#f0f0e5]">
      <div className="container mx-auto">
        <div className="flex flex-col">
          <h1 className="text-center text-5xl font-medium">How it works</h1>
          <p className="mt-5 text-center text-xl">
            Simple process for buyers and sellers
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-7.5">
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
