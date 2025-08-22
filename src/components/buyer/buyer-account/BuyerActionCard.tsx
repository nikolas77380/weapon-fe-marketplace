import React from "react";

interface BuyerActionCardProps {
  title: string;
  count?: number | string;
  subTitle?: string;
}

const BuyerActionCard = ({ title, count, subTitle }: BuyerActionCardProps) => {
  return (
    <div className="border border-gray-primary rounded-lg p-3.5 gap-2.5 flex flex-col">
      <p className="font-roboto font-light">{title}</p>
      <p className="font-roboto font-medium text-xl">{count}</p>
      <p className="font-roboto text-sm font-thin">{subTitle}</p>
    </div>
  );
};

export default BuyerActionCard;
