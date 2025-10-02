import { useState, useEffect, useCallback } from "react";
import { searchSellersPublic, searchSellers } from "@/lib/strapi";
import { getSessionTokenFromCookie } from "@/lib/auth";

// Seller type based on the API response
export interface Seller {
  id: number;
  username: string;
  email: string;
  displayName: string;
  confirmed: boolean;
  blocked: boolean;
  role?: {
    id: number;
    name: string;
    description: string;
  };
  metadata?: {
    id: number;
    specialisation?: string;
    sellerDescription?: string;
    companyName?: string;
    webSite?: string;
    phoneNumbers?: string;
    country?: string;
    address?: string;
  };
  products?: Array<{
    id: number;
    title: string;
    price: number;
    currency: string;
    images?: Array<{
      id: number;
      url: string;
      formats?: {
        thumbnail?: {
          url: string;
        };
      };
    }>;
    category?: {
      id: number;
      name: string;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

export const useSellerSearch = (params?: {
  search: string;
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  sort?: string;
  useAuth?: boolean; // Whether to use authenticated search or public search
}) => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    pageCount: 0,
    total: 0,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Create a stable key for the params to avoid infinite loops
  const paramsKey = JSON.stringify({
    search: params?.search,
    pagination: params?.pagination,
    sort: params?.sort,
    useAuth: params?.useAuth,
  });

  const searchSellersData = useCallback(async () => {
    if (!params?.search || params.search.trim().length === 0) {
      setSellers([]);
      setPagination({
        page: 1,
        pageSize: 10,
        pageCount: 0,
        total: 0,
      });
      setSearchTerm("");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = params?.useAuth
        ? await searchSellers(params)
        : await searchSellersPublic(params);

      if (response) {
        if (response.data && Array.isArray(response.data)) {
          setSellers(response.data);
        } else if (Array.isArray(response)) {
          setSellers(response);
        }

        if (response.meta?.pagination) {
          setPagination(response.meta.pagination);
        } else {
          setPagination({
            page: params?.pagination?.page || 1,
            pageSize: params?.pagination?.pageSize || 10,
            pageCount: 1,
            total: response.data?.length || 0,
          });
        }

        if (response.meta?.searchTerm) {
          setSearchTerm(response.meta.searchTerm);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search sellers");
      setSellers([]);
      setPagination({
        page: 1,
        pageSize: 10,
        pageCount: 0,
        total: 0,
      });
      setSearchTerm("");
    } finally {
      setLoading(false);
    }
  }, [paramsKey]);

  useEffect(() => {
    searchSellersData();
  }, [searchSellersData]);

  return {
    sellers,
    loading,
    error,
    pagination,
    searchTerm,
    refetch: searchSellersData,
  };
};

// Hook for manual search (not automatic)
export const useSellerSearchManual = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    pageCount: 0,
    total: 0,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");

  const search = useCallback(
    async (searchParams: {
      search: string;
      pagination?: {
        page?: number;
        pageSize?: number;
      };
      sort?: string;
      useAuth?: boolean;
    }) => {
      if (!searchParams.search || searchParams.search.trim().length === 0) {
        setSellers([]);
        setPagination({
          page: 1,
          pageSize: 10,
          pageCount: 0,
          total: 0,
        });
        setSearchTerm("");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = searchParams.useAuth
          ? await searchSellers(searchParams)
          : await searchSellersPublic(searchParams);

        if (response) {
          if (response.data && Array.isArray(response.data)) {
            setSellers(response.data);
          } else if (Array.isArray(response)) {
            setSellers(response);
          }

          if (response.meta?.pagination) {
            setPagination(response.meta.pagination);
          } else {
            setPagination({
              page: searchParams?.pagination?.page || 1,
              pageSize: searchParams?.pagination?.pageSize || 10,
              pageCount: 1,
              total: response.data?.length || 0,
            });
          }

          if (response.meta?.searchTerm) {
            setSearchTerm(response.meta.searchTerm);
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to search sellers"
        );
        setSellers([]);
        setPagination({
          page: 1,
          pageSize: 10,
          pageCount: 0,
          total: 0,
        });
        setSearchTerm("");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearSearch = useCallback(() => {
    setSellers([]);
    setPagination({
      page: 1,
      pageSize: 10,
      pageCount: 0,
      total: 0,
    });
    setSearchTerm("");
    setError(null);
  }, []);

  return {
    sellers,
    loading,
    error,
    pagination,
    searchTerm,
    search,
    clearSearch,
  };
};
