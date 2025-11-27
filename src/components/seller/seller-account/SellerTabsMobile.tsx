import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
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
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import MetaForm from "./MetaForm";
import AddProductPageComponent from "../add-product/AddProductPageComponent";

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
  const searchParams = useSearchParams();
  const router = useRouter();

  const { favourites, loading: favouritesLoading, refresh } = useFavourites();
  const { viewMode, toggleToGrid, toggleToList } = useViewMode("grid");

  // Initialize accordion state - default to myInquiries
  const [activeAccordion, setActiveAccordion] = useState<string[]>([
    "myInquiries",
  ]);

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

  // Scroll to tab function
  const scrollToTab = useCallback((tabValue: string) => {
    // Try to find by id first
    let element = document.getElementById(`accordion-${tabValue}`);
    // If not found, try to find by data attribute
    if (!element) {
      element = document.querySelector(`[data-accordion-item="${tabValue}"]`);
    }
    if (element) {
      setTimeout(() => {
        const elementTop =
          element.getBoundingClientRect().top + window.pageYOffset;
        const offset = 80; // Offset from top for mobile header
        window.scrollTo({
          top: elementTop - offset,
          behavior: "smooth",
        });
      }, 300); // Wait for accordion animation
    }
  }, []);

  // Track previous search params to detect navigation vs page reload
  const previousSearchParamsRef = useRef<string | null>(null);
  const isProgrammaticUrlUpdateRef = useRef(false);
  const isFirstMountRef = useRef(true);

  // Check URL search params for tab parameter
  useEffect(() => {
    if (pathname === "/account") {
      const tab = searchParams.get("tab");
      const currentSearchParams = searchParams.toString();
      const isUrlChange =
        previousSearchParamsRef.current !== currentSearchParams;

      if (
        tab === "favourites" ||
        tab === "settings" ||
        tab === "messages" ||
        tab === "addProduct"
      ) {
        setActiveAccordion((prev) => {
          if (!prev.includes(tab)) {
            const newValue = [...prev, tab];
            // Scroll only if:
            // 1. URL changed (navigation happened)
            // 2. Not a programmatic update (manual accordion change)
            // 3. Not first mount (page reload)
            if (
              isUrlChange &&
              !isProgrammaticUrlUpdateRef.current &&
              !isFirstMountRef.current
            ) {
              setTimeout(() => {
                scrollToTab(tab);
              }, 100);
            }
            return newValue;
          }
          // If already open, scroll only if navigation (not reload or programmatic)
          if (
            isUrlChange &&
            !isProgrammaticUrlUpdateRef.current &&
            !isFirstMountRef.current
          ) {
            setTimeout(() => {
              scrollToTab(tab);
            }, 100);
          }
          return prev;
        });
      }

      previousSearchParamsRef.current = currentSearchParams;
      isProgrammaticUrlUpdateRef.current = false;
      isFirstMountRef.current = false;
    }
  }, [pathname, searchParams, scrollToTab]);

  return (
    <div className="block md:hidden w-full px-3 sm:px-6">
      <TopProgressBar isLoading={loading} />
      <SellerAccountHeader currentUser={currentUser} />
      <div className="mt-6">
        <Accordion
          type="multiple"
          value={activeAccordion}
          onValueChange={(value) => {
            setActiveAccordion(value);
            // Update URL when accordion is changed manually
            // Find the last non-default tab (most recently opened)
            const nonDefaultTabs = value.filter((tab) => tab !== "myInquiries");
            const lastTab =
              nonDefaultTabs.length > 0
                ? nonDefaultTabs[nonDefaultTabs.length - 1]
                : null;

            // Mark as programmatic update to prevent scroll
            isProgrammaticUrlUpdateRef.current = true;

            if (
              lastTab === "favourites" ||
              lastTab === "settings" ||
              lastTab === "addProduct" ||
              lastTab === "messages"
            ) {
              router.replace(`/account?tab=${lastTab}`, { scroll: false });
            } else {
              // Remove tab parameter if only default tab is open
              router.replace("/account", { scroll: false });
            }
          }}
          className="w-full space-y-1"
        >
          <AccordionItem value="myInquiries" className="rounded-md border-b-0">
            <AccordionTrigger
              id="accordion-myInquiries"
              data-accordion-item="myInquiries"
              className="bg-gold-main text-white px-4 py-3 hover:no-underline [&>svg]:text-white"
            >
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
                          <p className="text-xs sm:text-sm text-muted-foreground py-8">
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
            <AccordionTrigger
              id="accordion-favourites"
              data-accordion-item="favourites"
              className="bg-gold-main text-white px-4 py-3 hover:no-underline [&>svg]:text-white"
            >
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
            <AccordionTrigger
              id="accordion-messages"
              data-accordion-item="messages"
              className="bg-gold-main text-white px-4 py-3 hover:no-underline [&>svg]:text-white"
            >
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
                <div className="mt-9 border border-gray-primary rounded-xl p-4 sm:p-5 flex flex-col gap-3">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {t("tabMessage.descriptionCustomerMessages")}
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="addProduct" className="rounded-md border-b-0">
            <AccordionTrigger
              id="accordion-addProduct"
              data-accordion-item="addProduct"
              className="bg-gold-main text-white px-4 py-3 hover:no-underline [&>svg]:text-white"
            >
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
            <AccordionTrigger
              id="accordion-settings"
              data-accordion-item="settings"
              className="bg-gold-main text-white px-4 py-3 hover:no-underline [&>svg]:text-white"
            >
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
