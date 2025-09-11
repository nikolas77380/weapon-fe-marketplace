import React, { useMemo } from "react";
import SellerActionCard from "./SellerActionCard";
import { Box, Eye, MessageSquare, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { calculateTotalViews } from "@/lib/productUtils";
import { Product, UserProfile } from "@/lib/types";

interface SellerAccountHeaderProps {
  currentUser: UserProfile;
  products: Product[];
}

const SellerAccountHeader = ({
  currentUser,
  products,
}: SellerAccountHeaderProps) => {
  const router = useRouter();
  const totalViews = calculateTotalViews(products);
  const activeListings = useMemo(
    () => products.filter((product) => product.status === "available").length,
    [products]
  );

  const handleClickToSettings = () => {
    router.push("/account/settings");
  };

  const handleClickToAddProduct = () => {
    router.push("/account/add-product");
  };
  return (
    <div>
      <h2 className="font-medium">Weclome back, {currentUser.username}</h2>
      {/* Right Buttons */}
      <div className="flex items-center justify-end mb-8 gap-3.5">
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
          count={activeListings}
          icon={<Box size={30} className="mr-1" />}
        />
        <SellerActionCard
          title="Total views"
          count={totalViews.toString()}
          icon={<Eye size={30} className="mr-1" />}
        />
        <SellerActionCard
          title="Unread chats"
          count={0}
          icon={<MessageSquare size={30} className="mr-1" />}
        />
      </div>
    </div>
  );
};

export default SellerAccountHeader;
