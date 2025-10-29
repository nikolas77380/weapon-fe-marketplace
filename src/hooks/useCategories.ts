import { useQuery } from "@tanstack/react-query";
import { Category } from "@/lib/types";
import { getCategories, getCategoryBySlug } from "@/lib/strapi";
import { queryKeys } from "@/lib/query-keys";
import { useLocale } from "next-intl";

// Fallback категории на случай, если API недоступен
const fallbackCategories: Category[] = [
  {
    id: 1,
    name: "Weapons",
    slug: "weapons",
    description: "Firearms and weapons",
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    translate_ua: "Зброя",
  },
  {
    id: 2,
    name: "Armor",
    slug: "armor",
    description: "Protective equipment",
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    translate_ua: "Броня",
  },
  {
    id: 3,
    name: "Accessories",
    slug: "accessories",
    description: "Equipment accessories",
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    translate_ua: "Аксесуари",
  },
];

export const useCategories = () => {
  const locale = useLocale();
  const {
    data: categories = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.categories.lists(),
    queryFn: async () => {
      try {
        return await getCategories();
      } catch (err) {
        console.error("Error fetching categories:", err);
        // Возвращаем fallback данные при ошибке
        return fallbackCategories;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 10 * 60 * 1000, // 10 минут
  });

  const getMainCategories = () => {
    const mainCategories = categories.filter((category) => !category.parent);

    return mainCategories.sort((a, b) => {
      if (locale === "en") {
        return (a.name || "").localeCompare(b.name || "", "en");
      } else {
        const aTrans = a.translate_ua || a.name || "";
        const bTrans = b.translate_ua || b.name || "";
        return aTrans.localeCompare(bTrans, "uk");
      }
    });
  };

  const getSubCategories = (parentId: number) => {
    return categories.filter((category) => category.parent?.id === parentId);
  };

  const getCategoryById = (id: number) => {
    return categories.find((category) => category.id === id);
  };

  const getCategoryBySlug = (slug: string) => {
    return categories.find((category) => category.slug === slug);
  };

  return {
    categories,
    loading,
    error: error?.message || null,
    getMainCategories,
    getSubCategories,
    getCategoryById,
    getCategoryBySlug,
    refetch,
  };
};

export const useCategoryBySlug = (slug: string) => {
  const {
    data: category,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.categories.detail(slug),
    queryFn: async () => {
      if (!slug) return null;
      try {
        return await getCategoryBySlug(slug);
      } catch (err) {
        console.error("Error fetching category by slug:", err);
        throw err;
      }
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 10 * 60 * 1000, // 10 минут
  });

  return {
    category: category || null,
    loading,
    error: error?.message || null,
    refetch,
  };
};
