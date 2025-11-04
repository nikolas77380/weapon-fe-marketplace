"use client";

import BuyerNavbar from "../buyer/navbar/BuyerNavbar";
import { useAuthContext } from "@/context/AuthContext";
import SellerNavbar from "../buyer/navbar/SellerNavbar";
import Logo from "../ui/Logo";
import Link from "next/link";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import CurrencySwitcher from "../ui/CurrencySwitcher";
import { LayoutGrid, User, X, Menu } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useTranslations } from "next-intl";
import CatalogDropdown from "./CatalogDropdown";
import MobileDrawer from "./MobileDrawer";
import MobileCatalog from "./MobileCatalog";
import { useState, useCallback } from "react";
import { useCategories } from "@/hooks/useCategories";
import { NavbarSearch } from "../search/NavbarSearch";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Navbar = () => {
  const { currentUser, currentUserLoading, handleLogout } = useAuthContext();
  const router = useRouter();
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

          <div className="mr-1 lg:mr-0">
            {/* <Logo /> */}
            <Link href="/" className="w-24 h-11">
              <Image
                src="/logo/esviem_defence_logo_2_1.png"
                alt="logo"
                width={320}
                height={220}
                className="w-24 h-11 object-contain"
              />
            </Link>
          </div>

          {/* Catalog Button - shows everyone on Desktop, hides on mobile */}
          <div className="relative hidden lg:block">
            <div
              className={`
                rounded-sm cursor-pointer duration-300 md:ml-[35px] transition-all
                border border-gold-main hover:bg-white/10
                  ${isCatalogOpen ? "bg-white/10" : ""}
                `}
              onClick={handleToggleCatalog}
            >
              <div className="flex items-center gap-2 py-1.5 lg:py-2 px-3 lg:px-4 ">
                {isCatalogOpen ? (
                  <X size={14} className="text-white lg:w-4 lg:h-4" />
                ) : (
                  <LayoutGrid
                    size={14}
                    className="text-gold-main lg:w-4 lg:h-4"
                  />
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
        <div className="relative w-full xl:max-w-md mx-2 sm:mx-4 lg:mx-10">
          <NavbarSearch
            onProductSelect={(product) =>
              router.push(`/marketplace/${product.id}`)
            }
            onSellerSelect={(seller) => router.push(`/company/${seller.id}`)}
            placeholder={t("searchPlaceholder")}
            className="text-white"
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
            {/* Desktop CurrencySwitcher - скрывается на мобильных */}
            <div className="hidden lg:block">
              <CurrencySwitcher
                classNameSelectTrigger="border-gray-500"
                classNameSelectValue="text-gold-main"
              />
            </div>

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
      <nav
        className="w-full px-2 sm:px-4 lg:px-6 py-3 sm:py-2.5 relative bg-gradient-to-br 
      from-slate-800 via-gray-600 to-slate-900 shadow-2xl"
      >
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
