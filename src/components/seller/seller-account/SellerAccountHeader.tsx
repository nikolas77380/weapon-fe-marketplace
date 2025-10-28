import React, { useMemo } from "react";
import SellerActionCard from "./SellerActionCard";
import { Box, Eye, MessageSquare, Heart } from "lucide-react";
import { calculateTotalViews } from "@/lib/productUtils";
import { Product, UserProfile } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useFavourites } from "@/hooks/useFavourites";
import { useUnreadChats } from "@/context/UnreadChatsContext";

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
  const { favourites } = useFavourites();
  const { unreadChatsCount } = useUnreadChats();
  const totalViews = calculateTotalViews(products);
  const activeListings = useMemo(
    () => products.filter((product) => product.status === "available").length,
    [products]
  );

  return (
    <div className={className}>
      <h2 className="font-medium text-xl lg:text-2xl mb-8">
        {t("titleWelcome")}, {currentUser.username}
      </h2>
      {/* Right Buttons */}
      {/* <div className="flex items-center lg:justify-end mt-3 lg:mt-0 mb-8 gap-3.5">
        <Button
          className="bg-gold-main rounded-sm cursor-pointer duration-300 transition-all px-1 hover:bg-gold-main/90"
          onClick={handleClickToAddProduct}
        >
          <div className="flex items-center gap-2 py-2 px-3">
            <Plus size={16} className="text-white" />
            <p className="text-xs sm:text-sm font-semibold text-white">
              {t("titleAddProduct")}
            </p>
          </div>
        </Button>
      </div> */}
      {/* Action Cards */}
      <div className="grid grid-cols-1 min-[450px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-7 lg:gap-9 xl:gap-10 mb-10 lg:mb-15">
        {products.length > 0 && (
          <>
            <SellerActionCard
              title={t("titleActiveListings")}
              count={activeListings}
              icon={<Box className="size-5 lg:size-7" />}
            />
            <SellerActionCard
              title={t("titleTotalViews")}
              count={totalViews.toString()}
              icon={<Eye className="size-5 lg:size-7" />}
            />
          </>
        )}
        <SellerActionCard
          title={t("titleSavedProducts")}
          count={favourites.length || 0}
          icon={<Heart className="size-5 lg:size-7" strokeWidth={0.5} />}
        />
        <SellerActionCard
          title={t("titleUnreadChats")}
          count={unreadChatsCount}
          icon={<MessageSquare className="size-5 lg:size-7" />}
        />
      </div>
    </div>
  );
};

export default SellerAccountHeader;
