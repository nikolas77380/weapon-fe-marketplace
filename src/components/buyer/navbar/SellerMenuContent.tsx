"use client";

import React from "react";
import Link from "next/link";
import {
  MessageCircle,
  User,
  PackageSearch,
  Settings,
  LogOut,
  Heart,
} from "lucide-react";
import { NavigationMenuLink } from "../../ui/navigation-menu";
import { Separator } from "../../ui/separator";
import { Button } from "../../ui/button";
import type { UserProfile } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useFavourites } from "@/hooks/useFavourites";
import { useRouter } from "next/navigation";
import { useUnreadChats } from "@/context/UnreadChatsContext";

interface SellerMenuContentProps {
  user: UserProfile;
  onLogout: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const SellerMenuContent = ({
  user,
  onLogout,
  isMobile = false,
  onClose,
}: SellerMenuContentProps) => {
  const t = useTranslations("Navbar.sellerNavbar");
  const { favourites } = useFavourites();
  const { unreadChatsCount } = useUnreadChats();
  const router = useRouter();

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleFavouritesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    sessionStorage.setItem("accountTab", "favourites");
    handleLinkClick();
    router.push("/account");
  };

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    sessionStorage.setItem("accountTab", "settings");
    handleLinkClick();
    router.push("/account");
  };

  const handleAddProductClick = (e: React.MouseEvent) => {
    e.preventDefault();
    sessionStorage.setItem("accountTab", "addProduct");
    handleLinkClick();
    router.push("/account");
  };

  const containerClass = isMobile ? "space-y-2" : "grid w-[200px] gap-1";

  const linkClass = isMobile
    ? "flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
    : "p-3 cursor-pointer";

  const textClass = isMobile ? "text-sm xs:text-base" : "";

  return (
    <div className={containerClass}>
      <div className={isMobile ? "space-y-1" : ""}>
        {isMobile ? (
          // Mobile version - обычные элементы
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

            <button
              onClick={handleFavouritesClick}
              className={`${linkClass} w-full text-left`}
            >
              <div className="flex items-center gap-3">
                <Heart size={18} />
                <div className="flex items-center justify-between w-full">
                  <p className={`font-semibold ${textClass}`}>
                    {t("titleFavourites")}
                  </p>
                </div>
              </div>
            </button>

            {/* <Link href="/" onClick={handleLinkClick} className={linkClass}>
              <div className="flex items-center gap-3">
                <PackageSearch size={18} />
                <p className={`font-semibold ${textClass}`}>
                  {t("titleBrowseProducts")}
                </p>
              </div>
            </Link> */}

            {/* <button
              onClick={handleAddProductClick}
              className={`${linkClass} w-full text-left`}
            >
              <div className="flex items-center gap-3">
                <PackageSearch size={18} />
                <p className={`font-semibold ${textClass}`}>
                  {t("titlAddNewProduct")}
                </p>
              </div>
            </button> */}

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
                </div>
              </div>
            </Link>

            <button
              onClick={handleSettingsClick}
              className={`${linkClass} w-full text-left`}
            >
              <div className="flex items-center gap-3">
                <Settings size={18} />
                <p className={`font-semibold ${textClass}`}>
                  {t("titleSettings")}
                </p>
              </div>
            </button>

            <Separator />

            <Button
              onClick={() => {
                onLogout();
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
              <button
                onClick={handleFavouritesClick}
                className="w-full text-left"
              >
                <div className="flex items-center gap-3">
                  <Heart size={18} />
                  <div className="flex items-center justify-between w-full">
                    <p className={`font-semibold ${textClass}`}>
                      {t("titleFavourites")}
                    </p>
                  </div>
                </div>
              </button>
            </NavigationMenuLink>

            <NavigationMenuLink asChild className={linkClass}>
              <Link href="/" onClick={handleLinkClick}>
                <div className="flex items-center gap-3">
                  <PackageSearch size={18} />
                  <p className={`font-semibold ${textClass}`}>
                    {t("titleBrowseProducts")}
                  </p>
                </div>
              </Link>
            </NavigationMenuLink>

            <NavigationMenuLink asChild className={linkClass}>
              <button
                onClick={handleAddProductClick}
                className="w-full text-left"
              >
                <div className="flex items-center gap-3">
                  <PackageSearch size={18} />
                  <p className={`font-semibold ${textClass}`}>
                    {t("titlAddNewProduct")}
                  </p>
                </div>
              </button>
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
                      {unreadChatsCount}
                    </div>
                  </div>
                </div>
              </Link>
            </NavigationMenuLink>

            <NavigationMenuLink asChild className={linkClass}>
              <button
                onClick={handleSettingsClick}
                className="w-full text-left"
              >
                <div className="flex items-center gap-3">
                  <Settings size={18} />
                  <p className={`font-semibold ${textClass}`}>
                    {t("titleSettings")}
                  </p>
                </div>
              </button>
            </NavigationMenuLink>

            <Separator />

            <NavigationMenuLink asChild className={linkClass}>
              <Button
                onClick={() => {
                  onLogout();
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

export default SellerMenuContent;
