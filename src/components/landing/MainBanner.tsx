import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";

const MainBanner = () => {
  return (
    <section className="w-full h-[808px] relative">
      <div className="absolute inset-0 w-full h-[calc(700px+108px)] z-[-1]">
        <Image
          src="/landing/hero-banner.png"
          alt="hero banner"
          fill
          priority
          className="object-cover"
        />
      </div>
      <div className="flex justify-center items-center w-full h-full">
        <div className="flex flex-col">
          <h1 className="text-6xl max-w-[800px] font-bold text-center leading-tight bg-gradient-to-b from-[#f0f0e5] to-gray-secondary bg-clip-text text-transparent">
            Trusted and transparent weapon marketplace
          </h1>
          <p className="text-xl text-white mt-10 text-center">
            Connect buyers and sellers of any kind of weapon
          </p>
          <div className="flex items-center w-full justify-center gap-5 mt-10">
            <Button className="py-3 px-6 font-medium text-white bg-gold-main rounded-none">
              Explore catalog
            </Button>
            <Button
              variant={"ghost"}
              className="rounded-none border py-3 px-6 font-medium border-gray-200 text-white"
            >
              Start selling
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainBanner;