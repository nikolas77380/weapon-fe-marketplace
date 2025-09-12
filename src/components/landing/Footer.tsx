import React from "react";
import { Separator } from "../ui/separator";
import Link from "next/link";
import Logo from "../ui/Logo";

const Footer = () => {
  return (
    <div className="py-7 bg-[#f0f0e5]">
      <div className="container mx-auto flex flex-col items-center">
        <div className="flex justify-between w-full">
          <ul>
            <li className="font-bold text-2xl mb-5">
              <Logo />
            </li>
            <li className="font-light w-full max-w-52">
              The trusted marketplace for weapon and armour
            </li>
          </ul>

          <ul>
            <h1 className="font-medium text-xl mb-3.5">Legal</h1>
            <Link
              href="/faq"
              className=" hover:text-gold-main transition-colors
              duration-300"
            >
              <li className="mb-1 text-sm">FAQ</li>
            </Link>
            <li className="text-sm mb-1">Seller Dashboard</li>
            <li className="text-sm mb-1">Verification</li>
            <li className="text-sm">Support</li>
          </ul>

          <ul>
            <h1 className="font-medium text-xl mb-3.5">Contact</h1>
            <Link
              href="/contact"
              className=" hover:text-gold-main transition-colors
            duration-300"
            >
              <li className="mb-1 text-sm">Contact Us</li>
            </Link>
            <li className="text-sm mb-1">1-800-WEAPONS</li>
            <li className="text-sm">24/7 Support</li>
          </ul>
        </div>

        <div>
          <Separator
            orientation="horizontal"
            className="w-full mt-20 bg-gray-primary"
          />
        </div>

        <div className="my-6">
          <h2 className="font-light text-2xl">
            © 2025 WM. All rights reserved.
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Footer;
