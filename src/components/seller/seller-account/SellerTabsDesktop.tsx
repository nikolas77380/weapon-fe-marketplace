import React, { useState, useEffect, useMemo, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopProgressBar } from "@/components/ui/TopProgressBar";
import SellerListenedCard from "./SellerListenedCard";
import {
  Heart,
  MessageSquare,
  PackagePlus,
  PackageSearch,
  Settings,
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import MetaForm from "./MetaForm";
import AddProductPageComponent from "../add-product/AddProductPageComponent";

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
  const searchParams = useSearchParams();
  const { favourites, loading: favouritesLoading, refresh } = useFavourites();
  const { viewMode, toggleToGrid, toggleToList } = useViewMode("grid");
  const [activeTab, setActiveTab] = useState("myInquiries");
  const [activeProductTab, setActiveProductTab] = useState<
    "active" | "archived"
  >("active");

  // Track initial mount to show skeleton on first render
  const isInitialMount = useRef(true);
  const [showSkeleton, setShowSkeleton] = useState(true);

  // Update skeleton visibility based on loading state
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }

    // Show skeleton if loading, hide when loading is complete
    if (loading) {
      setShowSkeleton(true);
    } else {
      // Delay hiding skeleton slightly for smoother transition
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);

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
  // Check URL search params for tab parameter
  useEffect(() => {
    if (pathname === "/account") {
      const tab = searchParams.get("tab");
      if (tab === "favourites" || tab === "settings" || tab === "addProduct") {
        setActiveTab(tab);
      }
    }
  }, [pathname, searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL when tab is changed manually
    if (
      value === "favourites" ||
      value === "settings" ||
      value === "addProduct"
    ) {
      router.replace(`/account?tab=${value}`, { scroll: false });
    } else {
      // Remove tab parameter for default tabs
      router.replace("/account", { scroll: false });
    }
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
                        {showSkeleton ? (
                          <SkeletonComponent
                            type="productCard"
                            count={6}
                            className="w-full"
                          />
                        ) : activeProducts.length > 0 ? (
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
                        {showSkeleton ? (
                          <SkeletonComponent
                            type="productCard"
                            count={6}
                            className="w-full"
                          />
                        ) : archivedProducts.length > 0 ? (
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
                <div className="mt-9 border border-gray-primary rounded-xl p-5 flex flex-col gap-5">
                  <h2 className="font-roboto">
                    {t("tabMessage.titleLatestMessages")}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {t("tabMessage.descriptionCustomerMessages")}
                  </p>
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
