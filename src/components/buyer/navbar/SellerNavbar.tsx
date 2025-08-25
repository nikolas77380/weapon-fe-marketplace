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
import { Badge } from "../../ui/badge";
import { Separator } from "../../ui/separator";
import { Button } from "../../ui/button";
import type { UserProfile } from "@/lib/types";

interface BuyerNavbarAuthProps {
  user: UserProfile;
  onLogout: () => void;
}

const SellerNavbar = ({ user, onLogout }: BuyerNavbarAuthProps) => {
  return (
    <NavigationMenu viewport={false} className="z-50">
      <NavigationMenuList className="flex items-center gap-6">
        <NavigationMenuItem className="relative">
          <MessageCircle size={22} className="text-gray-400 cursor-pointer" />
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] size-4.5 rounded-full">
            3
          </Badge>
        </NavigationMenuItem>
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
                <p className="font-semibold">User Name</p>
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
                      <p className="font-semibold">My Account</p>
                    </div>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild className="p-3">
                  <Link href="#">
                    <div className="flex items-center gap-3">
                      <PackageSearch size={18} />
                      <p className="font-semibold">Browse Products</p>
                    </div>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild className="p-3">
                  <Link href="#">
                    <div className="flex items-center gap-3">
                      <PackageSearch size={18} />
                      <p className="font-semibold">Add new product</p>
                    </div>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild className="p-3">
                  <Link href="#">
                    <div className="flex items-center gap-3">
                      <MessageCircle size={18} />
                      <div className="flex items-center justify-between w-full">
                        <p className="font-semibold">Messages</p>
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
                      <p className="font-semibold">Settings</p>
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
                      <p className="font-semibold text-red-600">Sign Out</p>
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

export default SellerNavbar;
