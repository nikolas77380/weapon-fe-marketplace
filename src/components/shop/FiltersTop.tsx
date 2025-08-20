"use client";

import { ChevronDown, LayoutGrid, List } from "lucide-react";
import React, { useState } from "react";

const FiltersTop = () => {
  const [activeTab, setActiveTab] = useState<"grid" | "list">("grid");
  return (
    <div className="flex items-center gap-22">
      <div className="flex items-center text-[#B3B3B3] gap-5">
        <h2 className="font-medium text-black">Newest First</h2>
        <ChevronDown size={20} className="text-[#757575]" />
      </div>
      <div className="flex items-center gap-1">
        <div
          onClick={() => setActiveTab("grid")}
          className={`p-2 rounded-md cursor-pointer ${
            activeTab === "grid" ? "bg-black" : "bg-[#D9D9D9]"
          }`}
        >
          <LayoutGrid
            size={20}
            className={activeTab === "grid" ? "text-white" : "text-black"}
          />
        </div>
        <div
          onClick={() => setActiveTab("list")}
          className={`p-2 rounded-md cursor-pointer ${
            activeTab === "list" ? "bg-black" : "bg-[#D9D9D9]"
          }`}
        >
          <List
            size={20}
            className={activeTab === "list" ? "text-white" : "text-black"}
          />
        </div>
      </div>
    </div>
  );
};

export default FiltersTop;
