import React from "react";
import Link from "next/link";

const GetStarted = () => {
  return (
    <section className="bg-gray-primary pt-11 pb-16 flex flex-col justify-center items-center">
      <div className="flex flex-col text-center gap-7">
        <h1 className="flex flex-col items-center font-bold text-4xl font-roboto">
          Ready to get started?
        </h1>
        <div className="flex flex-col items-center justify-center">
          <p className="text-xl w-full max-w-[410px] text-center">
            Join professionals already using our platform to buy and sell weapon
            prototypes.
          </p>
          <Link
            href="/register"
            className="bg-white rounded-xl mt-10 font-bold text-2xl p-5 border border-black 
            hover:bg-white/80 hover:border-black/80 duration-300 transition-all"
          >
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GetStarted;
