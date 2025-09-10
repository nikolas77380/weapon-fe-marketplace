"use client";

import BuyerNavbar from "../buyer/navbar/BuyerNavbar";
import { useAuthContext } from "@/context/AuthContext";
import SellerNavbar from "../buyer/navbar/SellerNavbar";
import Logo from "../ui/Logo";
import Link from "next/link";
import { motion } from "framer-motion";

interface NavbarProps {
  isLandingPage?: boolean;
}

const Navbar = ({ isLandingPage = false }: NavbarProps) => {
  const { currentUser, currentUserLoading, handleLogout } = useAuthContext();
  const logoHref = currentUser ? "/marketplace" : "/";

  const navbarClasses = isLandingPage
    ? "w-full px-15 py-5.5 bg-transparent absolute z-50"
    : "w-full px-15 py-5.5 bg-transparent relative";

  const NavbarContent = () => (
    <div className="h-16 flex justify-between items-center">
      <motion.div
        initial={isLandingPage ? { x: -50, opacity: 0 } : false}
        animate={isLandingPage ? { x: 0, opacity: 1 } : false}
        transition={isLandingPage ? { duration: 0.8, delay: 0.2 } : {}}
      >
        <Logo href={logoHref} />
      </motion.div>

      {!currentUserLoading && currentUser ? (
        <motion.div
          initial={isLandingPage ? { x: 50, opacity: 0 } : false}
          animate={isLandingPage ? { x: 0, opacity: 1 } : false}
          transition={isLandingPage ? { duration: 0.8, delay: 0.4 } : {}}
        >
          {currentUser.role.name === "buyer" ? (
            <BuyerNavbar user={currentUser} onLogout={handleLogout} />
          ) : (
            <SellerNavbar user={currentUser} onLogout={handleLogout} />
          )}
        </motion.div>
      ) : (
        <motion.ul
          className="flex items-center gap-6"
          initial={isLandingPage ? { x: 50, opacity: 0 } : false}
          animate={isLandingPage ? { x: 0, opacity: 1 } : false}
          transition={isLandingPage ? { duration: 0.8, delay: 0.4 } : {}}
        >
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
          <Link href="/auth?mode=login" className="border-b border-white/20">
            <li className="text-white font-medium">Login</li>
          </Link>
          <Link
            href="/auth?mode=register"
            className="p-2.5 bg-gold-main py-3 px-6 rounded-none text-white hover:bg-gold-main/80 duration-300 transition-all"
          >
            <li className="font-medium">Register</li>
          </Link>
        </motion.ul>
      )}
    </div>
  );

  return (
    <nav className={navbarClasses}>
      {isLandingPage ? (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <NavbarContent />
        </motion.div>
      ) : (
        <NavbarContent />
      )}
    </nav>
  );
};

export default Navbar;
