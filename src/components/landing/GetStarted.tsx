import React from "react";
import Image from "next/image";
import Link from "next/link";

const GetStarted = () => {
  return (
    <section className="w-full h-[473px] relative">
      <div className="absolute z-[-1] inset-0 w-full h-full">
        <Image
          src="/landing/bg-started.png"
          alt="bg started"
          fill
          priority
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-center max-w-[918px] font-bold text-5xl bg-gradient-to-r from-white to-[#9D9D9D] bg-clip-text text-transparent">
          Join professionals already using our platform to buy and sell weapon
          prototypes.
        </h1>
        <Link href={"/auth?mode=register"} className="mt-10 py-3 px-6 bg-gold-main rounded-none hover:bg-gold-main/90 
        duration-300 transition-all text-white">
          Create Account
        </Link>
      </div>
    </section>
  );
};

export default GetStarted;
