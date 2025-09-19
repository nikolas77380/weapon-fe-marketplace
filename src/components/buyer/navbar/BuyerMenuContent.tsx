"use client";

import React from "react";
import Link from "next/link";
import {
  MessageCircle,
  User,
  PackageSearch,
  Settings,
  LogOut,
} from "lucide-react";
import { NavigationMenuLink } from "../../ui/navigation-menu";
import { Separator } from "../../ui/separator";
import { Button } from "../../ui/button";
import type { UserProfile } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useFavourites } from "@/hooks/useFavourites";

interface BuyerMenuContentProps {
  user: UserProfile;
  onLogout: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const BuyerMenuContent = ({
  user,
  onLogout,
  isMobile = false,
  onClose,
}: BuyerMenuContentProps) => {
  const t = useTranslations("Navbar.buyerNavbar");
  const { favourites } = useFavourites();

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleFavouritesClick = () => {
    sessionStorage.setItem("accountTab", "favourites");
    handleLinkClick();
  };

  const containerClass = isMobile ? "space-y-2" : "grid w-[200px] gap-1";

  const linkClass = isMobile
    ? "flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
    : "p-3";

  const textClass = isMobile ? "text-sm xs:text-base" : "";

  return (
    <div className={containerClass}>
      {!isMobile && (
        <>
          <div className="flex flex-col px-3 pt-2">
            <p className="font-semibold">{t("titleUserName")}</p>
            <p className="text-muted-foreground text-sm">
              {user.displayName || user.username}
            </p>
          </div>
          <Separator className="mt-2" />
        </>
      )}

      <div className={isMobile ? "space-y-1" : ""}>
        {isMobile ? (
          <>
            <Link
              href="/account"
              onClick={handleLinkClick}
              className={linkClass}
            >
              <div className="flex items-center gap-3">
                <User size={18} />
                <p className={`font-semibold ${textClass}`}>
                  {t("titleMyAccount")}
                </p>
              </div>
            </Link>

            <Link
              href="/account"
              onClick={handleFavouritesClick}
              className={linkClass}
            >
              <div className="flex items-center gap-3">
                <PackageSearch size={18} />
                <div className="flex items-center justify-between w-full">
                  <p className={`font-semibold ${textClass}`}>
                    {t("titleFavourites")}
                  </p>
                  <div className="bg-muted text-xs px-1.5 py-0.5 rounded-full font-semibold">
                    {favourites.length || 0}
                  </div>
                </div>
              </div>
            </Link>

            <Link
              href="/messages"
              onClick={handleLinkClick}
              className={linkClass}
            >
              <div className="flex items-center gap-3">
                <MessageCircle size={18} />
                <div className="flex items-center justify-between w-full">
                  <p className={`font-semibold ${textClass}`}>
                    {t("titleMessages")}
                  </p>
                  <div className="bg-muted text-xs px-1.5 py-0.5 rounded-full font-semibold">
                    3
                  </div>
                </div>
              </div>
            </Link>

            <Link href="#" onClick={handleLinkClick} className={linkClass}>
              <div className="flex items-center gap-3">
                <Settings size={18} />
                <p className={`font-semibold ${textClass}`}>
                  {t("titleSettings")}
                </p>
              </div>
            </Link>

            <Separator />

            <Button
              onClick={() => {
                onLogout();
                handleLinkClick();
              }}
              className="bg-transparent hover:bg-red-50 w-full flex items-start cursor-pointer p-3 justify-start"
            >
              <div className="flex items-center gap-3">
                <LogOut size={18} />
                <p className={`font-semibold text-red-600 ${textClass}`}>
                  {t("titleSignOut")}
                </p>
              </div>
            </Button>
          </>
        ) : (
          // Desktop version - NavigationMenuLink
          <>
            <NavigationMenuLink asChild className={linkClass}>
              <Link href="/account" onClick={handleLinkClick}>
                <div className="flex items-center gap-3">
                  <User size={18} />
                  <p className={`font-semibold ${textClass}`}>
                    {t("titleMyAccount")}
                  </p>
                </div>
              </Link>
            </NavigationMenuLink>

            <NavigationMenuLink asChild className={linkClass}>
              <Link href="/account" onClick={handleFavouritesClick}>
                <div className="flex items-center gap-3">
                  <PackageSearch size={18} />
                  <div className="flex items-center justify-between w-full">
                    <p className={`font-semibold ${textClass}`}>
                      {t("titleFavourites")}
                    </p>
                    <div className="bg-muted text-xs px-1.5 py-0.5 rounded-full font-semibold">
                      {favourites.length || 0}
                    </div>
                  </div>
                </div>
              </Link>
            </NavigationMenuLink>

            <NavigationMenuLink asChild className={linkClass}>
              <Link href="/messages" onClick={handleLinkClick}>
                <div className="flex items-center gap-3">
                  <MessageCircle size={18} />
                  <div className="flex items-center justify-between w-full">
                    <p className={`font-semibold ${textClass}`}>
                      {t("titleMessages")}
                    </p>
                    <div className="bg-muted text-xs px-1.5 py-0.5 rounded-full font-semibold">
                      3
                    </div>
                  </div>
                </div>
              </Link>
            </NavigationMenuLink>

            <NavigationMenuLink asChild className={linkClass}>
              <Link href="#" onClick={handleLinkClick}>
                <div className="flex items-center gap-3">
                  <Settings size={18} />
                  <p className={`font-semibold ${textClass}`}>
                    {t("titleSettings")}
                  </p>
                </div>
              </Link>
            </NavigationMenuLink>

            <Separator />

            <NavigationMenuLink asChild className={linkClass}>
              <Button
                onClick={() => {
                  onLogout();
                  handleLinkClick();
                }}
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
          </>
        )}
      </div>
    </div>
  );
};

export default BuyerMenuContent;
