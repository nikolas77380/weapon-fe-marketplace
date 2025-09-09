"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/landing/Footer";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();

  // List of paths where Navbar and Footer should NOT be shown
  const hideNavbarFooterPaths = ["/auth"];

  // Landing page path
  const isLandingPage = pathname === "/";

  const shouldHideNavbarFooter = hideNavbarFooterPaths.some((path) =>
    pathname.startsWith(path)
  );

  return (
    <>
      <div className="relative">
        {!shouldHideNavbarFooter && <Navbar isLandingPage={isLandingPage} />}
      </div>
      {children}
      {!shouldHideNavbarFooter && <Footer />}
    </>
  );
}