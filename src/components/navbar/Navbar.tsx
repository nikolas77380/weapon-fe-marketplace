"use client";

import { Input } from "../ui/input";
import { Search } from "lucide-react";
import BuyerNavbar from "../buyer/navbar/BuyerNavbar";
import { useAuthContext } from "@/context/AuthContext";
import SellerNavbar from "../buyer/navbar/SellerNavbar";
import Logo from "../ui/Logo";
import Link from "next/link";

const Navbar = () => {
  const { currentUser, currentUserLoading, handleLogout } = useAuthContext();

  const logoHref = currentUser ? "/marketplace" : "/";

  return (
    <nav className="w-full px-7 py-5.5 border-b border-gray-primary">
      <div className="h-16 flex justify-between items-center">
        <Logo href={logoHref} />
        <div className="relative">
          <Input
            placeholder="Search"
            className="border-black pl-9 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 
            placeholder:text-black h-10"
          />
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer"
          />
        </div>
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
            <Link href="/auth?mode=login" className="">
              <li className="font-bold text-lg hover:text-black/80">Log In</li>
            </Link>
            <Link
              href="/auth?mode=register"
              className="p-2.5 bg-gray-primary rounded-md"
            >
              <li className="font-bold text-lg hover:text-black/80">
                Register
              </li>
            </Link>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
