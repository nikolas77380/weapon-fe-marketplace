"use client";

import FavouriteCard from "@/components/buyer/buyer-account/FavouriteCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFavourites } from "@/hooks/useFavourites";
import { useViewMode } from "@/hooks/useViewMode";
import { MessageSquare } from "lucide-react";
import React from "react";
import NotFavouriteState from "./NotFavouriteState";
import ViewModeToggle from "@/components/ui/ViewModeToggle";
import BuyerAccountHeader from "./BuyerAccountHeader";
import { UserProfile } from "@/lib/types";

interface BuyerAccountHeaderProps {
  currentUser: UserProfile;
}

const BuyerAccountTabs = ({ currentUser }: BuyerAccountHeaderProps) => {
  const { favourites } = useFavourites();
  const { viewMode, toggleToGrid, toggleToList } = useViewMode("grid");

  return (
    <Tabs
      defaultValue="myInquiries"
      orientation="vertical"
      className="w-full flex-row gap-10"
    >
      <TabsList className="flex-col w-64 h-45 border border-border-foreground">
        <TabsTrigger
          value="myInquiries"
          className="w-full text-lg text-muted-foreground flex justify-start px-3.5"
        >
          My Inquiries
        </TabsTrigger>
        <TabsTrigger
          value="favourites"
          className="w-full text-lg text-muted-foreground flex justify-start px-3.5"
        >
          Favourites({favourites.length || 0})
        </TabsTrigger>
        <TabsTrigger
          value="messages"
          className="w-full text-lg text-muted-foreground flex justify-start px-3.5"
        >
          Messages
        </TabsTrigger>
        <TabsTrigger
          value="settings"
          className="w-full text-lg text-muted-foreground flex justify-start px-3.5"
        >
          Settings
        </TabsTrigger>
      </TabsList>
      <div className="grow w-full">
        <BuyerAccountHeader currentUser={currentUser} favourites={favourites} />
        <div className="mt-9 overflow-hidden">
          <TabsContent value="myInquiries">
            <div className="bg-primary-foreground p-5">
              <p className="font-roboto text-xl mb-8">My Inquiries</p>
              {/* Card 1 */}
              <div className="bg-[#E7E7E7] p-5 flex flex-col">
                <div className="flex items-center justify-between">
                  <p className="text-xl font-roboto">
                    Level IIIA Ballistic Vest
                  </p>
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
              <div className="bg-[#E7E7E7] p-5 flex flex-col mt-5">
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
              <div className="bg-[#E7E7E7] p-5 flex flex-col mt-5">
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
            <div className="mt-7.5 bg-primary-foreground p-5">
              <ViewModeToggle
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
          <TabsContent value="messages">
            <div className="border border-gray-primary rounded-xl p-7">
              <p className="font-roboto text-xl mb-8">Messages</p>
              <p className="text-gray-500">No messages yet</p>
            </div>
          </TabsContent>
          <TabsContent value="settings">
            <div className="border border-gray-primary rounded-xl p-7">
              <p className="font-roboto text-xl mb-8">Settings</p>
              <p className="text-gray-500">Settings content will be here</p>
            </div>
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
};

export default BuyerAccountTabs;
