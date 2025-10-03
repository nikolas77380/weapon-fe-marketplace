"use client";

import FavouriteCard from "@/components/buyer/buyer-account/FavouriteCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFavourites } from "@/hooks/useFavourites";
import { useViewMode } from "@/hooks/useViewMode";
import { MessageSquare } from "lucide-react";
import React, { useEffect, useState } from "react";
import NotFavouriteState from "./NotFavouriteState";
import ViewModeToggle from "@/components/ui/ViewModeToggle";
import BuyerAccountHeader from "./BuyerAccountHeader";
import { UserProfile } from "@/lib/types";
import { cn, triggerClasses } from "@/lib/utils";
import SkeletonComponent from "@/components/ui/SkeletonComponent";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

interface BuyerTabsDesktopProps {
  currentUser: UserProfile;
}

const BuyerTabsDesktop = ({ currentUser }: BuyerTabsDesktopProps) => {
  const t = useTranslations("BuyerAccountTabs");
  const pathname = usePathname();

  const { favourites, loading } = useFavourites();
  const { viewMode, toggleToGrid, toggleToList } = useViewMode("grid");
  const [activeTab, setActiveTab] = useState("myInquiries");

  // Check sessionStorage on mount and whenever pathname changes
  useEffect(() => {
    const savedTab = sessionStorage.getItem("accountTab");
    if (savedTab === "favourites") {
      setActiveTab("favourites");
      setTimeout(() => {
        sessionStorage.removeItem("accountTab");
      }, 100);
    }
  }, [pathname]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="hidden md:block w-full">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        orientation="vertical"
        className="w-full flex-row gap-10"
      >
        <TabsList className="flex-col w-64 h-45 bg-gray-100">
          <TabsTrigger value="myInquiries" className={cn(triggerClasses)}>
            {t("tabMyInquiries.titleTabMyInquiries")}
          </TabsTrigger>
          <TabsTrigger value="favourites" className={cn(triggerClasses)}>
            {t("tabFavourites.titleFavourites")} ({favourites.length || 0})
          </TabsTrigger>
          <TabsTrigger value="messages" className={cn(triggerClasses)}>
            {t("tabMessage.titleMessages")}
          </TabsTrigger>
          <TabsTrigger value="settings" className={cn(triggerClasses)}>
            {t("tabSettings.titleSettings")}
          </TabsTrigger>
        </TabsList>
        <div className="grow w-full">
          <BuyerAccountHeader
            currentUser={currentUser}
            favourites={favourites}
          />
          <div className="mt-9 overflow-hidden">
            <TabsContent value="myInquiries">
              <div className="p-5">
                <p className="text-xl mb-8">
                  {t("tabMyInquiries.titleTabMyInquiries")}
                </p>
                {/* Card 1 */}
                <div className="bg-sidebar-accent p-5 flex flex-col">
                  <div className="flex items-center justify-between">
                    <p className="text-xl">Level IIIA Ballistic Vest</p>
                    <div className="py-0.5 px-3 bg-black text-white rounded-md text-sm font-medium">
                      In Discussion
                    </div>
                  </div>
                  <p className="mt-2 font-extralight text-sm">
                    Seller: Tactical Defense Co
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="font-extralight text-sm">
                      Inquiry sent: 14/01/2025
                    </p>
                    <div className="py-0.5 px-3 bg-white text-black rounded-md text-sm font-medium border border-gray-primary flex items-center gap-2">
                      <MessageSquare size={16} />
                      View conversation
                    </div>
                  </div>
                  <p className="mt-5.5 font-medium text-sm">
                    Perfect! Please send me the NIJ certification documents.
                  </p>
                </div>
                {/* Card 2 */}
                <div className="bg-sidebar-accent p-5 flex flex-col mt-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xl">Glock 19 Gen 5 Pistol</p>
                    <div className="py-0.5 px-3 bg-red-500 text-white rounded-md text-sm font-medium">
                      Pending Response
                    </div>
                  </div>
                  <p className="mt-2 font-extralight text-sm">
                    Seller: Elite Firearms
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="font-extralight font-roboto text-sm">
                      Inquiry sent: 22/05/2025
                    </p>
                    <div className="py-0.5 px-3 bg-white text-black rounded-md text-sm font-medium font-roboto border border-gray-primary flex items-center gap-2">
                      <MessageSquare size={16} />
                      View conversation
                    </div>
                  </div>
                  <p className="mt-5.5 font-medium font-roboto text-sm">
                    I{"'"}ll send you our bulk pricing information.
                  </p>
                </div>
                {/* Card 3 */}
                <div className="bg-sidebar-accent p-5 flex flex-col mt-5">
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
                    <div className="py-0.5 px-3 bg-white text-black rounded-md text-sm font-medium font-roboto border border-gray-primary flex items-center gap-2">
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
              <div className="p-5">
                <ViewModeToggle
                  viewMode={viewMode}
                  onGridClick={toggleToGrid}
                  onListClick={toggleToList}
                  count={favourites.length || 0}
                  title={t("tabFavourites.titleMyFavouritesProduct")}
                />

                {/* Favourites Content */}
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : "flex flex-col gap-4"
                  }
                >
                  {loading ? (
                    <SkeletonComponent
                      type="favouriteCard"
                      count={6}
                      className={viewMode === "grid" ? "" : "w-full"}
                    />
                  ) : favourites.length > 0 ? (
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
                <p className="font-roboto text-xl mb-8">
                  {t("tabMessage.titleMessages")}
                </p>
                <p className="text-gray-500">
                  {t("tabMessage.titleNoMessagesYet")}
                </p>
              </div>
            </TabsContent>
            <TabsContent value="settings">
              <div className="border border-gray-primary rounded-xl p-7">
                <p className="font-roboto text-xl mb-8">
                  {t("tabSettings.titleSettings")}
                </p>
                <p className="text-gray-500">
                  {t("tabSettings.titleContentSettings")}
                </p>
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default BuyerTabsDesktop;
