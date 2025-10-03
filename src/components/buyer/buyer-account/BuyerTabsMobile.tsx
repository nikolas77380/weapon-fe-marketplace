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

interface BuyerTabsMobileProps {
  currentUser: UserProfile;
}

const BuyerTabsMobile = ({ currentUser }: BuyerTabsMobileProps) => {
  const t = useTranslations("BuyerAccountTabs");
  const pathname = usePathname();

  const { favourites, loading } = useFavourites();
  const { viewMode, toggleToGrid, toggleToList } = useViewMode("grid");
  const [activeTab, setActiveTab] = useState("myInquiries");

  // Check sessionStorage on mount and whenever pathname changes
  useEffect(() => {
    const savedTab = sessionStorage.getItem("accountTab");
    console.log(
      "BuyerTabsMobile: Checking sessionStorage, savedTab:",
      savedTab
    );
    if (savedTab === "favourites") {
      console.log("BuyerTabsMobile: Setting activeTab to favourites");
      setActiveTab("favourites");
      // Remove after a delay to ensure both Mobile and Desktop components read it
      setTimeout(() => {
        sessionStorage.removeItem("accountTab");
      }, 100);
    }
  }, [pathname]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="block md:hidden w-full px-3 sm:px-6">
      <BuyerAccountHeader currentUser={currentUser} favourites={favourites} />
      <div className="mt-6">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          orientation="horizontal"
          className="w-full h-full"
        >
          <TabsList className="bg-gray-100 grid grid-cols-1 min-[400px]:grid-cols-2 min-[500px]:grid-cols-4 w-full h-full gap-1">
            <TabsTrigger
              value="myInquiries"
              className={cn(
                triggerClasses,
                "text-xs sm:text-sm w-full h-full py-2 px-1 justify-center"
              )}
            >
              {t("tabMyInquiries.titleTabMyInquiries")}
            </TabsTrigger>
            <TabsTrigger
              value="favourites"
              className={cn(
                triggerClasses,
                "text-xs sm:text-sm w-full h-full py-2 px-1 justify-center"
              )}
            >
              {t("tabFavourites.titleFavourites")} ({favourites.length || 0})
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              className={cn(
                triggerClasses,
                "text-xs sm:text-sm w-full h-full py-2 px-1 justify-center"
              )}
            >
              {t("tabMessage.titleMessages")}
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className={cn(
                triggerClasses,
                "text-xs sm:text-sm w-full h-full py-2 px-1 justify-center"
              )}
            >
              {t("tabSettings.titleSettings")}
            </TabsTrigger>
          </TabsList>
          <div className="mt-6 overflow-hidden">
            <TabsContent value="myInquiries">
              <div className="space-y-4">
                <p className="text-lg sm:text-xl font-medium">
                  {t("tabMyInquiries.titleTabMyInquiries")}
                </p>
                {/* Card 1 */}
                <div className="bg-sidebar-accent p-4 flex flex-col space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <p className="text-base sm:text-lg font-medium">
                      Level IIIA Ballistic Vest
                    </p>
                    <div className="py-1 px-2 bg-black text-white rounded-md text-xs font-medium w-fit">
                      In Discussion
                    </div>
                  </div>
                  <p className="font-extralight text-sm">
                    Seller: Tactical Defense Co
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <p className="font-extralight text-sm">
                      Inquiry sent: 14/01/2025
                    </p>
                    <div className="py-1 px-2 bg-white text-black rounded-md text-xs font-medium border border-gray-primary flex items-center gap-2 w-fit">
                      <MessageSquare size={14} />
                      View conversation
                    </div>
                  </div>
                  <p className="font-medium text-sm">
                    Perfect! Please send me the NIJ certification documents.
                  </p>
                </div>
                {/* Card 2 */}
                <div className="bg-sidebar-accent p-4 flex flex-col space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <p className="text-base sm:text-lg font-medium">
                      Glock 19 Gen 5 Pistol
                    </p>
                    <div className="py-1 px-2 bg-red-500 text-white rounded-md text-xs font-medium w-fit">
                      Pending Response
                    </div>
                  </div>
                  <p className="font-extralight text-sm">
                    Seller: Elite Firearms
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <p className="font-extralight text-sm">
                      Inquiry sent: 22/05/2025
                    </p>
                    <div className="py-1 px-2 bg-white text-black rounded-md text-xs font-medium border border-gray-primary flex items-center gap-2 w-fit">
                      <MessageSquare size={14} />
                      View conversation
                    </div>
                  </div>
                  <p className="font-medium text-sm">
                    I{"'"}ll send you our bulk pricing information.
                  </p>
                </div>
                {/* Card 3 */}
                <div className="bg-sidebar-accent p-4 flex flex-col space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <p className="text-base sm:text-lg font-medium">
                      MICH Combat Helmet
                    </p>
                    <div className="py-1 px-2 bg-gray-primary text-black rounded-md text-xs font-medium w-fit">
                      Completed
                    </div>
                  </div>
                  <p className="font-extralight text-sm">
                    Seller: Military Surplus
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <p className="font-extralight text-sm">
                      Inquiry sent: 01/08/2025
                    </p>
                    <div className="py-1 px-2 bg-white text-black rounded-md text-xs font-medium border border-gray-primary flex items-center gap-2 w-fit">
                      <MessageSquare size={14} />
                      View conversation
                    </div>
                  </div>
                  <p className="font-medium text-sm">
                    Thank you for your purchase!
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="favourites">
              <div className="space-y-4">
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
                      ? "grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-2 gap-4"
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
              <div className="border border-gray-primary rounded-xl p-4 sm:p-7">
                <p className="text-lg sm:text-xl font-medium mb-6 sm:mb-8">
                  {t("tabMessage.titleMessages")}
                </p>
                <p className="text-gray-500 text-sm sm:text-base">
                  {t("tabMessage.titleNoMessagesYet")}
                </p>
              </div>
            </TabsContent>
            <TabsContent value="settings">
              <div className="border border-gray-primary rounded-xl p-4 sm:p-7">
                <p className="text-lg sm:text-xl font-medium mb-6 sm:mb-8">
                  {t("tabSettings.titleSettings")}
                </p>
                <p className="text-gray-500 text-sm sm:text-base">
                  {t("tabSettings.titleContentSettings")}
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default BuyerTabsMobile;
