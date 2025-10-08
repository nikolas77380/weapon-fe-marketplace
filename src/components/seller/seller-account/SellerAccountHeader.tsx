import React, { useMemo } from "react";
import SellerActionCard from "./SellerActionCard";
import { Box, Eye, MessageSquare, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { calculateTotalViews } from "@/lib/productUtils";
import { Product, UserProfile } from "@/lib/types";
import { useTranslations } from "next-intl";

interface SellerAccountHeaderProps {
  currentUser: UserProfile;
  products: Product[];
  className?: string;
}

const SellerAccountHeader = ({
  currentUser,
  products,
  className,
}: SellerAccountHeaderProps) => {
  const t = useTranslations("SellerAccountHeader");

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
    <div className={className}>
      <h2 className="font-medium text-xl lg:text-2xl">
        {t('titleWelcome')}, {currentUser.username}
      </h2>
      {/* Right Buttons */}
      <div className="flex items-center lg:justify-end mt-3 lg:mt-0 mb-8 gap-3.5">
        <Button
          className="bg-gold-main rounded-sm cursor-pointer duration-300 transition-all px-1 hover:bg-gold-main/90"
          onClick={handleClickToAddProduct}
        >
          <div className="flex items-center gap-2 py-2 px-3">
            <Plus size={16} className="text-white" />
            <p className="text-xs sm:text-sm font-semibold text-white">{t('titleAddProduct')}</p>
          </div>
        </Button>

        <Button
          className="border border-gray-300 bg-white rounded-sm cursor-pointer duration-300 transition-all
          hover:bg-gray-100 px-1"
          onClick={handleClickToSettings}
        >
          <div className="flex items-center gap-2 py-2 px-3">
            <Settings size={16} className="text-black" />
            <p className="text-xs sm:text-sm font-semibold text-black">{t('titleSettings')}</p>
          </div>
        </Button>
      </div>
      {/* Action Cards */}
      <div className="flex flex-col min-[450px]:flex-row items-center justify-between gap-2 md:gap-7 lg:gap-12.5 mb-10 lg:mb-15">
        <SellerActionCard
          title={t('titleActiveListings')}
          count={activeListings}
          icon={<Box className="size-5 lg:size-7" />}
        />
        <SellerActionCard
          title={t('titleTotalViews')}
          count={totalViews.toString()}
          icon={<Eye className="size-5 lg:size-7" />}
        />
        <SellerActionCard
          title={t('titleUnreadChats')}
          count={0}
          icon={<MessageSquare className="size-5 lg:size-7" />}
        />
      </div>
    </div>
  );
};

export default SellerAccountHeader;
