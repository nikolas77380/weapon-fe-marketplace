"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerClose,
  DrawerTitle,
  DrawerDescription,
} from "../ui/drawer";
import { X, LayoutGrid, User, Plus, LogOut } from "lucide-react";
import { UserProfile } from "@/lib/types";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import CurrencySwitcher from "../ui/CurrencySwitcher";
import { useTranslations } from "next-intl";
import { Separator } from "../ui/separator";
import Image from "next/image";
import BuyerMenuContent from "../buyer/navbar/BuyerMenuContent";
import SellerMenuContent from "../buyer/navbar/SellerMenuContent";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "../ui/button";

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
  const tDialog = useTranslations(
    currentUser?.role.name === "seller"
      ? "Navbar.sellerNavbar.logoutDialog"
      : "Navbar.buyerNavbar.logoutDialog"
  );
  const router = useRouter();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutDialog(false);
    onLogout();
    onClose();
  };

  const handleDrawerClose = (open: boolean) => {
    // Prevent closing drawer when logout dialog is open
    if (!open && showLogoutDialog) {
      return;
    }
    onClose();
  };

  const handleAddProductClick = () => {
    onClose();
    router.push("/account?tab=addProduct");
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
    <Drawer direction="left" open={isOpen} onOpenChange={handleDrawerClose}>
      <DrawerContent className="h-[100vh] border-none">
        {/* Hidden accessibility elements */}
        <DrawerTitle className="sr-only">{t("burgerMenu.srTitle")}</DrawerTitle>
        <DrawerDescription className="sr-only">
          {t("burgerMenu.srDescription")}
        </DrawerDescription>

        <DrawerHeader
          className="flex items-center justify-between bg-gradient-to-br 
      from-slate-800 via-gray-600 to-slate-900 shadow-2xl h-16 mb-5 px-4"
        >
          <div className="flex items-center justify-between w-full">
            <Link href="/" onClick={onClose} className="block w-24 h-11">
              <Image
                src="/logo/esviem_defence_logo_2_2.png"
                alt="logo"
                width={320}
                height={220}
                className="w-full h-full object-contain"
                priority
              />
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
                onLogout={handleLogoutClick}
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
                onLogout={handleLogoutClick}
                isMobile={true}
                onClose={onClose}
              />
            </>
          )}

          <Separator className="mb-2" />

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
        <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <DialogContent className="rounded-lg border-none !max-w-sm md:!max-w-lg overflow-hidden p-0">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500/10 to-red-500/5 p-3 xs:p-4 sm:p-6 border-b border-red-500/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <LogOut className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <DialogTitle className="text-lg sm:text-xl font-bold text-gray-800">
                    {tDialog("title")}
                  </DialogTitle>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {tDialog("description")}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 xs:p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex flex-col gap-2">
              <Button
                onClick={handleLogoutConfirm}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-300"
              >
                {tDialog("buttonConfirm")}
              </Button>
              <Button
                onClick={() => setShowLogoutDialog(false)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2.5 px-6 rounded-lg transition-colors duration-300"
              >
                {tDialog("buttonCancel")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileDrawer;
