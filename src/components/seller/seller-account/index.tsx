"use client";

import { UserProfile } from "@/lib/types";
import SellerActionCard from "./SellerActionCard";
import { Box, Clock4, Eye, MessageSquare, Plus, Settings } from "lucide-react";
import SellerAccountTabs from "./SellerTabs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const SellerAccount = ({ currentUser }: { currentUser: UserProfile }) => {
  const router = useRouter();

  const handleClickToSettings = () => {
    router.push("/account/settings");
  };

  const handleClickToAddProduct = () => {
    router.push("/account/add-product");
  };

  return (
    <div className="w-full min-h-screen h-full">
      <div className="container mx-auto mt-18 flex flex-col">
        <h2 className="font-medium">Weclome back, {currentUser.username}</h2>
        {/* Right Buttons */}
        <div className="flex items-center justify-end mb-8 gap-3.5">
          <Button
            className="border border-yellow-400 bg-[#FCF8D1] rounded-sm cursor-pointer duration-300 transition-all
          hover:bg-yellow-200 px-1"
          >
            <div className="flex items-center gap-2 py-2 px-3">
              <Clock4 size={16} className="text-orange-500" />
              <p className="text-xs font-semibold text-orange-500">
                Verification Pending
              </p>
            </div>
          </Button>

          <Button
            className="border border-black bg-black rounded-sm cursor-pointer duration-300 transition-all
          hover:bg-black/80 px-1"
            onClick={handleClickToAddProduct}
          >
            <div className="flex items-center gap-2 py-2 px-3">
              <Plus size={16} className="text-white" />
              <p className="text-xs font-semibold text-white">Add product</p>
            </div>
          </Button>

          <Button
            className="border border-black bg-white rounded-sm cursor-pointer duration-300 transition-all
          hover:bg-gray-100 px-1"
            onClick={handleClickToSettings}
          >
            <div className="flex items-center gap-2 py-2 px-3">
              <Settings size={16} className="text-black" />
              <p className="text-xs font-semibold text-black">Settings</p>
            </div>
          </Button>
        </div>
        {/* Action Cards */}
        <div className="flex items-center justify-between gap-12.5 mb-15">
          <SellerActionCard
            title="Active Listings"
            count="2"
            icon={<Box size={30} className="mr-1" />}
          />
          <SellerActionCard
            title="Total views"
            count="55"
            icon={<Eye size={30} className="mr-1" />}
          />
          <SellerActionCard
            title="Total views"
            count="55"
            icon={<MessageSquare size={30} className="mr-1" />}
          />
        </div>
        {/* Seller Tabs */}
        <SellerAccountTabs />
      </div>
    </div>
  );
};

export default SellerAccount;
