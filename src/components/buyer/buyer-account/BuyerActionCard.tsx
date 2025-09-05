import React from "react";

interface BuyerActionCardProps {
  title: string;
  count?: number | string;
  icons?: React.ReactNode;
}

const BuyerActionCard = ({ title, count, icons }: BuyerActionCardProps) => {
  return (
    <div className="bg-[#E7E7E7] p-3.5 gap-3.5 flex items-center">
      {icons ? icons : null}
      <div className="flex flex-col">
        <p className="font-roboto font-medium text-xl">{count}</p>
        <p className="font-roboto font-light">{title}</p>
      </div>
    </div>
  );
};

export default BuyerActionCard;
