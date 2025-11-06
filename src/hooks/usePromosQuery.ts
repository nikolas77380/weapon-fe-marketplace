import { useQuery } from "@tanstack/react-query";
import { getPromos, getPromoById } from "@/lib/strapi";
import { queryKeys } from "@/lib/query-keys";
import { Promo } from "@/lib/types";

export interface PromosQueryParams {
  category?: number;
  categorySlug?: string;
}

export const usePromosQuery = (
  params?: PromosQueryParams,
  initialData?: { data: Promo[] }
) => {
  const categoryId = params?.category ?? null;
  const categorySlug = params?.categorySlug ?? null;

  return useQuery({
    // Use a stable, primitive-only key to avoid re-fetch loops
    queryKey: [
      ...queryKeys.promos.lists(),
      "filters",
      categoryId,
      categorySlug,
    ],
    queryFn: () => getPromos(params),
    enabled:
      (categorySlug !== "" && categorySlug !== undefined) ||
      categoryId !== null ||
      params === undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    initialData: initialData,
  });
};

export const usePromoQuery = (id?: number) => {
  return useQuery({
    queryKey: queryKeys.promos.detail(id as number),
    queryFn: () => getPromoById(id as number),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
