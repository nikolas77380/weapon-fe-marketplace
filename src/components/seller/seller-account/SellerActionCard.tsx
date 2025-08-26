import React from "react";

interface SellerActionCardProps {
  title: string;
  count?: number | string;
  icon?: React.ReactNode;
}

const SellerActionCard = ({ title, count, icon }: SellerActionCardProps) => {
  return (
    <div className="border border-gray-primary rounded-lg p-3.5 gap-2.5 flex justify-between w-full">
      <div className="flex flex-col gap-2.5">
        <p className="font-roboto font-light">{title}</p>
        <p className="font-roboto font-medium text-xl">{count}</p>
      </div>
      <div className="flex items-center justify-center">
        {icon ? icon : null}
      </div>
    </div>
  );
};

export default SellerActionCard;
