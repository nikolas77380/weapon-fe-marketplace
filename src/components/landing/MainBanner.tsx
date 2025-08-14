import React from "react";

const MainBanner = () => {
  return (
    <section className="bg-gray-primary py-25">
      <div className="flex flex-col text-center gap-7">
        <h1 className="flex flex-col items-center font-bold text-4xl font-roboto">
          <span>Trusted and transparent</span>
          <span>weapon marketplace</span>
        </h1>
        <p className="text-xl">
          Connect buyers and sellers of any kind of weapon
        </p>
      </div>
    </section>
  );
};

export default MainBanner;
