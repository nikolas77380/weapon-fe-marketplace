import { useState, useEffect } from "react";
import { Category } from "@/lib/types";
import { getCategories, getCategoryBySlug } from "@/lib/strapi";

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
  },
  {
    id: 2,
    name: "Armor",
    slug: "armor",
    description: "Protective equipment",
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Accessories",
    slug: "accessories",
    description: "Equipment accessories",
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch categories"
        );
        // Используем fallback данные при ошибке
        setCategories(fallbackCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getMainCategories = () => {
    return categories.filter((category) => !category.parent);
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
    error,
    getMainCategories,
    getSubCategories,
    getCategoryById,
    getCategoryBySlug,
    refetch: () => {
      setLoading(true);
      setError(null);
      getCategories()
        .then(setCategories)
        .catch((err) => {
          console.error("Error refetching categories:", err);
          setError(
            err instanceof Error ? err.message : "Failed to fetch categories"
          );
          setCategories(fallbackCategories);
        })
        .finally(() => setLoading(false));
    },
  };
};

export const useCategoryBySlug = (slug: string) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setCategory(null);
      setLoading(false);
      return;
    }

    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCategoryBySlug(slug);
        setCategory(data);
      } catch (err) {
        console.error("Error fetching category by slug:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch category"
        );
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  return {
    category,
    loading,
    error,
    refetch: () => {
      if (!slug) return;
      setLoading(true);
      setError(null);
      getCategoryBySlug(slug)
        .then(setCategory)
        .catch((err) => {
          console.error("Error refetching category by slug:", err);
          setError(
            err instanceof Error ? err.message : "Failed to fetch category"
          );
          setCategory(null);
        })
        .finally(() => setLoading(false));
    },
  };
};
