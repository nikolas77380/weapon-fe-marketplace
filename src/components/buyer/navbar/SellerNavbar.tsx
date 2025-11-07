"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from "../../ui/navigation-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar";
import type { UserProfile } from "@/lib/types";
import Messages from "./Messages";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import CurrencySwitcher from "@/components/ui/CurrencySwitcher";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface BuyerNavbarAuthProps {
  user: UserProfile;
  onLogout: () => void;
}

const SellerNavbar = ({ user }: BuyerNavbarAuthProps) => {
  const t = useTranslations("Navbar.sellerNavbar");
  const router = useRouter();

  const handleAddProductClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/account?tab=addProduct");
  };
  return (
    <NavigationMenu viewport={false} className="z-50">
      <NavigationMenuList className="flex items-center gap-6">
        <NavigationMenuLink asChild className="hidden 2xl:block">
          <button
            onClick={handleAddProductClick}
            className="border-none cursor-pointer hover:bg-transparent bg-transparent [&:hover_svg]:text-white/40 [&:hover_p]:text-white/40"
          >
            <div className="flex items-center py-2.5 gap-2">
              <Plus
                size={16}
                className="text-gold-main duration-300 transition-all pointer-events-none"
              />
              <p className="text-sm font-medium text-gold-main duration-300 transition-all pointer-events-none">
                {t("titleAddProduct")}
              </p>
            </div>
          </button>
        </NavigationMenuLink>

        <Messages />

        <NavigationMenuLink asChild>
          <CurrencySwitcher classNameSelectValue="text-gold-main" />
        </NavigationMenuLink>

        <NavigationMenuLink asChild>
          <LanguageSwitcher classNameSelectValue="text-gold-main" />
        </NavigationMenuLink>

        <Link
          href="/account"
          className="flex items-center border border-gold-main rounded-lg py-1 lg:py-1.5 px-3 lg:px-4 h-10"
        >
          <Avatar className="h-6 w-6 cursor-pointer">
            <AvatarImage src={user.metadata?.avatar?.url} alt={user.username} />
            <AvatarFallback className="bg-black text-white text-sm uppercase">
              {user.displayName?.charAt(0) || user.username.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm items-start flex ml-2">
            <p className="font-medium text-white">
              {user.displayName || user.username}
            </p>
          </div>

          {/* <NavigationMenuContent className="border-gold-main">
            <SellerMenuContent user={user} onLogout={onLogout} />
          </NavigationMenuContent> */}
        </Link>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default SellerNavbar;
