import { UserProfile } from "@/lib/types";
import React, { useState, useMemo, useEffect } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useSellerProducts } from "@/hooks/useSellerProducts";
import ShopCard from "../shop/ShopCard";
import { workTimeCompany } from "@/mockup/workTimeCompany";
import SkeletonComponent from "../ui/SkeletonComponent";
import { Skeleton } from "../ui/skeleton";
import Filters from "../shop/Filters";
import ShopContent from "../shop/ShopContent";
import Sorting from "../shop/Sorting";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { useViewMode } from "@/hooks/useViewMode";

interface CompanyDetailProps {
  sellerData: UserProfile;
}

const CompanyDetail = ({ sellerData }: CompanyDetailProps) => {
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
  });

  // Local loading state for products tab
  const [productsTabLoading, setProductsTabLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const { categories } = useCategories();

  // Filter products by price, category and search
  const filteredProducts = useMemo(() => {
    const filtered = sellerProducts.filter((product) => {
      // Search filter
      const searchMatch =
        filters.search === "" ||
        product.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description
          ?.toLowerCase()
          .includes(filters.search.toLowerCase());

      // Price filter
      const priceMatch =
        product.price >= filters.minPrice && product.price <= filters.maxPrice;

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
          return isDesc ? b.price - a.price : a.price - b.price;
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
    sellerProducts,
    filters.search,
    filters.minPrice,
    filters.maxPrice,
    filters.categoryId,
    filters.sort,
  ]);

  // Products filtered only by price (for category synchronization)
  const priceFilteredProducts = useMemo(() => {
    return sellerProducts.filter(
      (product) =>
        product.price >= filters.minPrice && product.price <= filters.maxPrice
    );
  }, [sellerProducts, filters.minPrice, filters.maxPrice]);

  // Available categories based on price filter
  const availableCategories = useMemo(() => {
    const categoryIds = new Set(
      priceFilteredProducts
        .map((product) => product.category?.id)
        .filter((id): id is number => id !== undefined)
    );
    return categories.filter((category) => categoryIds.has(category.id));
  }, [categories, priceFilteredProducts]);

  // Client-side pagination for filtered products
  const pageSize = 6;
  const startIndex = (filters.page - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + pageSize
  );

  // Pagination data for filtered products
  const paginationData = {
    page: filters.page,
    pageSize: pageSize,
    pageCount: Math.ceil(filteredProducts.length / pageSize),
    total: filteredProducts.length,
  };

  const handlePriceChange = (min: number, max: number) => {
    setFilters((prev) => {
      // Get products filtered by new price
      const newPriceProducts = sellerProducts.filter(
        (product) => product.price >= min && product.price <= max
      );

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
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setFilters((prev) => ({ ...prev, categoryId, page: 1 }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value,
      categoryId: null,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleSortChange = (sort: string) => {
    setFilters((prev) => ({ ...prev, sort, page: 1 }));
  };

  const handleClearAll = () => {
    setFilters({
      minPrice: 1,
      maxPrice: 500000,
      categoryId: null,
      search: "",
      page: 1,
      sort: "id:desc",
    });
    setViewMode("grid");
  };

  // Tab switching handler
  const handleTabChange = (value: string) => {
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
    setActiveTab(value);
  };

  // Show skeletons on first load of products tab
  useEffect(() => {
    if (activeTab === "products" && sellerProducts.length > 0) {
      setProductsTabLoading(true);
      const timer = setTimeout(() => {
        setProductsTabLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [activeTab, sellerProducts.length]);

  return (
    <div className="w-full min-h-screen mb-20">
      <div className="container mx-auto">
        {/* Company Top Info */}
        <div className="flex items-center justify-between mt-7.5 border border-gray-primary p-5">
          <div className="flex items-center gap-3">
            <Avatar className="size-15">
              <AvatarFallback className="uppercase text-3xl">
                {sellerData?.username.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              {/* Company name */}
              {sellerData?.metadata?.companyName && (
                <p className="text-sm text-gray-600">
                  {sellerData.metadata.companyName}
                </p>
              )}
              {/* Country */}
              <p className="text-sm">
                {sellerData?.metadata?.country ? (
                  sellerData.metadata.country
                ) : (
                  <span className="text-gray-400">Country not available</span>
                )}
                ,{" "}
                {sellerData?.metadata?.address ? (
                  sellerData.metadata.address
                ) : (
                  <span className="text-gray-500">Address not available</span>
                )}
              </p>
            </div>
          </div>
          <Button className="border py-2.5 px-5 rounded-none bg-gold-main hover:bg-gold-main/80 duration-300 transition-colors">
            Contact Seller
          </Button>
        </div>

        {/* Tabs */}
        <div className="mt-15">
          <Tabs defaultValue="overview" onValueChange={handleTabChange}>
            <TabsList className="w-full border border-muted-foreground/20">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">
                Products({sellerProducts.length})
              </TabsTrigger>
              <TabsTrigger value="businessInfo">Business Info</TabsTrigger>
            </TabsList>
            {/* Tab Overview */}
            <TabsContent value="overview">
              {productsTabLoading ? (
                <div className="w-full flex gap-7.5">
                  {/* Skeleton for left side */}
                  <div className="flex flex-col w-4/5 space-y-7.5 mt-7.5">
                    <Skeleton className="h-12 w-96" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-8 w-64" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7.5">
                      <SkeletonComponent
                        type="productCard"
                        count={4}
                        className="w-full"
                      />
                    </div>
                  </div>
                  {/* Skeleton for right side */}
                  <div className="w-1/5 mt-7.5">
                    <div className="border border-[#0A0A0A1A] p-5 bg-[#DBDBDB] flex flex-col">
                      <Skeleton className="h-6 w-24 mb-5" />
                      <div className="mt-5 flex flex-col gap-3.5">
                        <Skeleton className="h-6 w-32 mb-2" />
                        <div className="flex flex-col gap-2.5">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-2.5">
                              <Skeleton className="h-4 w-16" />
                              <Skeleton className="h-4 w-20" />
                            </div>
                          ))}
                        </div>
                        <Skeleton className="h-6 w-20 mb-2" />
                        <div className="flex flex-col gap-2.5">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-2.5">
                              <Skeleton className="h-4 w-16" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full flex gap-7.5">
                  {/* Left Side */}
                  <div className="flex flex-col w-4/5 space-y-7.5">
                    <h1 className="text-[40px] font-medium mt-7.5">
                      About {sellerData?.metadata?.companyName}
                    </h1>
                    <p className="text-lg font-light">
                      {sellerData?.metadata?.sellerDescription}
                    </p>
                    <h2 className="text-[30px] font-medium">Certifications</h2>
                    {/* Logic certifications...... */}
                    <h2 className="text-[30px] font-medium">
                      Featured Products
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7.5">
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
                  <div className="w-1/5 mt-7.5">
                    <div className="border border-[#0A0A0A1A] p-5 bg-[#DBDBDB] flex flex-col">
                      <h1 className="text-xl font-medium">Quick info</h1>
                      <div className="mt-5 flex flex-col gap-3.5">
                        {/* Working time */}
                        <h2 className="text-xl font-light">Working time</h2>
                        <div className="flex flex-col gap-2.5">
                          {workTimeCompany.map((schedule, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2.5"
                            >
                              <p className="font-light text-muted-foreground min-w-[62px]">
                                {schedule.day}
                              </p>
                              <p className="font-light">{schedule.time}</p>
                            </div>
                          ))}
                        </div>
                        <h2 className="text-xl font-light">Contact</h2>
                        <div className="flex flex-col gap-2.5">
                          <div className="flex items-center gap-2.5">
                            <p className="font-light text-muted-foreground min-w-[62px]">
                              Phone:
                            </p>
                            <p className="font-light">
                              {sellerData?.metadata?.phoneNumbers}
                            </p>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <p className="font-light text-muted-foreground min-w-[62px]">
                              Email:
                            </p>
                            <p className="font-light">{sellerData?.email}</p>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <p className="font-light text-muted-foreground min-w-[62px]">
                              Address:
                            </p>
                            <p className="font-light">
                              {sellerData?.metadata?.address}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="products">
              <div className="w-full">
                {/* Search and sorting */}
                <div className="mt-12 border border-[#D3D3D3] rounded-lg h-21 flex items-center justify-between px-6 w-full">
                  {productsTabLoading ? (
                    <>
                      <Skeleton className="h-10 w-1/2" />
                      <Skeleton className="h-10 w-32" />
                    </>
                  ) : (
                    <>
                      <div className="relative w-2/3">
                        <Input
                          placeholder="Search products..."
                          value={filters.search}
                          onChange={handleSearchChange}
                          className="pl-9 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 
                          placeholder:text-[#B3B3B3] h-10 w-1/2 border-transparent shadow-none"
                        />
                        <Search
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#B3B3B3]"
                        />
                      </div>
                      {/* Sorting */}
                      <Sorting
                        onSortChange={handleSortChange}
                        selectedSort={filters.sort}
                        onViewChange={setViewMode}
                        selectedView={viewMode}
                      />
                    </>
                  )}
                </div>

                {/* Content with filters */}
                <div className="mt-12 flex gap-12 h-full w-full">
                  {productsTabLoading ? (
                    <>
                      {/* Skeleton for filters */}
                      <div className="w-64">
                        <Skeleton className="h-8 w-32 mb-4" />
                        <Skeleton className="h-32 w-full mb-4" />
                        <Skeleton className="h-8 w-24 mb-2" />
                        <Skeleton className="h-6 w-full mb-1" />
                        <Skeleton className="h-6 w-full mb-1" />
                        <Skeleton className="h-6 w-full mb-4" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                      {/* Skeleton for content */}
                      <div className="w-full">
                        <SkeletonComponent
                          type="productCard"
                          count={6}
                          className="w-full"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Filters */}
                      <Filters
                        onPriceChange={handlePriceChange}
                        onCategoryChange={handleCategoryChange}
                        onClearAll={handleClearAll}
                        availableCategories={availableCategories}
                        selectedCategoryId={filters.categoryId}
                        priceRange={{
                          min: filters.minPrice,
                          max: filters.maxPrice,
                        }}
                      />
                      {/* Shop content */}
                      <div className="w-full h-full">
                        <ShopContent
                          products={paginatedProducts}
                          pagination={paginationData}
                          onPageChange={handlePageChange}
                          viewMode={viewMode}
                          loading={false}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
