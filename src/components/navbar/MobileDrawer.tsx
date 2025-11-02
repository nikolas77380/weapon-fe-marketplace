"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerClose,
  DrawerTitle,
  DrawerDescription,
} from "../ui/drawer";
import { X, LayoutGrid, User, Plus } from "lucide-react";
import { UserProfile } from "@/lib/types";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import CurrencySwitcher from "../ui/CurrencySwitcher";
import { useTranslations } from "next-intl";
import { Separator } from "../ui/separator";
import Logo from "../ui/Logo";
import BuyerMenuContent from "../buyer/navbar/BuyerMenuContent";
import SellerMenuContent from "../buyer/navbar/SellerMenuContent";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onOpenCatalog: () => void;
  onLogout: () => void;
}

const MobileDrawer = ({
  isOpen,
  onClose,
  currentUser,
  onOpenCatalog,
  onLogout,
}: MobileDrawerProps) => {
  const t = useTranslations("Navbar");
  const router = useRouter();

  const handleAddProductClick = () => {
    sessionStorage.setItem("accountTab", "addProduct");
    onClose();
    router.push("/account");
  };

  // Block body scrolling when the drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <Drawer direction="left" open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[100vh] border-none">
        {/* Hidden accessibility elements */}
        <DrawerTitle className="sr-only">{t("burgerMenu.srTitle")}</DrawerTitle>
        <DrawerDescription className="sr-only">
          {t("burgerMenu.srDescription")}
        </DrawerDescription>

        <DrawerHeader
          className="flex items-center justify-between bg-gradient-to-br 
      from-slate-800 via-gray-500 to-slate-900 shadow-2xl h-16 mb-5 px-4"
        >
          <div className="flex items-center justify-between w-full">
            <Link href="/" onClick={onClose}>
              <Logo />
            </Link>

            <DrawerClose asChild>
              <div
                className="rounded-full size-8 flex items-center justify-center bg-transparent cursor-pointer
              transition-all duration-300 hover:bg-white/20"
              >
                <X className="h-5 w-5 text-white" />
              </div>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="px-4 pb-4 space-y-4">
          {/* Catalog Button for all users on <1024px */}
          <button
            className="bg-gold-main rounded-sm cursor-pointer duration-300 transition-all hover:bg-gold-main/90 w-full"
            onClick={() => {
              onClose();
              onOpenCatalog();
            }}
          >
            <div className="flex items-center gap-2 py-2.5 px-4">
              <LayoutGrid size={16} className="text-white" />
              <p className="text-xs xs:text-sm font-medium text-white">
                {t("titleCatalog")}
              </p>
            </div>
          </button>

          {/* User Section for unloginned (only on <768px) */}
          {!currentUser && (
            <Link
              href="/auth?mode=login"
              className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
              onClick={onClose}
            >
              <User size={18} className="text-gold-main" />
              <span className="text-sm xs:text-base font-medium">
                {t("burgerMenu.titleLogRegNotification")}
              </span>
            </Link>
          )}

          {/* Buyer section */}
          {currentUser?.role.name === "buyer" && (
            <>
              {/* Avatar without click */}
              <div className="flex items-center gap-3 p-3">
                <Link href="/account" onClick={onClose}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={currentUser.metadata?.avatar?.url}
                      alt={currentUser.username}
                    />
                    <AvatarFallback className="bg-black text-white text-sm uppercase">
                      {currentUser.displayName?.charAt(0) ||
                        currentUser.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm xs:text-base font-medium">
                      {currentUser.displayName || currentUser.username}
                    </span>
                  </div>
                </Link>
              </div>

              {/* Buyer menu content */}
              <BuyerMenuContent
                user={currentUser}
                onLogout={onLogout}
                isMobile={true}
                onClose={onClose}
              />
            </>
          )}

          {/* Seller section */}
          {currentUser?.role.name === "seller" && (
            <>
              {/* Avatar without click */}
              <Link href="/account" onClick={onClose}>
                <div className="flex items-center gap-3 p-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={currentUser.metadata?.avatar?.url}
                      alt={currentUser.username}
                    />
                    <AvatarFallback className="bg-black text-white text-sm uppercase">
                      {currentUser.displayName?.charAt(0) ||
                        currentUser.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex">
                    <span className="text-sm xs:text-base font-medium">
                      {currentUser.displayName || currentUser.username}
                    </span>
                  </div>
                </div>
              </Link>
              {/* Add Product Button for Seller on <2xl */}
              <button
                onClick={handleAddProductClick}
                className="bg-transparent rounded-md cursor-pointer duration-300 transition-all 
                hover:bg-gray-100 w-full block"
              >
                <div className="flex items-center gap-2 py-2.5 px-4">
                  <Plus size={16} className="text-foreground" />
                  <p className="text-sm xs:text-base font-semibold">
                    {t("sellerNavbar.titleAddProduct")}
                  </p>
                </div>
              </button>

              {/* Seller menu content */}
              <SellerMenuContent
                user={currentUser}
                onLogout={onLogout}
                isMobile={true}
                onClose={onClose}
              />
            </>
          )}

          <Separator className="my-2" />

          <div className="flex items-center gap-3 p-3">
            <CurrencySwitcher
              classNameSelectTrigger="border-gray-500"
              classNameSelectValue="text-gold-main"
            />
            <LanguageSwitcher
              classNameSelectTrigger="border-gray-500"
              classNameSelectValue="text-gold-main"
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileDrawer;
