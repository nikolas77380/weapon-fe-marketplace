import { UserProfile } from "@/lib/types";
import React, { useState, useMemo, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useSellerProducts } from "@/hooks/useSellerProducts";
import {
  useSellerProductsElastic,
  useSellerFiltersElastic,
} from "@/hooks/useProductsQuery";
import ShopCard from "../shop/ShopCard";
import SkeletonComponent from "../ui/SkeletonComponent";
import { Skeleton } from "../ui/skeleton";
import Filters from "../shop/Filters";
import ShopContent from "../shop/ShopContent";
import Sorting from "../shop/Sorting";
import FilterDrawer from "../shop/FilterDrawer";
import { Input } from "../ui/input";
import { Search, Funnel } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { useViewMode } from "@/hooks/useViewMode";
import { useTranslations } from "next-intl";
import { useCurrency } from "@/hooks/useCurrency";
import CertificateSlider from "./CertificateSlider";
import ContactModal from "../shop/ContactModal";
import BusinessInfo from "./BusinessInfo";

interface CompanyDetailProps {
  sellerData: UserProfile;
}

const CompanyDetail = ({ sellerData }: CompanyDetailProps) => {
  const t = useTranslations("CompanyDetail");
  const { selectedCurrency } = useCurrency();

  const { products: sellerProducts, loading } = useSellerProducts(
    sellerData.id
  );

  // View mode hook
  const { viewMode, setViewMode } = useViewMode("grid");

  // Filters state for products tab
  const [filters, setFilters] = useState({
    minPrice: 1,
    maxPrice: 500000,
    categoryId: null as number | null,
    search: "",
    page: 1,
    sort: "id:desc",
    availability: [] as string[],
    condition: [] as string[],
    categories: [] as string[],
  });

  // Elasticsearch hooks
  const { data: elasticProducts, isLoading: elasticLoading } =
    useSellerProductsElastic({
      sellerId: sellerData.id,
      search: filters.search,
      priceRange: {
        min: filters.minPrice,
        max: filters.maxPrice,
      },
      sort: filters.sort !== "id:desc" ? filters.sort : undefined,
      page: filters.page,
      pageSize: 6,
      availability:
        filters.availability.length > 0 ? filters.availability : undefined,
      condition: filters.condition.length > 0 ? filters.condition : undefined,
      categories:
        filters.categories.length > 0 ? filters.categories : undefined,
    });

  const { data: elasticFilters } = useSellerFiltersElastic({
    sellerId: sellerData.id,
    priceRange: {
      min: filters.minPrice,
      max: filters.maxPrice,
    },
  });

  // Local loading state for products tab
  const [productsTabLoading, setProductsTabLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const [open, setOpen] = useState(false);

  const { categories } = useCategories();

  const handleContactSeller = async (e: React.MouseEvent) => {
    // Prevent event bubbling to parent Link
    e.stopPropagation();
    e.preventDefault();
    setOpen(true);
  };

  // Use Elasticsearch data if available, otherwise fallback to local filtering
  const filteredProducts = useMemo(() => {
    if (elasticProducts?.data) {
      return elasticProducts.data;
    }

    // Helper function to get product price based on selected currency
    const getProductPrice = (product: any): number => {
      if (selectedCurrency === "USD") {
        return product.priceUSD ?? product.price ?? 0;
      } else if (selectedCurrency === "EUR") {
        return product.priceEUR ?? product.price ?? 0;
      } else if (selectedCurrency === "UAH") {
        return product.priceUAH ?? product.price ?? 0;
      }
      return product.price ?? 0;
    };

    // Fallback to local filtering
    const filtered = sellerProducts.filter((product) => {
      // Search filter
      const searchMatch =
        filters.search === "" ||
        product.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description
          ?.toLowerCase()
          .includes(filters.search.toLowerCase());

      // Price filter
      const price = getProductPrice(product);
      const priceMatch = price >= filters.minPrice && price <= filters.maxPrice;

      // Category filter
      const categoryMatch =
        filters.categoryId === null ||
        product.category?.id === filters.categoryId;

      return searchMatch && priceMatch && categoryMatch;
    });

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      const [field, order] = filters.sort.split(":");
      const isDesc = order === "desc";

      switch (field) {
        case "id":
          return isDesc ? b.id - a.id : a.id - b.id;
        case "price":
          const priceA = getProductPrice(a);
          const priceB = getProductPrice(b);
          return isDesc ? priceB - priceA : priceA - priceB;
        case "title":
          const titleA = a.title.toLowerCase();
          const titleB = b.title.toLowerCase();
          if (isDesc) {
            return titleB.localeCompare(titleA);
          }
          return titleA.localeCompare(titleB);
        default:
          return 0;
      }
    });

    return sorted;
  }, [
    elasticProducts?.data,
    sellerProducts,
    filters.search,
    filters.minPrice,
    filters.maxPrice,
    filters.categoryId,
    filters.sort,
    selectedCurrency,
  ]);

  // Products filtered only by price (for category synchronization)
  const priceFilteredProducts = useMemo(() => {
    const getProductPrice = (product: any): number => {
      if (selectedCurrency === "USD") {
        return product.priceUSD ?? product.price ?? 0;
      } else if (selectedCurrency === "EUR") {
        return product.priceEUR ?? product.price ?? 0;
      } else if (selectedCurrency === "UAH") {
        return product.priceUAH ?? product.price ?? 0;
      }
      return product.price ?? 0;
    };

    return sellerProducts.filter((product) => {
      const price = getProductPrice(product);
      return price >= filters.minPrice && price <= filters.maxPrice;
    });
  }, [sellerProducts, filters.minPrice, filters.maxPrice, selectedCurrency]);

  // Available categories based on price filter
  const availableCategories = useMemo(() => {
    if (!priceFilteredProducts.length || !categories.length) {
      return [];
    }

    const categoryIds = new Set(
      priceFilteredProducts
        .map((product) => product.category?.id)
        .filter((id): id is number => id !== undefined)
    );
    return categories.filter((category) => categoryIds.has(category.id));
  }, [categories, priceFilteredProducts]);

  // Memoize priceRange objects to prevent infinite re-renders
  const desktopPriceRange = useMemo(
    () => ({
      min: elasticFilters?.data?.priceStats?.min || 1,
      max: elasticFilters?.data?.priceStats?.max || 500000,
    }),
    [elasticFilters?.data?.priceStats]
  );

  // Category counts for all seller products
  const categoryCounts = useMemo(() => {
    const counts: { [key: number]: number } = {};
    sellerProducts.forEach((product) => {
      if (product.category?.id) {
        counts[product.category.id] = (counts[product.category.id] || 0) + 1;
      }
    });
    return counts;
  }, [sellerProducts]);

  // Memoize other objects that might cause re-renders
  const memoizedCategoryCounts = useMemo(
    () => categoryCounts,
    [categoryCounts]
  );

  // Use Elasticsearch pagination if available, otherwise client-side pagination
  const paginatedProducts = useMemo(() => {
    if (elasticProducts?.data) {
      return elasticProducts.data;
    }

    // Client-side pagination for filtered products
    const pageSize = 6;
    const startIndex = (filters.page - 1) * pageSize;
    return filteredProducts.slice(startIndex, startIndex + pageSize);
  }, [elasticProducts?.data, filteredProducts, filters.page]);

  // Pagination data for filtered products
  const paginationData = useMemo(() => {
    if (elasticProducts?.meta?.pagination) {
      return elasticProducts.meta.pagination;
    }

    const pageSize = 6;
    return {
      page: filters.page,
      pageSize: pageSize,
      pageCount: Math.ceil(filteredProducts.length / pageSize),
      total: filteredProducts.length,
    };
  }, [
    elasticProducts?.meta?.pagination,
    filteredProducts.length,
    filters.page,
  ]);

  const handlePriceChange = useCallback(
    (min: number, max: number) => {
      setFilters((prev) => {
        const getProductPrice = (product: any): number => {
          if (selectedCurrency === "USD") {
            return product.priceUSD ?? product.price ?? 0;
          } else if (selectedCurrency === "EUR") {
            return product.priceEUR ?? product.price ?? 0;
          } else if (selectedCurrency === "UAH") {
            return product.priceUAH ?? product.price ?? 0;
          }
          return product.price ?? 0;
        };

        // Get products filtered by new price
        const newPriceProducts = sellerProducts.filter((product) => {
          const price = getProductPrice(product);
          return price >= min && price <= max;
        });

        // Extract available categories from filtered products
        const availableCategoryIds = new Set(
          newPriceProducts
            .map((product) => product.category?.id)
            .filter((id): id is number => id !== undefined)
        );

        return {
          ...prev,
          minPrice: min,
          maxPrice: max,
          page: 1,
          categoryId:
            prev.categoryId && availableCategoryIds.has(prev.categoryId)
              ? prev.categoryId
              : null,
        };
      });
    },
    [sellerProducts, selectedCurrency]
  );

  const handleCategoryChange = useCallback((categoryId: number | null) => {
    setFilters((prev) => ({ ...prev, categoryId, page: 1 }));
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilters((prev) => ({
        ...prev,
        search: e.target.value,
        categoryId: null,
        page: 1,
      }));
    },
    []
  );

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handleSortChange = useCallback((sort: string) => {
    setFilters((prev) => ({ ...prev, sort, page: 1 }));
  }, []);

  const handleAvailabilityChange = useCallback((availability: string[]) => {
    setFilters((prev) => ({ ...prev, availability, page: 1 }));
  }, []);

  const handleConditionChange = useCallback((condition: string[]) => {
    setFilters((prev) => ({ ...prev, condition, page: 1 }));
  }, []);

  const handleCategoriesChange = useCallback((categories: string[]) => {
    setFilters((prev) => ({ ...prev, categories, page: 1 }));
  }, []);

  const handleClearAll = useCallback(() => {
    setFilters({
      minPrice: 1,
      maxPrice: 500000,
      categoryId: null,
      search: "",
      page: 1,
      sort: "id:desc",
      availability: [],
      condition: [],
      categories: [],
    });
    setViewMode("grid");
  }, [setViewMode]);

  const handleOpenFilterDrawer = useCallback(() => {
    setIsFilterDrawerOpen(true);
  }, []);

  const handleCloseFilterDrawer = useCallback(() => {
    setIsFilterDrawerOpen(false);
  }, []);

  // Tab switching handler
  const handleTabChange = useCallback(
    (value: string) => {
      setActiveTab(value);

      if (value === "products" && activeTab !== "products") {
        setProductsTabLoading(true);
        // Show skeletons while images are loading
        setTimeout(() => {
          setProductsTabLoading(false);
        }, 800);
      } else if (value === "overview" && activeTab === "products") {
        // Show skeletons when switching from products to overview
        setProductsTabLoading(true);
        setTimeout(() => {
          setProductsTabLoading(false);
        }, 800);
      }
    },
    [activeTab]
  );

  return (
    <div className="w-full min-h-screen mb-20">
      <div className="container mx-auto px-2 sm:px-4 lg:px-6">
        {/* Company Top Info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mt-4 sm:mt-7.5 sm:p-5">
          <div className="flex items-center gap-2 sm:gap-3">
            <Avatar className="size-12 sm:size-15">
              <AvatarImage src={sellerData?.metadata?.avatar?.url} />
              <AvatarFallback className="uppercase text-xl sm:text-3xl">
                {sellerData?.username.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              {/* Company name */}
              {sellerData?.metadata?.companyName && (
                <p className="text-xs sm:text-sm text-gray-600">
                  {sellerData.metadata.companyName}
                </p>
              )}
              {/* Country */}
              <p className="text-xs sm:text-sm">
                {sellerData?.metadata?.country ? (
                  sellerData.metadata.country
                ) : (
                  <span className="text-gray-400">{t("titleNotCountry")}</span>
                )}
                ,{" "}
                {sellerData?.metadata?.address ? (
                  sellerData.metadata.address
                ) : (
                  <span className="text-gray-500">{t("titleNotAddress")}</span>
                )}
              </p>
            </div>
          </div>
          <Button
            onClick={handleContactSeller}
            disabled={false}
            className="border py-2 sm:py-2.5 px-4 sm:px-5 text-white rounded-sm bg-gold-main 
            hover:bg-gold-main/80 duration-300 transition-colors text-sm sm:text-base w-full sm:w-auto"
          >
            {t("buttonCardSeller")}
          </Button>
        </div>

        {/* Tabs */}
        <div className="mt-8 sm:mt-15">
          <Tabs
            defaultValue="overview"
            onValueChange={handleTabChange}
            className="w-full h-full"
          >
            <TabsList className="bg-gray-100 rounded-sm flex flex-col min-[550px]:flex-row min-[550px]:w-auto w-full h-full">
              <TabsTrigger
                value="overview"
                className="text-sm sm:text-base w-full min-[550px]:w-auto h-full py-2"
              >
                {t("tabOverview.titleOverview")}
              </TabsTrigger>
              <TabsTrigger
                value="products"
                className="text-sm sm:text-base w-full min-[550px]:w-auto h-full py-2"
              >
                {t("tabProducts.titleProducts")} ({sellerProducts.length})
              </TabsTrigger>
              <TabsTrigger
                value="businessInfo"
                className="text-sm sm:text-base w-full min-[550px]:w-auto h-full py-2"
              >
                {t("tabBusinessInfo.titleBusinessInfo")}
              </TabsTrigger>
            </TabsList>
            {/* Tab Overview */}
            <TabsContent value="overview">
              {productsTabLoading ? (
                <div className="w-full flex flex-col lg:flex-row gap-4 sm:gap-7.5">
                  {/* Skeleton for left side */}
                  <div className="flex flex-col w-full lg:w-4/5 space-y-4 sm:space-y-7.5 mt-4 sm:mt-7.5">
                    <Skeleton className="h-8 sm:h-12 w-full sm:w-96" />
                    <Skeleton className="h-4 sm:h-6 w-full" />
                    <Skeleton className="h-6 sm:h-8 w-32 sm:w-48" />
                    <Skeleton className="h-6 sm:h-8 w-40 sm:w-64" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-7.5">
                      <SkeletonComponent
                        type="productCard"
                        count={4}
                        className="w-full"
                      />
                    </div>
                  </div>
                  {/* Skeleton for right side */}
                  <div className="w-full lg:w-1/5 mt-4 sm:mt-7.5">
                    <div className="border border-[#0A0A0A1A] p-3 sm:p-5 bg-[#DBDBDB] flex flex-col">
                      <Skeleton className="h-5 sm:h-6 w-20 sm:w-24 mb-3 sm:mb-5" />
                      <div className="mt-3 sm:mt-5 flex flex-col gap-2.5 sm:gap-3.5">
                        <Skeleton className="h-5 sm:h-6 w-24 sm:w-32 mb-2" />
                        <div className="flex flex-col gap-2 sm:gap-2.5">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 sm:gap-2.5"
                            >
                              <Skeleton className="h-3 sm:h-4 w-12 sm:w-16" />
                              <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
                            </div>
                          ))}
                        </div>
                        <Skeleton className="h-5 sm:h-6 w-16 sm:w-20 mb-2" />
                        <div className="flex flex-col gap-2 sm:gap-2.5">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 sm:gap-2.5"
                            >
                              <Skeleton className="h-3 sm:h-4 w-12 sm:w-16" />
                              <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full flex flex-col lg:flex-row gap-4 sm:gap-7.5">
                  {/* Left Side */}
                  <div className="flex flex-col w-full lg:w-4/5 space-y-4 sm:space-y-7.5">
                    <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-medium mt-4 sm:mt-7.5">
                      {t("tabOverview.titleAbout")}{" "}
                      {sellerData?.metadata?.companyName}
                    </h1>
                    <p className="text-base sm:text-lg font-light">
                      {sellerData?.metadata?.sellerDescription}
                    </p>
                    <h2 className="text-xl sm:text-2xl lg:text-[30px] font-medium">
                      {t("tabOverview.titleCertifications")}
                    </h2>
                    {/* Certificates Slider */}
                    <CertificateSlider sellerId={sellerData.id} />
                    <h2 className="text-xl sm:text-2xl lg:text-[30px] font-medium">
                      {t("tabOverview.titleFeaturedProducts")}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-7.5">
                      {loading ? (
                        <SkeletonComponent
                          type="productCard"
                          count={4}
                          className="w-full"
                        />
                      ) : (
                        sellerProducts
                          ?.slice(0, 4)
                          ?.map((sellerProduct) => (
                            <ShopCard
                              item={sellerProduct}
                              key={sellerProduct?.id}
                            />
                          ))
                      )}
                    </div>
                  </div>
                  {/* Right Side */}
                  <div className="w-full lg:w-1/5 mt-4 sm:mt-7.5">
                    <div className="border border-border-foreground rounded-sm p-3 sm:p-5 flex flex-col">
                      <h1 className="text-lg sm:text-xl font-medium">
                        {t("tabOverview.titleQuickInfo")}
                      </h1>
                      <div className="mt-3 sm:mt-5 flex flex-col gap-2.5 sm:gap-3.5">
                        {/* Working time */}
                        {(sellerData?.metadata?.workTimeMonFri ||
                          sellerData?.metadata?.workTimeSaturday ||
                          sellerData?.metadata?.workTimeSunday) && (
                          <>
                            <h2 className="text-lg sm:text-xl font-light">
                              {t("tabOverview.titleWorkingTime")}
                            </h2>
                            <div className="flex flex-col gap-2 sm:gap-2.5">
                              {sellerData?.metadata?.workTimeMonFri && (
                                <div className="flex items-center gap-2 sm:gap-2.5">
                                  <p className="font-light text-muted-foreground min-w-[50px] sm:min-w-[62px] text-xs sm:text-sm">
                                    {t(`tabOverview.workTime.monFri`)}
                                  </p>
                                  <p className="font-light text-xs sm:text-sm">
                                    {sellerData?.metadata?.workTimeMonFri ===
                                    "closed"
                                      ? t("tabOverview.workTime.closed")
                                      : sellerData?.metadata?.workTimeMonFri}
                                  </p>
                                </div>
                              )}
                              {sellerData?.metadata?.workTimeSaturday && (
                                <div className="flex items-center gap-2 sm:gap-2.5">
                                  <p className="font-light text-muted-foreground min-w-[50px] sm:min-w-[62px] text-xs sm:text-sm">
                                    {t(`tabOverview.workTime.sat`)}
                                  </p>
                                  <p className="font-light text-xs sm:text-sm">
                                    {sellerData?.metadata?.workTimeSaturday ===
                                    "closed"
                                      ? t("tabOverview.workTime.closed")
                                      : sellerData?.metadata?.workTimeSaturday}
                                  </p>
                                </div>
                              )}
                              {sellerData?.metadata?.workTimeSunday && (
                                <div className="flex items-center gap-2 sm:gap-2.5">
                                  <p className="font-light text-muted-foreground min-w-[50px] sm:min-w-[62px] text-xs sm:text-sm">
                                    {t(`tabOverview.workTime.sun`)}
                                  </p>
                                  <p className="font-light text-xs sm:text-sm">
                                    {sellerData?.metadata?.workTimeSunday ===
                                    "closed"
                                      ? t("tabOverview.workTime.closed")
                                      : sellerData?.metadata?.workTimeSunday}
                                  </p>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                        {/* Contacts */}
                        {(sellerData?.metadata?.phoneNumbers ||
                          sellerData?.metadata?.webSite ||
                          sellerData?.email ||
                          sellerData?.metadata?.address) && (
                          <>
                            <h2 className="text-lg sm:text-xl font-light">
                              {t("tabOverview.titleContact")}
                            </h2>
                            <div className="flex flex-col gap-2 sm:gap-2.5">
                              {sellerData?.metadata?.phoneNumbers && (
                                <div className="flex items-center gap-2 sm:gap-2.5">
                                  <p className="font-light text-muted-foreground min-w-[50px] sm:min-w-[62px] text-xs sm:text-sm">
                                    {t("tabOverview.titlePhone")}
                                  </p>
                                  <a
                                    href={`tel:${sellerData.metadata.phoneNumbers}`}
                                    className="hover:text-gold-main transition-colors duration-300"
                                  >
                                    <p className="font-light text-xs sm:text-sm break-all">
                                      {sellerData.metadata.phoneNumbers}
                                    </p>
                                  </a>
                                </div>
                              )}
                              {sellerData?.metadata?.webSite && (
                                <div className="flex items-center gap-2 sm:gap-2.5">
                                  <p className="font-light text-muted-foreground min-w-[50px] sm:min-w-[62px] text-xs sm:text-sm">
                                    {t("tabOverview.titleWebsite")}
                                  </p>
                                  <a
                                    href={
                                      sellerData.metadata.webSite.startsWith(
                                        "http"
                                      )
                                        ? sellerData.metadata.webSite
                                        : `https://${sellerData.metadata.webSite}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-light truncate text-xs sm:text-sm hover:text-gold-main/80 break-words underline"
                                  >
                                    {sellerData.metadata.webSite}
                                  </a>
                                </div>
                              )}
                              {sellerData?.email && (
                                <div className="flex items-center gap-2 sm:gap-2.5">
                                  <p className="font-light text-muted-foreground min-w-[50px] sm:min-w-[62px] text-xs sm:text-sm">
                                    {t("tabOverview.titleEmail")}
                                  </p>
                                  <p className="font-light text-xs sm:text-sm break-all">
                                    {sellerData.email}
                                  </p>
                                </div>
                              )}
                              {sellerData?.metadata?.address && (
                                <div className="flex items-center gap-2 sm:gap-2.5">
                                  <p className="font-light text-muted-foreground min-w-[50px] sm:min-w-[62px] text-xs sm:text-sm">
                                    {t("tabOverview.titleAddress")}
                                  </p>
                                  <p className="font-light text-xs sm:text-sm">
                                    {sellerData.metadata.address}
                                  </p>
                                </div>
                              )}
                              <div>
                                {open && (
                                  <ContactModal
                                    open={open}
                                    onOpenChange={setOpen}
                                    sellerId={sellerData?.id}
                                  />
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="products">
              <div className="w-full">
                {/* Top Controls - Mobile + Desktop */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full sm:gap-4 lg:gap-0 mt-4 sm:mt-6">
                  {productsTabLoading ? (
                    <>
                      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        <Skeleton className="h-8 w-20 sm:w-24" />
                        <Skeleton className="h-8 w-32 sm:w-40" />
                      </div>
                      <div className="w-full sm:w-auto">
                        <Skeleton className="h-8 w-full sm:w-32" />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Mobile Filters Button + Search */}
                      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto lg:flex-1">
                        {/* Filters Button - Only on mobile */}
                        <button
                          onClick={handleOpenFilterDrawer}
                          className="lg:hidden flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 min-[500px]:px-3 min-[500px]:py-2 border border-border-foreground rounded text-xs min-[500px]:text-sm hover:bg-accent transition-colors cursor-pointer"
                        >
                          <Funnel className="w-3 h-3 min-[500px]:w-4 min-[500px]:h-4" />
                          <span className="hidden min-[400px]:inline">
                            Фільтри
                          </span>
                        </button>

                        {/* Search */}
                        <div className="relative flex-1 sm:w-auto sm:flex-none lg:flex-1 lg:max-w-xs">
                          <Input
                            placeholder={t("tabProducts.placeholderSearch")}
                            value={filters.search}
                            onChange={handleSearchChange}
                            className="pl-8 sm:pl-9 focus-visible:outline-none focus-visible:ring-0 
                            focus-visible:ring-offset-0 placeholder:text-[#B3B3B3] h-8 sm:h-10 w-full 
                            sm:w-48 lg:w-full border-border-foreground shadow-none text-xs sm:text-sm
                            rounded-sm"
                          />
                          <Search
                            size={14}
                            className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 cursor-pointer 
                            text-[#B3B3B3]"
                          />
                        </div>
                      </div>

                      {/* Sorting - Full width on mobile with justify-between */}
                      <div className="w-full sm:w-auto lg:w-auto flex justify-between sm:justify-end items-center sm:gap-0">
                        <Sorting
                          onSortChange={handleSortChange}
                          selectedSort={filters.sort}
                          onViewChange={setViewMode}
                          selectedView={viewMode}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Shop Filtering Content */}
                <div className="flex h-full w-full mt-3 gap-0 lg:gap-6">
                  {productsTabLoading ? (
                    <>
                      {/* Skeleton for filters - Hidden on mobile */}
                      <div className="hidden lg:block w-64">
                        <Skeleton className="h-8 w-32 mb-4" />
                        <Skeleton className="h-32 w-full mb-4" />
                        <Skeleton className="h-8 w-24 mb-2" />
                        <Skeleton className="h-6 w-full mb-1" />
                        <Skeleton className="h-6 w-full mb-1" />
                        <Skeleton className="h-6 w-full mb-4" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                      {/* Skeleton for content */}
                      <div className="w-full lg:flex-1">
                        <SkeletonComponent
                          type="productCard"
                          count={6}
                          className="w-full"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Filters - Hidden on mobile, visible on desktop */}
                      <div className="hidden lg:block">
                        <Filters
                          onPriceChange={handlePriceChange}
                          onSubcategoryChange={handleCategoryChange}
                          onAvailabilityChange={handleAvailabilityChange}
                          onConditionChange={handleConditionChange}
                          onCategoriesChange={handleCategoriesChange}
                          onClearAll={handleClearAll}
                          availableCategories={availableCategories}
                          selectedSubcategoryId={filters.categoryId}
                          selectedAvailability={filters.availability}
                          selectedCondition={filters.condition}
                          selectedCategories={filters.categories}
                          priceRange={desktopPriceRange}
                          categories={memoizedCategoryCounts}
                          hideCategoryFilter={false}
                          elasticFilters={elasticFilters?.data}
                        />
                      </div>
                      {/* Shop Content - Full width on mobile, flex-1 on desktop */}
                      <div className="w-full lg:flex-1 h-full">
                        <ShopContent
                          products={paginatedProducts}
                          pagination={paginationData}
                          onPageChange={handlePageChange}
                          viewMode={viewMode}
                          loading={elasticLoading || loading}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Mobile Filter Drawer */}
                <FilterDrawer
                  isOpen={isFilterDrawerOpen}
                  onClose={handleCloseFilterDrawer}
                  onPriceChange={handlePriceChange}
                  onSubcategoryChange={handleCategoryChange}
                  onClearAll={handleClearAll}
                  availableCategories={availableCategories}
                  selectedSubcategoryId={filters.categoryId}
                  priceRange={{
                    min:
                      elasticFilters?.data?.priceStats?.min || filters.minPrice,
                    max:
                      elasticFilters?.data?.priceStats?.max || filters.maxPrice,
                  }}
                  categories={memoizedCategoryCounts}
                  elasticFilters={elasticFilters?.data}
                  onAvailabilityChange={handleAvailabilityChange}
                  onConditionChange={handleConditionChange}
                  onCategoriesChange={handleCategoriesChange}
                  selectedAvailability={filters.availability}
                  selectedCondition={filters.condition}
                  selectedCategories={filters.categories}
                  hideCategoryFilter={false}
                />
              </div>
            </TabsContent>
            <TabsContent value="businessInfo">
              <BusinessInfo sellerData={sellerData} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
