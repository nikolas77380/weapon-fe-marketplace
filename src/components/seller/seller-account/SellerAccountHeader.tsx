"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { UserProfile } from "@/lib/types";
import { useAuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

type SellerAccountHeaderProps = {
  currentUser: UserProfile;
  className?: string;
};

const SellerAccountHeader: React.FC<SellerAccountHeaderProps> = ({
  currentUser,
  className,
}) => {
  const { handleLogout } = useAuthContext();
  const t = useTranslations("SellerAccountHeader");

  return (
    <div className={className}>
      <div className="flex items-center justify-between mt-3 lg:mt-0 mb-8 gap-3.5">
        <h2 className="font-medium text-xl lg:text-2xl">
          {t("titleWelcome")}, {currentUser.username}
        </h2>
        <Button
          className="bg-gold-main rounded-sm px-3 py-2 text-white hover:bg-gold-main/90"
          onClick={handleLogout}
        >
          <p className="text-xs sm:text-sm font-semibold">
            {t("titleLogout")}
          </p>
        </Button>
      </div>
    </div>
  );
};

export default SellerAccountHeader;
