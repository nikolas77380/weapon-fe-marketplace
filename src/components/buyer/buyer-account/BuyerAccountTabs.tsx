"use client";

import FavouriteCard from "@/components/buyer/buyer-account/FavouriteCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFavourites } from "@/hooks/useFavourites";
import { MessageSquare, LayoutGrid, List } from "lucide-react";
import React, { useState } from "react";

const BuyerAccountTabs = () => {
  const { favourites } = useFavourites();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  return (
    <div className="mt-9">
      <Tabs defaultValue="myInquiries">
        <TabsList className="w-full border border-muted-foreground/20">
          <TabsTrigger value="myInquiries">My Inquiries</TabsTrigger>
          <TabsTrigger value="favourites">
            Favourites({favourites.length || 0})
          </TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="myInquiries">
          <div className="mt-8 border border-gray-primary rounded-xl p-7">
            <p className="font-roboto text-xl mb-8">My Inquiries</p>
            {/* Card 1 */}
            <div className="border border-gray-primary rounded-xl p-7 flex flex-col">
              <div className="flex items-center justify-between">
                <p className="text-xl font-roboto">Level IIIA Ballistic Vest</p>
                <div className="py-0.5 px-3 bg-black text-white rounded-md text-sm font-medium font-roboto">
                  In Discussion
                </div>
              </div>
              <p className="mt-2 font-extralight font-roboto text-sm">
                Seller: Tactical Defense Co
              </p>
              <div className="mt-1 flex items-center justify-between">
                <p className="font-extralight font-roboto text-sm">
                  Inquiry sent: 14/01/2025
                </p>
                <div
                  className="py-0.5 px-3 bg-white text-black rounded-md text-sm font-medium 
                font-roboto border border-gray-primary flex items-center gap-2"
                >
                  <MessageSquare size={16} />
                  View conversation
                </div>
              </div>
              <p className="mt-5.5 font-medium font-roboto text-sm">
                Perfect! Please send me the NIJ certification documents.
              </p>
            </div>
            {/* Card 2 */}
            <div className="border border-gray-primary rounded-xl p-7 flex flex-col mt-5">
              <div className="flex items-center justify-between">
                <p className="text-xl font-roboto">Glock 19 Gen 5 Pistol</p>
                <div className="py-0.5 px-3 bg-red-500 text-white rounded-md text-sm font-medium font-roboto">
                  Pending Response
                </div>
              </div>
              <p className="mt-2 font-extralight font-roboto text-sm">
                Seller: Elite Firearms
              </p>
              <div className="mt-1 flex items-center justify-between">
                <p className="font-extralight font-roboto text-sm">
                  Inquiry sent: 22/05/2025
                </p>
                <div
                  className="py-0.5 px-3 bg-white text-black rounded-md text-sm font-medium 
                font-roboto border border-gray-primary flex items-center gap-2"
                >
                  <MessageSquare size={16} />
                  View conversation
                </div>
              </div>
              <p className="mt-5.5 font-medium font-roboto text-sm">
                I{"'"}ll send you our bulk pricing information.
              </p>
            </div>
            {/* Card 3 */}
            <div className="border border-gray-primary rounded-xl p-7 flex flex-col mt-5">
              <div className="flex items-center justify-between">
                <p className="text-xl font-roboto">MICH Combat Helmet</p>
                <div className="py-0.5 px-3 bg-gray-primary text-black rounded-md text-sm font-medium font-roboto">
                  Completed
                </div>
              </div>
              <p className="mt-2 font-extralight font-roboto text-sm">
                Seller: Military Surplus
              </p>
              <div className="mt-1 flex items-center justify-between">
                <p className="font-extralight font-roboto text-sm">
                  Inquiry sent: 01/08/2025
                </p>
                <div
                  className="py-0.5 px-3 bg-white text-black rounded-md text-sm font-medium 
                font-roboto border border-gray-primary flex items-center gap-2"
                >
                  <MessageSquare size={16} />
                  View conversation
                </div>
              </div>
              <p className="mt-5.5 font-medium font-roboto text-sm">
                Thank you for your purchase!
              </p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="favourites">
          <div className="mt-7.5">
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">
                My Favourites Product ({favourites.length || 0})
              </h3>
              <div className="flex items-center gap-1">
                <div
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md cursor-pointer transition-colors duration-200 ${
                    viewMode === "grid"
                      ? "bg-black"
                      : "bg-[#D9D9D9] hover:bg-gray-300"
                  }`}
                >
                  <LayoutGrid
                    size={20}
                    className={
                      viewMode === "grid" ? "text-white" : "text-black"
                    }
                  />
                </div>
                <div
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md cursor-pointer transition-colors duration-200 ${
                    viewMode === "list"
                      ? "bg-black"
                      : "bg-[#D9D9D9] hover:bg-gray-300"
                  }`}
                >
                  <List
                    size={20}
                    className={
                      viewMode === "list" ? "text-white" : "text-black"
                    }
                  />
                </div>
              </div>
            </div>

            {/* Favourites Content */}
            <div
              className={
                viewMode === "grid"
                  ? "grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {favourites.length > 0 ? (
                favourites.map((favourite) => (
                  <FavouriteCard
                    key={favourite.id}
                    favourite={favourite}
                    viewMode={viewMode}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <div className="text-6xl mb-4">💔</div>
                  <p className="font-medium font-roboto text-lg text-gray-500">
                    No favourites yet.
                  </p>
                  <p className="font-light font-roboto text-sm text-gray-400 mt-2">
                    Start adding products to your favourites!
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BuyerAccountTabs;
