import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/lib/strapi";

/**
 * Хук для загрузки данных продукта по ID
 */
export const useProductData = (productId: number | null | undefined) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!productId) return null;

      console.log("[useProductData] Fetching product:", productId);
      const result = await getProductById(productId);
      console.log("[useProductData] Product fetched:", {
        productId,
        success: !!result?.data,
        title: result?.data?.title,
      });
      return result;
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
