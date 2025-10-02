import { useState, useEffect, useCallback } from "react";
import { searchProductsPublic, searchProducts } from "@/lib/strapi";
import { Product } from "@/lib/types";

export const useProductSearch = (params?: {
  search: string;
  categorySlug?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  sort?: string;
  useAuth?: boolean; // Whether to use authenticated search or public search
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    pageCount: 0,
    total: 0,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");

  const searchProductsData = useCallback(async () => {
    if (!params?.search || params.search.trim().length === 0) {
      setProducts([]);
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
        ? await searchProducts(params)
        : await searchProductsPublic(params);

      if (response) {
        if (response.data && Array.isArray(response.data)) {
          setProducts(response.data);
        } else if (Array.isArray(response)) {
          setProducts(response);
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
      setError(
        err instanceof Error ? err.message : "Failed to search products"
      );
      setProducts([]);
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
  }, [params]);

  useEffect(() => {
    searchProductsData();
  }, [searchProductsData]);

  return {
    products,
    loading,
    error,
    pagination,
    searchTerm,
    refetch: searchProductsData,
  };
};

// Hook for manual search (not automatic)
export const useProductSearchManual = () => {
  const [products, setProducts] = useState<Product[]>([]);
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
      categorySlug?: string;
      priceRange?: {
        min?: number;
        max?: number;
      };
      pagination?: {
        page?: number;
        pageSize?: number;
      };
      sort?: string;
      useAuth?: boolean;
    }) => {
      if (!searchParams.search || searchParams.search.trim().length === 0) {
        setProducts([]);
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
          ? await searchProducts(searchParams)
          : await searchProductsPublic(searchParams);

        if (response) {
          if (response.data && Array.isArray(response.data)) {
            setProducts(response.data);
          } else if (Array.isArray(response)) {
            setProducts(response);
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
          err instanceof Error ? err.message : "Failed to search products"
        );
        setProducts([]);
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
    setProducts([]);
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
    products,
    loading,
    error,
    pagination,
    searchTerm,
    search,
    clearSearch,
  };
};
