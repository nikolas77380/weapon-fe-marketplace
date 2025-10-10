"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useProductSearchManual } from "@/hooks/useProductSearch";
import { useSellerSearchManual } from "@/hooks/useSellerSearch";
import { Product } from "@/lib/types";
import { Seller } from "@/hooks/useSellerSearch";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Package, Users, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import { useTranslations } from "next-intl";

interface NavbarSearchProps {
  onProductSelect?: (product: Product) => void;
  onSellerSelect?: (seller: Seller) => void;
  placeholder?: string;
  className?: string;
}

export const NavbarSearch = ({
  onProductSelect,
  onSellerSelect,
  placeholder = "Поиск по товарам и продавцам...",
  className = "",
}: NavbarSearchProps) => {
  const t = useTranslations("Navbar");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    products,
    loading: productsLoading,
    search: searchProducts,
    clearSearch: clearProductsSearch,
  } = useProductSearchManual();

  const {
    sellers,
    loading: sellersLoading,
    search: searchSellers,
    clearSearch: clearSellersSearch,
  } = useSellerSearchManual();

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        clearProductsSearch();
        clearSellersSearch();
        setIsDropdownOpen(false);
        return;
      }

      setIsSearching(true);

      // Search products and sellers independently
      const searchPromises = [
        searchProducts({
          search: query.trim(),
          pagination: { page: 1, pageSize: 5 },
        }).catch((error) => {
          console.warn("Products search failed:", error);
          return null;
        }),
        searchSellers({
          search: query.trim(),
          pagination: { page: 1, pageSize: 5 },
        }).catch((error) => {
          console.warn("Sellers search failed:", error);
          return null;
        }),
      ];

      await Promise.allSettled(searchPromises);
      setIsDropdownOpen(true);
      setIsSearching(false);
    }, 300),
    [searchProducts, searchSellers, clearProductsSearch, clearSellersSearch]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const handleInputFocus = useCallback(() => {
    if (products.length > 0 || sellers.length > 0) {
      setIsDropdownOpen(true);
    }
  }, [products.length, sellers.length]);

  const handleInputBlur = useCallback(() => {
    // Delay to allow clicking on dropdown items
    setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  }, []);

  const handleProductClick = useCallback(
    (product: Product) => {
      if (onProductSelect) {
        onProductSelect(product);
      } else {
        router.push(`/products/${product.id}`);
      }
      setSearchQuery("");
      setIsDropdownOpen(false);
    },
    [onProductSelect, router]
  );

  const handleSellerClick = useCallback(
    (seller: Seller) => {
      if (onSellerSelect) {
        onSellerSelect(seller);
      } else {
        router.push(`/seller/${seller.id}`);
      }
      setSearchQuery("");
      setIsDropdownOpen(false);
    },
    [onSellerSelect, router]
  );

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Prevent Enter key from submitting the form or navigating
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const hasResults = products.length > 0 || sellers.length > 0;
  const isLoading = productsLoading || sellersLoading || isSearching;
  const hasAnyResults = hasResults;

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-main h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-4 w-full rounded-sm border-gold-main placeholder:text-white/50"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
        )}
      </div>

      {/* Dropdown Results */}
      {isDropdownOpen && (hasAnyResults || isLoading) && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto shadow-lg">
          <CardContent className="p-0">
            <div className="divide-y">
              {/* Products Section */}
              {products.length > 0 && (
                <div className="p-2">
                  <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-50">
                    <Package className="h-3 w-3" />
                    {t("searchResultProducts")}{" "}
                    {products.length > 0 && `(${products.length})`}
                  </div>
                  <div className="space-y-1">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer rounded"
                        onClick={() => handleProductClick(product)}
                      >
                        {product.images && product.images.length > 0 && (
                          <div className="relative w-10 h-10 rounded overflow-hidden shrink-0">
                            <Image
                              src={
                                product.images[0].url ||
                                (product.images[0].formats &&
                                  (product.images[0].formats as any).thumbnail
                                    ?.url) ||
                                "/placeholder-image.jpg"
                              }
                              alt={product.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product.price} {product.currency}
                            {product.seller && (
                              <span className="ml-2">
                                • {product.seller.username}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sellers Section */}
              {sellers.length > 0 && (
                <div className="p-2">
                  <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-50">
                    <Users className="h-3 w-3" />
                    Продавцы {sellers.length > 0 && `(${sellers.length})`}
                  </div>
                  <div className="space-y-1">
                    {sellers.map((seller) => (
                      <div
                        key={seller.id}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer rounded"
                        onClick={() => handleSellerClick(seller)}
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                          <Users className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {seller.displayName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {seller.metadata?.companyName && (
                              <span>{seller.metadata.companyName}</span>
                            )}
                            {seller.products && seller.products.length > 0 && (
                              <span className="ml-2">
                                • {seller.products.length} товаров
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {!hasResults && !isLoading && searchQuery.trim() && (
                <div className="p-4 text-center text-sm text-gray-500">
                  <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>По запросу &quot;{searchQuery}&quot; ничего не найдено</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
