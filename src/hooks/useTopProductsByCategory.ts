import { useQuery } from "@tanstack/react-query";
import { useCategories } from "./useCategories";
import { getProducts } from "@/lib/strapi";

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
        const allProductsResponse = await getProducts({
          sort: "viewsCount:desc",
          pagination: { page: 1, pageSize: 50 },
        });

        if (!allProductsResponse?.data?.length) {
          return [];
        }

        const products = allProductsResponse.data;

        // Группируем товары по основным категориям
        const productsByMainCategory = new Map();

        for (const product of products) {
          if (!product.category?.id) continue;

          // Находим основную категорию для этого товара
          const findMainCategory = (categoryId: number): any => {
            const category = categories.find((cat) => cat.id === categoryId);
            if (!category) return null;

            // Если это основная категория
            if (!category.parent) return category;

            // Иначе ищем родительскую категорию
            return findMainCategory(category.parent.id);
          };

          const mainCategory = findMainCategory(product.category.id);
          if (!mainCategory) continue;

          // Если для этой основной категории еще нет товара или этот товар имеет больше просмотров
          if (
            !productsByMainCategory.has(mainCategory.id) ||
            product.viewsCount >
              productsByMainCategory.get(mainCategory.id).viewsCount
          ) {
            productsByMainCategory.set(mainCategory.id, product);
          }
        }

        const topProducts = Array.from(productsByMainCategory.values());
        return topProducts;
      } catch {
        return [];
      }
    },
  });
};
