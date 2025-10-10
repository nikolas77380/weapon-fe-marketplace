import { useState, useEffect } from "react";
import {
  searchProductsElasticPublic,
  searchProductsElastic,
  getProductAggregationsPublic,
  getProductAggregations,
} from "@/lib/strapi";

export interface ElasticSearchParams {
  search?: string;
  categorySlug?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  tags?: string[];
  status?: string;
  availability?: string[];
  condition?: string[];
  subcategories?: string[];
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  sort?: string;
}

export interface ElasticSearchResult {
  data: any[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
    searchTerm?: string;
  };
}

export interface ElasticAggregations {
  categories: Array<{
    key: string;
    doc_count: number;
  }>;
  tags: Array<{
    key: string;
    doc_count: number;
  }>;
  priceStats: {
    min: number;
    max: number;
    avg: number;
    sum: number;
    count: number;
  };
  priceHistogram: Array<{
    key: number;
    doc_count: number;
  }>;
  availability: Array<{
    key: string;
    doc_count: number;
  }>;
  condition: Array<{
    key: string;
    doc_count: number;
  }>;
  subcategories: Array<{
    key: string;
    doc_count: number;
  }>;
}

export const useElasticSearch = (
  params: ElasticSearchParams,
  isAuthenticated = false
) => {
  const [data, setData] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (searchParams: ElasticSearchParams = params) => {
    setLoading(true);
    setError(null);

    try {
      const result: ElasticSearchResult = isAuthenticated
        ? await searchProductsElastic(searchParams)
        : await searchProductsElasticPublic(searchParams);

      setData(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      console.error("Elasticsearch search error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    search();
  }, [
    params.search,
    params.categorySlug,
    params.priceRange,
    params.tags,
    params.status,
    params.sort,
    params.pagination?.page,
  ]);

  return {
    data,
    meta,
    loading,
    error,
    search,
    refetch: () => search(params),
  };
};

export const useElasticAggregations = (
  params: Omit<ElasticSearchParams, "search" | "pagination" | "sort">,
  isAuthenticated = false
) => {
  const [aggregations, setAggregations] = useState<ElasticAggregations | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAggregations = async (searchParams = params) => {
    setLoading(true);
    setError(null);

    try {
      const result = isAuthenticated
        ? await getProductAggregations(searchParams)
        : await getProductAggregationsPublic(searchParams);

      setAggregations(result.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch aggregations"
      );
      console.error("Elasticsearch aggregations error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAggregations();
  }, [params.categorySlug, params.priceRange, params.tags, params.status]);

  return {
    aggregations,
    loading,
    error,
    refetch: () => fetchAggregations(params),
  };
};
