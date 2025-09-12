"use client";

import Link from "next/link";
import React from "react";
import {
  MessageCircle,
  User,
  PackageSearch,
  Settings,
  LogOut,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../../ui/navigation-menu";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import { Separator } from "../../ui/separator";
import { Button } from "../../ui/button";
import type { UserProfile } from "@/lib/types";
import Messages from "./Messages";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useTranslations } from "next-intl";
import { useFavourites } from "@/hooks/useFavourites";

interface BuyerNavbarAuthProps {
  user: UserProfile;
  onLogout: () => void;
}

const BuyerNavbar = ({ user, onLogout }: BuyerNavbarAuthProps) => {
  const t = useTranslations("Navbar.buyerNavbar");
  const { favourites } = useFavourites();
  return (
    <NavigationMenu viewport={false} className="z-50">
      <NavigationMenuList className="flex items-center gap-6">
        <LanguageSwitcher />
        <Messages />
        <NavigationMenuItem className="flex items-center gap-3">
          <NavigationMenuTrigger>
            <Avatar className="h-8 w-8 border border-gray-300 cursor-pointer">
              <AvatarFallback className="bg-black text-white text-sm">
                {user.displayName?.charAt(0) || user.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm items-start flex flex-col ml-2">
              <div className="font-medium">
                {user.displayName || user.username}
              </div>
              <div className="text-gray-600 capitalize">{user.role.name}</div>
            </div>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-1">
              <div className="flex flex-col px-3 pt-2">
                <p className="font-semibold">{t("titleUserName")}</p>
                <p className="text-muted-foreground text-sm">
                  {user.displayName || user.username}
                </p>
              </div>
              <Separator className="mt-2" />
              <li>
                <NavigationMenuLink asChild className="p-3">
                  <Link href="/account">
                    <div className="flex items-center gap-3">
                      <User size={18} />
                      <p className="font-semibold">{t("titleMyAccount")}</p>
                    </div>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild className="p-3">
                  <Link
                    href="/account"
                    onClick={() =>
                      sessionStorage.setItem("accountTab", "favourites")
                    }
                  >
                    <div className="flex items-center gap-3">
                      <PackageSearch size={18} />
                      <div className="flex items-center justify-between w-full">
                        <p className="font-semibold">{t("titleFavourites")}</p>
                        <div className="bg-muted text-xs px-1.5 py-0.5 rounded-full font-semibold">
                          {favourites.length || 0}
                        </div>
                      </div>
                    </div>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild className="p-3">
                  <Link href="/messages">
                    <div className="flex items-center gap-3">
                      <MessageCircle size={18} />
                      <div className="flex items-center justify-between w-full">
                        <p className="font-semibold">{t("titleMessages")}</p>
                        <div className="bg-muted text-xs px-1.5 py-0.5 rounded-full font-semibold">
                          3
                        </div>
                      </div>
                    </div>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild className="p-3">
                  <Link href="#">
                    <div className="flex items-center gap-3">
                      <Settings size={18} />
                      <p className="font-semibold">{t("titleSettings")}</p>
                    </div>
                  </Link>
                </NavigationMenuLink>
                <Separator />
                <NavigationMenuLink asChild className="p-3">
                  <Button
                    onClick={onLogout}
                    className="bg-transparent hover:bg-red-50 w-full flex items-start cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <LogOut size={18} />
                      <p className="font-semibold text-red-600">
                        {t("titleSignOut")}
                      </p>
                    </div>
                  </Button>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default BuyerNavbar;
