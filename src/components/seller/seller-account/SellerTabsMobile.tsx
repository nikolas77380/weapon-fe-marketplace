import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SellerListenedCard from "./SellerListenedCard";
import { MessageSquare, Users } from "lucide-react";
import Link from "next/link";
import { Product, UserProfile } from "@/lib/types";
import SkeletonComponent from "@/components/ui/SkeletonComponent";
import SellerAccountHeader from "./SellerAccountHeader";
import { cn, triggerClasses } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useFavourites } from "@/hooks/useFavourites";
import { useViewMode } from "@/hooks/useViewMode";
import FavouriteCard from "@/components/buyer/buyer-account/FavouriteCard";
import NotFavouriteState from "@/components/buyer/buyer-account/NotFavouriteState";
import ViewModeToggle from "@/components/ui/ViewModeToggle";
import { usePathname } from "next/navigation";
import MetaForm from "./MetaForm";
import { useUnreadChats } from "@/context/UnreadChatsContext";
import { useChatStats } from "@/hooks/useChatStats";

interface SellerTabsMobileProps {
  products: Product[];
  loading: boolean;
  refetch: () => void;
  currentUser: UserProfile;
  onUserUpdate?: (updatedUser: UserProfile) => void;
}

const SellerTabsMobile = ({
  products,
  loading,
  currentUser,
  onUserUpdate,
}: SellerTabsMobileProps) => {
  const t = useTranslations("SellerAccountTabs");
  const tBuyer = useTranslations("BuyerAccountTabs");
  const pathname = usePathname();
  const { unreadChatsCount } = useUnreadChats();
  const { stats } = useChatStats();

  const { favourites, loading: favouritesLoading } = useFavourites();
  const { viewMode, toggleToGrid, toggleToList } = useViewMode("grid");
  const [activeTab, setActiveTab] = useState("myInquiries");

  // Check sessionStorage on mount and whenever pathname changes
  useEffect(() => {
    const savedTab = sessionStorage.getItem("accountTab");
    if (savedTab === "favourites" || savedTab === "settings") {
      setActiveTab(savedTab);
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
      <SellerAccountHeader products={products} currentUser={currentUser} />
      <div className="mt-6">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          orientation="horizontal"
          className="w-full h-full"
        >
          <TabsList className="bg-gray-100 grid grid-cols-2 min-[400px]:grid-cols-4 w-full h-full gap-1 rounded-sm">
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
              {tBuyer("tabFavourites.titleFavourites")} (
              {favourites.length || 0})
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
            <TabsContent
              value="myInquiries"
              className="bg-background border border-sidebar-accent px-3 sm:px-6 pt-2 pb-4"
            >
              <div className="mt-7.5">
                <h1 className="text-lg sm:text-xl font-roboto">
                  {t("tabMyInquiries.titleTabMyInquiries")}
                </h1>
                <p className="text-xs sm:text-sm font-medium text-[#C4C2C2] mt-2">
                  {t("tabMyInquiries.descriptionManageProducts")}
                </p>
                <div className="mt-3.5 flex flex-col gap-4 items-center w-full">
                  {loading ? (
                    <SkeletonComponent
                      type="sellerCard"
                      count={3}
                      className="w-full"
                    />
                  ) : (
                    products.map((product) => (
                      <SellerListenedCard key={product.id} product={product} />
                    ))
                  )}
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
                  title={tBuyer("tabFavourites.titleMyFavouritesProduct")}
                />

                {/* Favourites Content */}
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-2 gap-4"
                      : "flex flex-col gap-4"
                  }
                >
                  {favouritesLoading ? (
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
              <div className="mt-7.5">
                <div className="flex items-center justify-between">
                  <h1 className="text-lg sm:text-xl font-roboto">
                    {t("tabMessage.titleCustomerMessages")}
                  </h1>
                  <Link
                    href="/messages"
                    className="bg-gold-main py-2 px-3 sm:py-1.5 sm:px-4 rounded-md flex items-center gap-2 sm:gap-3 text-white hover:bg-gold-main/80 duration-300 transition-all"
                  >
                    <MessageSquare size={20} />
                    <p className="text-[10px] sm:text-xs font-semibold">
                      {t("tabMessage.titleOpenFullMessenger")}
                    </p>
                  </Link>
                </div>
                <p className="text-xs sm:text-sm font-medium text-[#C4C2C2] mt-2">
                  {t("tabMessage.descriptionCustomerMessages")}
                </p>
                <div className="flex flex-col gap-4 w-full mt-5">
                  <div className="w-full border border-gray-primary rounded-xl py-4 sm:py-5 flex items-center px-5 sm:px-10">
                    <div className="flex justify-center gap-3">
                      <div className="rounded-xl bg-red-100 px-3.5 flex items-center justify-center">
                        <MessageSquare size={22} className="text-red-500" />
                      </div>
                      <div className="flex flex-col">
                        <p className="font-roboto text-lg sm:text-xl font-medium">
                          {unreadChatsCount}
                        </p>
                        <p className="font-roboto text-sm font-light">
                          {t("tabMessage.titleUnreadChats")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full border border-gray-primary rounded-xl py-4 sm:py-5 flex items-center px-5 sm:px-10">
                    <div className="flex justify-center gap-3">
                      <div className="rounded-xl bg-blue-100 px-3.5 flex items-center justify-center">
                        <Users size={22} className="text-blue-500" />
                      </div>
                      <div className="flex flex-col">
                        <p className="font-roboto text-xl font-medium">
                          {stats?.activeChatsCount}
                        </p>
                        <p className="font-roboto font-light">
                          {t("tabMessage.titleActiveConversations")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full border border-gray-primary rounded-xl py-4 sm:py-5 flex items-center px-5 sm:px-10">
                    <div className="flex justify-center gap-3">
                      <div className="rounded-xl bg-red-100 px-3.5 flex items-center justify-center">
                        <MessageSquare size={22} className="text-red-500" />
                      </div>
                      <div className="flex flex-col">
                        <p className="font-roboto text-xl font-medium">
                          {stats?.closedChatsCount}
                        </p>
                        <p className="font-roboto font-light">
                          {t("tabMessage.titleFinishedChats")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-9 border border-gray-primary rounded-xl p-4 sm:p-5 flex flex-col gap-5">
                  <h2 className="font-roboto text-base sm:text-lg">
                    {t("tabMessage.titleLatestMessages")}
                  </h2>
                  {stats?.latestMessages?.slice(0, 3).map((message) => (
                    <div
                      key={message.id}
                      className={`border rounded-xl w-full flex gap-5 py-3 px-6 cursor-pointer transition-all duration-200 ${
                        !message.isRead
                          ? "border-black bg-gray-primary hover:bg-gray-200"
                          : "border-gray-primary hover:bg-gray-50"
                      }`}
                    >
                      <div className="rounded-full bg-[#CED8EE] p-1 size-fit">
                        <Users size={20} />
                      </div>
                      <div className="flex flex-col font-roboto">
                        <div className="flex items-center gap-2">
                          <p>{message.sender?.username || "Unknown"}</p>
                          {!message.isRead && (
                            <div className="w-2 h-2 bg-black rounded-full"></div>
                          )}
                        </div>
                        <p className="text-[15px] font-semibold text-[#727070]">
                          {message.chat?.topic || "No topic"}
                        </p>
                        <p className="text-[15px] font-semibold">
                          {message.text}
                        </p>
                        <p className="text-[15px] font-extrabold text-[#7C7A7A]">
                          {new Date(message.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="settings">
              <MetaForm
                currentUser={currentUser}
                onSuccess={() => setActiveTab("myInquiries")}
                onUserUpdate={onUserUpdate}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default SellerTabsMobile;
