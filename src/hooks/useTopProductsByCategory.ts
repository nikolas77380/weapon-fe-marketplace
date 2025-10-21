import { useQuery } from "@tanstack/react-query";
import { useCategories } from "./useCategories";
import { getProducts } from "@/lib/strapi";
import { getCategoryWithAllChildren } from "@/lib/categoryUtils";

export const useTopProductsByCategory = () => {
  const { getMainCategories, categories, loading, error } = useCategories();

  return useQuery({
    queryKey: ["top-products-by-category", categories.length],
    queryFn: async () => {
      if (loading) {
        return [];
      }

      if (error) {
        return [];
      }

      const mainCategories = getMainCategories();

      if (mainCategories.length === 0) {
        return [];
      }

      try {
        // Для каждой основной категории получаем все её подкатегории и подподкатегории
        const promises = mainCategories.map(async (mainCategory) => {
          try {
            // Получаем все категории (основная + подкатегории + подподкатегории)
            const allCategories = getCategoryWithAllChildren(
              categories,
              mainCategory.id
            );
            const categoryIds = allCategories.map((cat) => cat.id);

            // Создаем фильтр для массива категорий
            const categoryFilters = categoryIds
              .map(
                (id) =>
                  `filters[category][$in][${categoryIds.indexOf(id)}]=${id}`
              )
              .join("&");

            // Прямой API запрос с поддержкой массива категорий
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products/public?` +
                new URLSearchParams({
                  "sort[0]": "viewsCount:desc",
                  "populate[0]": "category",
                  "populate[1]": "images",
                  "pagination[page]": "1",
                  "pagination[pageSize]": "1",
                }) +
                "&" +
                categoryFilters
            );

            if (!response.ok) {
              return null;
            }

            const data = await response.json();
            return data?.data?.[0] || null;
          } catch {
            return null;
          }
        });

        const results = await Promise.all(promises);
        const topProducts = results.filter(Boolean);

        return topProducts;
      } catch {
        return [];
      }
    },
  });
};
