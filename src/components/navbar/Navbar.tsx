"use client";

import BuyerNavbar from "../buyer/navbar/BuyerNavbar";
import { useAuthContext } from "@/context/AuthContext";
import SellerNavbar from "../buyer/navbar/SellerNavbar";
import Logo from "../ui/Logo";
import Link from "next/link";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import { User } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useTranslations } from "next-intl";

const Navbar = () => {
  const { currentUser, currentUserLoading, handleLogout } = useAuthContext();
  const t = useTranslations('Navbar');

  const NavbarContent = () => (
    <div className="h-16">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        {!currentUserLoading && currentUser ? (
          <>
            {currentUser.role.name === "buyer" ? (
              <BuyerNavbar user={currentUser} onLogout={handleLogout} />
            ) : (
              <SellerNavbar user={currentUser} onLogout={handleLogout} />
            )}
          </>
        ) : (
          <ul className="flex items-center gap-6">
            {/* <div className="relative">
            <Input
              placeholder="Search"
              className="border-white/20 pl-9 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 
            h-10 rounded-none text-muted-foreground placeholder:text-muted-foreground"
            />
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
            />
          </div> */}
            <LanguageSwitcher />

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/auth?mode=login"
                  className="border-2 border-gray-secondary rounded-full p-2 flex items-center justify-center"
                >
                  <User size={18} className="text-gold-main" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('logRegTooltip')}</p>
              </TooltipContent>
            </Tooltip>
          </ul>
        )}
      </div>
    </div>
  );

  return (
    <nav className="w-full px-15 py-5.5 bg-transparent relative">
      <NavbarContent />
    </nav>
  );
};

export default Navbar;
