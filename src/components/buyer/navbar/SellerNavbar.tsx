"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
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
  const pathname = usePathname();

  const handleAddProductClick = (e: React.MouseEvent) => {
    e.preventDefault();
    sessionStorage.setItem("accountTab", "addProduct");

    // If we're already on /account, dispatch custom event to switch tab
    if (pathname === "/account") {
      window.dispatchEvent(
        new CustomEvent("accountTabChange", { detail: "addProduct" })
      );
    } else {
      router.push("/account");
    }
  };
  return (
    <NavigationMenu viewport={false} className="z-50">
      <NavigationMenuList className="flex items-center gap-6">
        <NavigationMenuLink asChild className="hidden 2xl:block">
          <button
            onClick={handleAddProductClick}
            className="border-none cursor-pointer hover:bg-transparent bg-transparent group"
          >
            <div className="flex items-center gap-2 py-2.5 px-4">
              <Plus
                size={16}
                className="text-gold-main group-hover:text-white/40 duration-300 transition-all"
              />
              <p className="text-sm font-medium text-gold-main group-hover:text-white/40 duration-300 transition-all">
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

        <Link href="/account" className="flex items-center">
          <Avatar className="h-8 w-8 cursor-pointer">
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
