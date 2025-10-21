import { useState, useEffect, useCallback } from "react";
import { getProducts } from "@/lib/strapi";
import { Product } from "@/lib/types";
import { useCategories } from "./useCategories";
import { getCategoryWithAllChildren } from "@/lib/categoryUtils";

export const useCategoryCounts = () => {
  const { categories } = useCategories();
  const [categoryCounts, setCategoryCounts] = useState<{
    [key: number]: number;
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoryCounts = useCallback(async () => {
    if (categories.length === 0) return;

    try {
      setLoading(true);
      setError(null);

      // Получаем все продукты без фильтрации для подсчета количества по категориям
      const response = await getProducts({
        pagination: {
          page: 1,
          pageSize: 100, // Большое число чтобы получить все продукты
        },
      });

      if (response) {
        const products = response.data || response;
        const counts: { [key: number]: number } = {};

        // Подсчитываем прямые категории товаров
        products.forEach((product: Product) => {
          if (product.category?.id) {
            counts[product.category.id] =
              (counts[product.category.id] || 0) + 1;
          }
        });

        // Подсчитываем товары для родительских категорий
        // (включая все дочерние категории)
        categories.forEach((category) => {
          const allChildCategories = getCategoryWithAllChildren(
            categories,
            category.id
          );

          // Суммируем товары из всех дочерних категорий
          let totalCount = 0;
          allChildCategories.forEach((childCat) => {
            if (counts[childCat.id]) {
              totalCount += counts[childCat.id];
            }
          });

          // Если у категории есть товары (прямые или в дочерних), устанавливаем счетчик
          if (totalCount > 0) {
            counts[category.id] = totalCount;
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
  }, [categories]);

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
