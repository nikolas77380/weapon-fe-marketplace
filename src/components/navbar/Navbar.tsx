import Link from "next/link";
import React from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="w-full px-7 py-5.5">
      <div className="h-16 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-xl size-16 font-bold rounded-full border border-black flex items-center justify-center">
            <span>WM</span>
          </h1>
        </Link>
        <div className="relative">
          <Input
            placeholder="Search"
            className="border-black pl-9 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 
            placeholder:text-black h-10"
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer" />
        </div>
        <ul className="flex items-center gap-6">
          <Link href="#" className="">
            <li className="font-bold text-lg hover:text-black/80">Log In</li>
          </Link>
          <Link href="#" className="p-2.5 bg-gray-primary rounded-md">
            <li className="font-bold text-lg hover:text-black/80">Register</li>
          </Link>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
