import { useQuery } from "@tanstack/react-query";
import { getTopProductsByCategories } from "@/lib/strapi";

export const useTopProductsByCategory = () => {
  return useQuery({
    queryKey: ["top-products-by-category"],
    queryFn: async () => {
      try {
        const response = await getTopProductsByCategories();
        return response?.data || [];
      } catch (error) {
        console.error("Error fetching top products by categories:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 минут - данные считаются свежими
    gcTime: 10 * 60 * 1000, // 10 минут - время хранения в кэше
    refetchOnWindowFocus: false, // Не перезапрашивать при фокусе окна
  });
};
