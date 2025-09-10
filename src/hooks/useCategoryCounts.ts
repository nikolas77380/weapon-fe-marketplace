import { useState, useEffect, useCallback } from "react";
import { getProducts } from "@/lib/strapi";
import { Product } from "@/lib/types";

export const useCategoryCounts = () => {
  const [categoryCounts, setCategoryCounts] = useState<{
    [key: number]: number;
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoryCounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Получаем все продукты без фильтрации для подсчета количества по категориям
      const response = await getProducts({
        pagination: {
          page: 1,
          pageSize: 1000, // Большое число чтобы получить все продукты
        },
      });

      if (response) {
        const products = response.data || response;
        const counts: { [key: number]: number } = {};

        products.forEach((product: Product) => {
          if (product.category?.id) {
            counts[product.category.id] =
              (counts[product.category.id] || 0) + 1;
          }
        });

        setCategoryCounts(counts);
      }
    } catch (err) {
      console.error("Error fetching category counts:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch category counts"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategoryCounts();
  }, [fetchCategoryCounts]);

  return {
    categoryCounts,
    loading,
    error,
    refetch: fetchCategoryCounts,
  };
};
