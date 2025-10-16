import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { UserProfile } from "@/lib/types";
import React from "react";
import BuyerActionCard from "./BuyerActionCard";
import { FavouriteProduct } from "@/lib/favourites";
import Link from "next/link";
import { FileText, HandHelping, Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useUserRoleManagement } from "@/hooks/useChangeUserRole";
import { toast } from "sonner";

interface BuyerAccountHeaderProps {
  currentUser: UserProfile;
  favourites: FavouriteProduct[];
  className?: string;
}

const BuyerAccountHeader = ({
  currentUser,
  favourites,
  className,
}: BuyerAccountHeaderProps) => {
  const t = useTranslations("BuyerAccountHeader");
  const { changeUserRole, isLoading, isSuccess, error } =
    useUserRoleManagement();
  const handleBecomeSeller = async () => {
    try {
      await changeUserRole(currentUser?.id, "seller");
      toast.success(t("becomeSellerSuccess"));
    } catch (error) {
      toast.error(t("becomeSellerError"));
    }
  };
  return (
    <div className={className}>
      {/* Desktop Header */}
      <div className="hidden md:flex flex-col">
        <div className="flex items-center justify-between lg:border-l-2 lg:border-gold-main">
          <p className="text-2xl font-medium lg:ml-5">
            {t("titleUserDetails")}
          </p>
          <div>
            <Link
              href={"/"}
              className="bg-gold-main rounded-sm cursor-pointer duration-300 transition-all 
              hover:bg-gold-main/90 px-2 py-2 font-medium lg:px-3 lg:py-2.5 text-white"
            >
              {t("titleBrowseMarketplace")}
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex flex-col p-5">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-5 w-full">
                <Avatar className="size-18 lg:size-25 border border-gray-300 cursor-pointer">
                  <AvatarFallback className="bg-black text-white text-4xl lg:text-6xl uppercase">
                    {currentUser?.displayName?.charAt(0) ||
                      currentUser?.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-xl lg:text-2xl font-medium">
                    {currentUser?.displayName || currentUser?.username}
                  </p>
                  <div className="flex items-center gap-10">
                    <div className="flex flex-col mt-3.5">
                      <p className="text-muted-foreground text-sm lg:text-base">
                        {t("titleEmail")}
                      </p>
                      <p className="text-sm lg:text-base">
                        {currentUser?.email}
                      </p>
                    </div>
                    {currentUser?.metadata?.phoneNumbers && (
                      <div className="flex flex-col mt-3.5">
                        <p className="text-muted-foreground text-sm lg:text-base">
                          {t("titlePhone")}
                        </p>
                        <p>{currentUser?.metadata?.phoneNumbers}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-gold-main mb-4 text-center">
                  {t("becomeSellerText")}
                </p>
                <div className="w-full flex justify-center">
                  <Button
                    disabled={isLoading}
                    onClick={handleBecomeSeller}
                    className="px-2.5 py-2 w-fit bg-gold-main hover:bg-gold-main/80 text-white"
                  >
                    {t("becomeSellerButton")}
                  </Button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7.5 mt-7.5">
              <BuyerActionCard
                title={t("titleActiveInquiries")}
                count={2}
                icons={
                  <FileText className="size-5 lg:size-7" strokeWidth={0.5} />
                }
              />
              <BuyerActionCard
                title={t("titleSavedProducts")}
                count={favourites.length || 0}
                icons={<Heart className="size-5 lg:size-7" strokeWidth={0.5} />}
              />
              <BuyerActionCard
                title={t("titleCompletedDeals")}
                count={5}
                icons={
                  <HandHelping className="size-5 lg:size-7" strokeWidth={0.5} />
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="block md:hidden">
        <h2 className="font-medium text-lg sm:text-xl">
          {t("titleWelcome")},{" "}
          {currentUser?.displayName || currentUser?.username}
        </h2>
        <div className="flex items-center lg:justify-end mt-3 lg:mt-0 mb-8 gap-3.5">
          <Link
            href={"/"}
            className="bg-gold-main rounded-sm cursor-pointer duration-300 transition-all px-2.5 py-1.5 
            hover:bg-gold-main/90"
          >
            <p className="text-xs sm:text-sm font-medium text-white">
              {t("titleBrowseMarketplace")}
            </p>
          </Link>
        </div>
        <div className="flex flex-col mb-6">
          <p className="text-sm text-gold-main mb-4 text-center">
            {t("becomeSellerText")}
          </p>
          <div className="w-full flex justify-center">
            <Button
              disabled={isLoading}
              onClick={handleBecomeSeller}
              className="px-2.5 py-2 w-fit bg-gold-main hover:bg-gold-main/80 text-white"
            >
              {t("becomeSellerButton")}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 min-[400px]:grid-cols-3 gap-3 sm:gap-4">
          <BuyerActionCard
            title={t("titleActiveInquiries")}
            count={2}
            icons={<FileText className="size-8 sm:size-10" strokeWidth={0.5} />}
          />
          <BuyerActionCard
            title={t("titleSavedProducts")}
            count={favourites.length || 0}
            icons={<Heart className="size-8 sm:size-10" strokeWidth={0.5} />}
          />
          <BuyerActionCard
            title={t("titleCompletedDeals")}
            count={5}
            icons={
              <HandHelping className="size-8 sm:size-10" strokeWidth={0.5} />
            }
          />
        </div>
      </div>
    </div>
  );
};

export default BuyerAccountHeader;
