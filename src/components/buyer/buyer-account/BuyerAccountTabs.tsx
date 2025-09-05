"use client";

import FavouriteCard from "@/components/buyer/buyer-account/FavouriteCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFavourites } from "@/hooks/useFavourites";
import { useViewMode } from "@/hooks/useViewMode";
import { MessageSquare } from "lucide-react";
import React from "react";
import NotFavouriteState from "./NotFavouriteState";
import ViewFavouriteModeToggle from "@/components/ui/ViewFavouriteModeToggle";

const BuyerAccountTabs = () => {
  const { favourites } = useFavourites();
  const { viewMode, toggleToGrid, toggleToList } = useViewMode("grid");
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
            <ViewFavouriteModeToggle
              viewMode={viewMode}
              onGridClick={toggleToGrid}
              onListClick={toggleToList}
              count={favourites.length || 0}
              title="My Favourites Product"
            />

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
                <NotFavouriteState />
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BuyerAccountTabs;
