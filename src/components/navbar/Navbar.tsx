"use client";

import { Input } from "../ui/input";
import { Search } from "lucide-react";
import BuyerNavbar from "../buyer/navbar/BuyerNavbar";
import { useAuthContext } from "@/context/AuthContext";
import SellerNavbar from "../buyer/navbar/SellerNavbar";
import Logo from "../ui/Logo";
import Link from "next/link";

interface NavbarProps {
  isLandingPage?: boolean;
}

const Navbar = ({ isLandingPage = false }: NavbarProps) => {
  const { currentUser, currentUserLoading, handleLogout } = useAuthContext();

  const logoHref = currentUser ? "/marketplace" : "/";

  const navbarClasses = isLandingPage
    ? "w-full px-15 py-5.5 bg-transparent absolute z-10"
    : "w-full px-15 py-5.5 bg-transparent relative";

  return (
    <nav className={navbarClasses}>
      <div className="h-16 flex justify-between items-center">
        <Logo href={logoHref} />

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
            <div className="relative">
              <Input
                placeholder="Search"
                className="border-white/20 pl-9 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 
              h-10 rounded-none text-muted-foreground placeholder:text-muted-foreground"
              />
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
              />
            </div>
            <Link href="/auth?mode=login" className="border-b border-white/20">
              <li className="text-white font-medium">Login</li>
            </Link>
            <Link
              href="/auth?mode=register"
              className="p-2.5 bg-gold-main py-3 px-6 rounded-none text-white hover:bg-gold-main/80 duration-300 transition-all"
            >
              <li className="font-medium">Register</li>
            </Link>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
