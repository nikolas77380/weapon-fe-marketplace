import React, { useState, useEffect, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { useTranslations } from "next-intl";
import { useFavourites } from "@/hooks/useFavourites";
import { useViewMode } from "@/hooks/useViewMode";
import FavouriteCard from "@/components/buyer/buyer-account/FavouriteCard";
import NotFavouriteState from "@/components/buyer/buyer-account/NotFavouriteState";
import ViewModeToggle from "@/components/ui/ViewModeToggle";
import { usePathname } from "next/navigation";
import MetaForm from "./MetaForm";
import AddProductPageComponent from "../add-product/AddProductPageComponent";
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

  const { favourites, loading: favouritesLoading, refresh } = useFavourites();
  const { viewMode, toggleToGrid, toggleToList } = useViewMode("grid");
  const [activeAccordion, setActiveAccordion] = useState<string[]>([
    "myInquiries",
  ]);
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

  // Check sessionStorage on mount and whenever pathname changes
  useEffect(() => {
    const savedTab = sessionStorage.getItem("accountTab");
    if (
      savedTab === "favourites" ||
      savedTab === "settings" ||
      savedTab === "addProduct"
    ) {
      setActiveAccordion((prev) => {
        if (!prev.includes(savedTab)) {
          return [...prev, savedTab];
        }
        return prev;
      });
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
        setActiveAccordion((prev) => {
          if (!prev.includes(tab)) {
            return [...prev, tab];
          }
          return prev;
        });
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

  return (
    <div className="block md:hidden w-full px-3 sm:px-6">
      <TopProgressBar isLoading={loading} />
      <SellerAccountHeader products={products} currentUser={currentUser} />
      <div className="mt-6">
        <Accordion
          type="multiple"
          value={activeAccordion}
          onValueChange={(value) => setActiveAccordion(value)}
          className="w-full space-y-1"
        >
          <AccordionItem value="myInquiries" className="rounded-md border-b-0">
            <AccordionTrigger className="bg-gold-main text-white px-4 py-3 hover:no-underline [&>svg]:text-white">
              <div className="flex items-center justify-center gap-2">
                <PackageSearch className="min-[400px]:block hidden" size={18} />
                <span className="text-xs sm:text-sm">
                  {t("tabMyInquiries.titleTabMyInquiries")}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 sm:px-6 pt-4 pb-4">
              <div className="mt-7.5">
                <p className="text-xs sm:text-sm font-medium text-[#C4C2C2] mt-2">
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
                      <TabsTrigger value="active" className="text-xs">
                        {t("tabMyInquiries.activeProducts")} (
                        {activeProducts.length})
                      </TabsTrigger>
                      <TabsTrigger value="archived" className="text-xs">
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
                          <p className="text-xs sm:text-sm text-muted-foreground py-8">
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
                          <p className="text-xs sm:text-sm text-muted-foreground py-8">
                            {t("tabMyInquiries.noArchivedProducts")}
                          </p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="favourites" className="rounded-md border-b-0">
            <AccordionTrigger className="bg-gold-main text-white px-4 py-3 hover:no-underline [&>svg]:text-white">
              <div className="flex items-center justify-center gap-2">
                <Heart className="min-[400px]:block hidden" size={18} />
                <span className="text-xs sm:text-sm">
                  {tBuyer("tabFavourites.titleFavourites")}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="space-y-4">
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
                        onRemove={refresh}
                      />
                    ))
                  ) : (
                    <NotFavouriteState />
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="messages" className="rounded-md border-b-0">
            <AccordionTrigger className="bg-gold-main text-white px-4 py-3 hover:no-underline [&>svg]:text-white">
              <div className="flex items-center justify-center gap-2">
                <MessageSquare className="min-[400px]:block hidden" size={18} />
                <span className="text-xs sm:text-sm">
                  {t("tabMessage.titleMessages")}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="mt-7.5">
                <div className="flex items-center justify-between">
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
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="addProduct" className="rounded-md border-b-0">
            <AccordionTrigger className="bg-gold-main text-white px-4 py-3 hover:no-underline [&>svg]:text-white">
              <div className="flex items-center justify-center gap-2">
                <PackagePlus className="min-[400px]:block hidden" size={18} />
                <span className="text-xs sm:text-sm">
                  {t("tabAddProduct.titleAddProduct")}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <AddProductPageComponent
                currentUser={currentUser}
                onProductCreated={() =>
                  setActiveAccordion((prev) => {
                    const newValue = prev.filter((v) => v !== "addProduct");
                    if (!newValue.includes("myInquiries")) {
                      newValue.push("myInquiries");
                    }
                    return newValue;
                  })
                }
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="settings" className="rounded-md border-b-0">
            <AccordionTrigger className="bg-gold-main text-white px-4 py-3 hover:no-underline [&>svg]:text-white">
              <div className="flex items-center justify-center gap-2">
                <Settings className="min-[400px]:block hidden" size={18} />
                <span className="text-xs sm:text-sm">
                  {t("tabSettings.titleSettings")}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <MetaForm
                currentUser={currentUser}
                onSuccess={() =>
                  setActiveAccordion((prev) => {
                    const newValue = prev.filter((v) => v !== "settings");
                    if (!newValue.includes("myInquiries")) {
                      newValue.push("myInquiries");
                    }
                    return newValue;
                  })
                }
                onUserUpdate={onUserUpdate}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default SellerTabsMobile;
