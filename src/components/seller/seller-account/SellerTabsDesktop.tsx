import React, { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopProgressBar } from "@/components/ui/TopProgressBar";
import SellerListenedCard from "./SellerListenedCard";
import {
  Heart,
  MessageSquare,
  PackagePlus,
  PackageSearch,
  Settings,
  Users,
} from "lucide-react";
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
import { usePathname, useRouter } from "next/navigation";
import MetaForm from "./MetaForm";
import AddProductPageComponent from "../add-product/AddProductPageComponent";
import { useUnreadChats } from "@/context/UnreadChatsContext";
import { useChatStats } from "@/hooks/useChatStats";

interface SellerTabsDesktopProps {
  products: Product[];
  loading: boolean;
  refetch: () => void;
  currentUser: UserProfile;
  onUserUpdate?: (updatedUser: UserProfile) => void;
}

const SellerTabsDesktop = ({
  products,
  loading,
  currentUser,
  onUserUpdate,
}: SellerTabsDesktopProps) => {
  const t = useTranslations("SellerAccountTabs");
  const tBuyer = useTranslations("BuyerAccountTabs");
  const pathname = usePathname();
  const router = useRouter();
  const { stats } = useChatStats();
  const { favourites, loading: favouritesLoading, refresh } = useFavourites();
  const { viewMode, toggleToGrid, toggleToList } = useViewMode("grid");
  const [activeTab, setActiveTab] = useState("myInquiries");
  const [activeProductTab, setActiveProductTab] = useState<
    "active" | "archived"
  >("active");

  // Разделяем продукты на активные и архивные
  const { activeProducts, archivedProducts } = useMemo(() => {
    const active = products.filter(
      (product) => product.activityStatus !== "archived"
    );
    const archived = products.filter(
      (product) => product.activityStatus === "archived"
    );
    return { activeProducts: active, archivedProducts: archived };
  }, [products]);
  const { unreadChatsCount } = useUnreadChats();
  // Check sessionStorage on mount and whenever pathname changes
  useEffect(() => {
    const savedTab = sessionStorage.getItem("accountTab");
    if (
      savedTab === "favourites" ||
      savedTab === "settings" ||
      savedTab === "addProduct"
    ) {
      setActiveTab(savedTab);
      setTimeout(() => {
        sessionStorage.removeItem("accountTab");
      }, 100);
    }
  }, [pathname]);

  // Listen for custom event when already on /account page
  useEffect(() => {
    const handleTabChange = (event: CustomEvent<string>) => {
      const tab = event.detail;
      if (tab === "addProduct" || tab === "favourites" || tab === "settings") {
        setActiveTab(tab);
        sessionStorage.removeItem("accountTab");
      }
    };

    window.addEventListener(
      "accountTabChange",
      handleTabChange as EventListener
    );
    return () => {
      window.removeEventListener(
        "accountTabChange",
        handleTabChange as EventListener
      );
    };
  }, []);

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
        <TabsList className="flex-col w-64 h-47.5 bg-gray-100 rounded-sm">
          <TabsTrigger value="myInquiries" className={cn(triggerClasses)}>
            <PackageSearch className="mr-1" />
            {t("tabMyInquiries.titleTabMyInquiries")}
          </TabsTrigger>
          <TabsTrigger value="favourites" className={cn(triggerClasses)}>
            <Heart className="mr-1" />
            {tBuyer("tabFavourites.titleFavourites")}
          </TabsTrigger>
          <TabsTrigger value="messages" className={cn(triggerClasses)}>
            <MessageSquare className="mr-1" />
            {t("tabMessage.titleMessages")}
          </TabsTrigger>
          <TabsTrigger value="addProduct" className={cn(triggerClasses)}>
            <PackagePlus className="mr-1" />
            {t("tabAddProduct.titleAddProduct")}
          </TabsTrigger>
          <TabsTrigger value="settings" className={cn(triggerClasses)}>
            <Settings className="mr-1 flex-shrink-0" />
            <span className="truncate min-w-0">
              {t("tabSettings.titleSettings")}
            </span>
          </TabsTrigger>
        </TabsList>
        <div className="grow w-full">
          <SellerAccountHeader
            products={products}
            currentUser={currentUser}
            className="hidden md:block"
          />
          <TopProgressBar isLoading={loading} />
          <div className="mt-9 overflow-hidden">
            <TabsContent
              value="myInquiries"
              className="bg-background border border-sidebar-accent rounded-sm px-6 pt-2 pb-4"
            >
              <div className="mt-7.5">
                <h1 className="text-xl font-roboto">
                  {t("tabMyInquiries.titleTabMyInquiries")}
                </h1>
                <p className="text-sm font-medium text-[#C4C2C2] mt-2">
                  {t("tabMyInquiries.descriptionManageProducts")}
                </p>
                <div className="mt-4">
                  <Tabs
                    value={activeProductTab}
                    onValueChange={(value) =>
                      setActiveProductTab(value as "active" | "archived")
                    }
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="active">
                        {t("tabMyInquiries.activeProducts")} (
                        {activeProducts.length})
                      </TabsTrigger>
                      <TabsTrigger value="archived">
                        {t("tabMyInquiries.archivedProducts")} (
                        {archivedProducts.length})
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="active" className="mt-4">
                      <div className="flex flex-col gap-4 items-center w-full">
                        {activeProducts.length > 0 ? (
                          activeProducts.map((product) => (
                            <SellerListenedCard
                              key={product.id}
                              product={product}
                            />
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground py-8">
                            {t("tabMyInquiries.noActiveProducts")}
                          </p>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="archived" className="mt-4">
                      <div className="flex flex-col gap-4 items-center w-full">
                        {archivedProducts.length > 0 ? (
                          archivedProducts.map((product) => (
                            <SellerListenedCard
                              key={product.id}
                              product={product}
                            />
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground py-8">
                            {t("tabMyInquiries.noArchivedProducts")}
                          </p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="favourites">
              <div className="p-5">
                <ViewModeToggle
                  viewMode={viewMode}
                  onGridClick={toggleToGrid}
                  onListClick={toggleToList}
                  title={tBuyer("tabFavourites.titleMyFavouritesProduct")}
                />

                {/* Favourites Content */}
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
                        onRemove={refresh}
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
                  <h1 className="text-xl font-roboto">
                    {t("tabMessage.titleCustomerMessages")}
                  </h1>
                  <Link
                    href="/messages"
                    className="bg-gold-main py-2.5 px-4 rounded-md flex items-center gap-3 text-white hover:bg-gold-main/80 duration-300 transition-all"
                  >
                    <MessageSquare size={20} />
                    <p className="text-xs md:text-sm font-semibold">
                      {t("tabMessage.titleOpenFullMessenger")}
                    </p>
                  </Link>
                </div>
                <p className="text-sm font-medium text-[#C4C2C2] mt-2">
                  {t("tabMessage.descriptionCustomerMessages")}
                </p>
                <div className="flex items-center justify-between gap-16 w-full mt-5">
                  <div className="w/full border border-gray-primary rounded-xl py-5 flex items-center px-10">
                    <div className="flex justify-center gap-3">
                      <div className="rounded-xl bg-red-100 px-3.5 flex items-center justify-center">
                        <MessageSquare size={22} className="text-red-500" />
                      </div>
                      <div className="flex flex-col">
                        <p className="font-roboto text-xl font-medium">
                          {unreadChatsCount}
                        </p>
                        <p className="font-roboto font-light">
                          {t("tabMessage.titleUnreadChats")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w/full border border-gray-primary rounded-xl py-5 flex items-center px-10">
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
                  <div className="w/full border border-gray-primary rounded-xl py-5 flex items-center px-10">
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
                <div className="mt-9 border border-gray-primary rounded-xl p-5 flex flex-col gap-5">
                  <h2 className="font-roboto">
                    {t("tabMessage.titleLatestMessages")}
                  </h2>
                  {stats?.latestMessages?.map((message) => (
                    <div
                      onClick={() => router.push(`/messages/${message.id}`)}
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
            <TabsContent value="addProduct">
              <AddProductPageComponent
                currentUser={currentUser}
                onProductCreated={() => setActiveTab("myInquiries")}
              />
            </TabsContent>
            <TabsContent value="settings">
              <MetaForm
                currentUser={currentUser}
                onSuccess={() => setActiveTab("myInquiries")}
                onUserUpdate={onUserUpdate}
              />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default SellerTabsDesktop;
