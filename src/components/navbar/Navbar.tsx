"use client";

import BuyerNavbar from "../buyer/navbar/BuyerNavbar";
import { useAuthContext } from "@/context/AuthContext";
import SellerNavbar from "../buyer/navbar/SellerNavbar";
import Logo from "../ui/Logo";
import Link from "next/link";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import { LayoutGrid, Search, User, X, Menu } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useTranslations } from "next-intl";
import CatalogDropdown from "./CatalogDropdown";
import MobileDrawer from "./MobileDrawer";
import MobileCatalog from "./MobileCatalog";
import { useState, useCallback } from "react";
import { Input } from "../ui/input";
import { useCategories } from "@/hooks/useCategories";

const Navbar = () => {
  const { currentUser, currentUserLoading, handleLogout } = useAuthContext();
  const t = useTranslations("Navbar");
  const { getMainCategories, categories } = useCategories();
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isMobileCatalogOpen, setIsMobileCatalogOpen] = useState(false);

  const handleToggleCatalog = useCallback(() => {
    setIsCatalogOpen(!isCatalogOpen);
  }, [isCatalogOpen]);

  const handleCloseCatalog = useCallback(() => {
    setIsCatalogOpen(false);
  }, []);

  const handleToggleMobileDrawer = useCallback(() => {
    setIsMobileDrawerOpen(!isMobileDrawerOpen);
  }, [isMobileDrawerOpen]);

  const handleCloseMobileDrawer = useCallback(() => {
    setIsMobileDrawerOpen(false);
  }, []);

  const handleOpenMobileCatalog = useCallback(() => {
    setIsMobileCatalogOpen(true);
  }, []);

  const handleCloseMobileCatalog = useCallback(() => {
    setIsMobileCatalogOpen(false);
  }, []);

  const NavbarContent = () => (
    <div className="h-8 sm:h-9 lg:h-10 w-full flex items-center">
      <div className="container mx-auto flex justify-between items-center w-full">
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-36">
          {/* Burger Menu Button - shows at <1024px */}
          <button
            className="lg:hidden p-1.5 sm:p-2 hover:bg-white/10 rounded-md transition-colors"
            onClick={handleToggleMobileDrawer}
          >
            <Menu size={16} className="text-white sm:w-5 sm:h-5" />
          </button>

          <div className="hidden xs:block">
            <Logo />
          </div>

          {/* Catalog Button - shows everyone on Desktop, hides on mobile */}
          <div className="relative hidden lg:block">
            <div
              className={`
                bg-gold-main rounded-none cursor-pointer duration-300 transition-all
                hover:bg-gold-main/90
                  ${isCatalogOpen ? "bg-gold-main/90" : ""}
                `}
              onClick={handleToggleCatalog}
            >
              <div className="flex items-center gap-2 py-2 lg:py-2.5 px-3 lg:px-4">
                {isCatalogOpen ? (
                  <X size={14} className="text-white lg:w-4 lg:h-4" />
                ) : (
                  <LayoutGrid size={14} className="text-white lg:w-4 lg:h-4" />
                )}
                <p className="text-xs lg:text-sm font-medium text-white">
                  {t("titleCatalog")}
                </p>
              </div>
            </div>
            <CatalogDropdown
              isOpen={isCatalogOpen}
              onClose={handleCloseCatalog}
            />
          </div>
        </div>
        {/* Search bar - adaptive width */}
        <div className="relative w-full xl:max-w-sm mx-2 sm:mx-4 lg:mx-10">
          <Input
            placeholder="Search"
            className="border-white/60 pl-7 sm:pl-9 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 
            h-8 sm:h-9 lg:h-10 rounded-none text-gray-200 placeholder:text-gray-400 text-sm"
          />
          <Search
            size={12}
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
          />
        </div>
        {!currentUserLoading && currentUser ? (
          <>
            {/* Desktop Navigation for authorized users */}
            <div className="hidden lg:block">
              {currentUser.role.name === "buyer" ? (
                <BuyerNavbar user={currentUser} onLogout={handleLogout} />
              ) : (
                <SellerNavbar user={currentUser} onLogout={handleLogout} />
              )}
            </div>
          </>
        ) : (
          <ul className="flex items-center gap-6">
            {/* Desktop LanguageSwitcher - скрывается на мобильных */}
            <div className="hidden lg:block">
              <LanguageSwitcher
                classNameSelectTrigger="border-gray-500"
                classNameSelectValue="text-gold-main"
              />
            </div>

            {/* User avatar icon - hides on <768px */}
            <div className="hidden md:block">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/auth?mode=login"
                    className="border-2 border-gray-secondary rounded-full p-1.5 md:p-2 flex 
                    items-center justify-center"
                  >
                    <User
                      size={16}
                      className="text-gold-main md:w-[18px] md:h-[18px]"
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("logRegTooltip")}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </ul>
        )}
      </div>
    </div>
  );

  return (
    <>
      <nav className="w-full px-2 sm:px-4 lg:px-6 py-2 sm:py-2.5 relative bg-gradient-to-br from-slate-800 via-gray-500 to-slate-900 shadow-2xl">
        <NavbarContent />
      </nav>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={handleCloseMobileDrawer}
        currentUser={currentUser}
        onOpenCatalog={handleOpenMobileCatalog}
        onLogout={handleLogout}
      />

      {/* Mobile Catalog */}
      <MobileCatalog
        isOpen={isMobileCatalogOpen}
        onClose={handleCloseMobileCatalog}
        categories={getMainCategories()}
        allCategories={categories}
      />
    </>
  );
};

export default Navbar;
