import { useState, useEffect, useCallback } from "react";
import {
  getSellerMetas,
  getSellerMetaById,
  getSellerMetaBySellerId,
} from "@/lib/strapi";

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

  const paramsKey = JSON.stringify(params);

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
  }, [paramsKey]);

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

export const useSellerMetaBySeller = (sellerId: number) => {
  const [sellerMeta, setSellerMeta] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSellerMeta = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getSellerMetaBySellerId(sellerId);
      if (response && response.data && response.data.length > 0) {
        setSellerMeta(response.data[0]);
      } else {
        setSellerMeta(null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch seller metadata"
      );
    } finally {
      setLoading(false);
    }
  }, [sellerId]);

  useEffect(() => {
    if (sellerId) {
      fetchSellerMeta();
    }
  }, [sellerId, fetchSellerMeta]);

  return {
    sellerMeta,
    loading,
    error,
    refetch: fetchSellerMeta,
  };
};
