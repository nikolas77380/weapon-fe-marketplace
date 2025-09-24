import React from "react";

interface BuyerActionCardProps {
  title: string;
  count?: number | string;
  icons?: React.ReactNode;
}

const BuyerActionCard = ({ title, count, icons }: BuyerActionCardProps) => {
  return (
    <div className="border border-gray-primary rounded-lg p-3.5 gap-2.5 flex justify-between w-full h-full 
    min-[450px]:min-h-[100px] min-[450px]:max-h-[100px] min-h-full">
      <div className="flex flex-col gap-2.5">
        <p className="font-light text-xs md:text-sm lg:text-base">{title}</p>
        <p className="font-medium text-base lg:text-xl">{count}</p>
      </div>
      <div className="flex items-end lg:items-center justify-center">
        {icons ? icons : null}
      </div>
    </div>
  );
};

export default BuyerActionCard;
