import React from "react";
import { Separator } from "../ui/separator";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="py-7">
      <div className="container mx-auto flex flex-col items-center">
        <div className="flex justify-between w-full">
          <ul>
            <li className="font-bold text-2xl mb-3">WM</li>
            <li className="text-2xl font-light w-full max-w-62">
              The trusted marketplace for weapon and armour
            </li>
          </ul>
          <ul>
            <h1 className="font-bold text-2xl mb-3">Legal</h1>
            <Link
              href="/faq"
              className=" hover:text-blue-500 transition-colors
              duration-300"
            >
              <li className="mb-1 text-2xl font-light w-full max-w-62">
                FAQ
              </li>
            </Link>
            <li className="text-2xl font-light w-full max-w-62 mb-1">
              Seller Dashboard
            </li>
            <li className="text-2xl font-light w-full max-w-62">
              Verification
            </li>
            <li className="text-2xl font-light w-full max-w-62">Support</li>
          </ul>
          <ul>
            <h1 className="font-bold text-2xl mb-3">Contact</h1>
            <Link
              href="/contact"
              className=" hover:text-blue-500 transition-colors
            duration-300"
            >
              <li className="mb-1 text-2xl font-light w-full max-w-62">
                Contact Us
              </li>
            </Link>
            <li className="text-2xl font-light w-full max-w-62 mb-1">
              1-800-WEAPONS
            </li>
            <li className="text-2xl font-light w-full max-w-62">
              24/7 Support
            </li>
          </ul>
        </div>
        <Separator
          orientation="horizontal"
          className="w-full mt-20 bg-gray-primary"
        />
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
