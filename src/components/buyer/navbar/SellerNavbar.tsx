"use client";

import Link from "next/link";
import React from "react";
import { Plus } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../../ui/navigation-menu";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import type { UserProfile } from "@/lib/types";
import Messages from "./Messages";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useTranslations } from "next-intl";
import SellerMenuContent from "./SellerMenuContent";

interface BuyerNavbarAuthProps {
  user: UserProfile;
  onLogout: () => void;
}

const SellerNavbar = ({ user, onLogout }: BuyerNavbarAuthProps) => {
  const t = useTranslations("Navbar.sellerNavbar");
  return (
    <NavigationMenu viewport={false} className="z-50">
      <NavigationMenuList className="flex items-center gap-6">
        <NavigationMenuLink asChild className="hidden 2xl:block">
          <Link
            href="/account/add-product"
            className="border-none cursor-pointer duration-500 transition-all
            hover:bg-white/70"
          >
            <div className="flex items-center gap-2 py-2.5 px-4">
              <Plus size={16} className="text-gold-main" />
              <p className="text-sm font-medium text-gold-main">
                {t("titleAddProduct")}
              </p>
            </div>
          </Link>
        </NavigationMenuLink>

        <Messages />

        <NavigationMenuLink asChild>
          <LanguageSwitcher classNameSelectValue="text-gold-main" />
        </NavigationMenuLink>

        <NavigationMenuItem className="flex items-center gap-3">
          <NavigationMenuTrigger>
            <Avatar className="h-8 w-8 border border-gold-main cursor-pointer">
              <AvatarFallback className="bg-black text-white text-sm uppercase">
                {user.displayName?.charAt(0) || user.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm items-start flex flex-col ml-2">
              <div className="font-medium text-white">
                {user.displayName || user.username}
              </div>
              <div className="text-white/70 capitalize">{user.role.name}</div>
            </div>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="border-gold-main">
            <SellerMenuContent user={user} onLogout={onLogout} />
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default SellerNavbar;
