import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const Breadcrumb = () => {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 cursor-pointer hover:text-black/70 border-b border-border-secondary pb-1"
    >
      <ChevronLeft size={20} className="text-black" />
      <h1 className="font-medium">Back to home</h1>
    </Link>
  );
};

export default Breadcrumb;
