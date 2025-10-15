"use client";

import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../../ui/navigation-menu";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import type { UserProfile } from "@/lib/types";
import Messages from "./Messages";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import BuyerMenuContent from "./BuyerMenuContent";

interface BuyerNavbarAuthProps {
  user: UserProfile;
  onLogout: () => void;
}

const BuyerNavbar = ({ user, onLogout }: BuyerNavbarAuthProps) => {
  return (
    <NavigationMenu viewport={false} className="z-50">
      <NavigationMenuList className="flex items-center gap-6">
        <Messages />
        <LanguageSwitcher classNameSelectValue="text-gold-main" />
        <NavigationMenuItem className="flex items-center gap-3">
          <NavigationMenuTrigger>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarFallback className="bg-black text-white text-sm">
                {user.displayName?.charAt(0) || user.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm items-start flex ml-2">
              <div className="font-medium text-white">
                {user.displayName || user.username}
              </div>
            </div>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="border-gold-main">
            <BuyerMenuContent user={user} onLogout={onLogout} />
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default BuyerNavbar;
