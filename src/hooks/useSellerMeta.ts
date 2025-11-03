import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getSellerMetas,
  getSellerMetaById,
  getSellerMetaBySellerId,
} from "@/lib/strapi";
import { queryKeys } from "@/lib/query-keys";

export const useSellerMetas = (params?: {
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  sort?: string;
}) => {
  const [sellerMetas, setSellerMetas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    pageCount: 0,
    total: 0,
  });

  const fetchSellerMetas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getSellerMetas(params);
      if (response) {
        if (response.data && Array.isArray(response.data)) {
          setSellerMetas(response.data);
        } else if (Array.isArray(response)) {
          setSellerMetas(response);
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
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch seller metadata"
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchSellerMetas();
  }, [fetchSellerMetas]);

  return {
    sellerMetas,
    loading,
    error,
    pagination,
    refetch: fetchSellerMetas,
  };
};

export const useSellerMeta = (id: number) => {
  const [sellerMeta, setSellerMeta] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSellerMeta = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getSellerMetaById(id);
      if (response) {
        setSellerMeta(response);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch seller metadata"
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchSellerMeta();
    }
  }, [id, fetchSellerMeta]);

  return {
    sellerMeta,
    loading,
    error,
    refetch: fetchSellerMeta,
  };
};

export const useSellerMetaBySeller = (
  sellerId: number,
  enabled: boolean = true
) => {
  const {
    data: response,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.sellerMeta.bySeller(sellerId),
    queryFn: async () => {
      const response = await getSellerMetaBySellerId(sellerId);
      return response;
    },
    enabled: enabled && !!sellerId && sellerId > 0,
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 10 * 60 * 1000, // 10 минут
  });

  const sellerMeta =
    response && response.data && response.data.length > 0
      ? response.data[0]
      : null;

  return {
    sellerMeta,
    loading,
    error: error?.message || null,
    refetch,
  };
};
