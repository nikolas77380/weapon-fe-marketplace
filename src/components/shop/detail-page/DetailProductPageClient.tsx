"use client";

import ErrorState from "@/components/ui/ErrorState";
import LoadingState from "@/components/ui/LoadingState";
import { useProductQuery } from "@/hooks/useProductsQuery";
import ProductDetail from "./ProductDetail";
import PageWrapper from "@/components/ui/PageWrapper";
import { useViewedProducts } from "@/hooks/useViewedProducts";
import { useEffect, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Product, UserProfile, Category } from "@/lib/types";
import { useCategories } from "@/hooks/useCategories";
import { getCategoryPath } from "@/lib/categoryUtils";

interface DetailProductPageClientProps {
  initialProduct: Product;
  currentUser?: UserProfile | null;
}

const DetailProductPageClient = ({
  initialProduct,
  currentUser,
}: DetailProductPageClientProps) => {
  const {
    data: product,
    isLoading,
    error,
  } = useProductQuery(initialProduct.id, initialProduct);
  const { addViewedProduct } = useViewedProducts();
  const loading = isLoading && !initialProduct;
  const currentLocale = useLocale();
  const t = useTranslations("ProductDetail");
  const { categories } = useCategories();

  // Используем данные из query или initialData
  const productData = product || initialProduct;

  // We save the product to viewed items when it is loaded.
  useEffect(() => {
    if (productData && !loading && !error) {
      addViewedProduct(productData.id);
    }
  }, [productData, loading, error, addViewedProduct]);

  const customLabels = {
    [productData.id.toString()]: productData.title || "Product",
  };

  // Build full category hierarchy path using all categories
  const intermediateCrumbs = useMemo(() => {
    if (!productData?.category || categories.length === 0) return undefined;

    const getCategoryDisplayName = (category: Category) => {
      return currentLocale === "ua" && category?.translate_ua
        ? category.translate_ua
        : category?.name;
    };

    // Get full category path using categoryUtils which ensures we get all levels
    const categoryPath = getCategoryPath(categories, productData.category.id);

    // If path is empty, fallback to just the category itself
    if (categoryPath.length === 0) {
      return [
        {
          href: `/category/${productData.category.slug}`,
          label: getCategoryDisplayName(productData.category),
        },
      ];
    }

    return categoryPath.map((category) => ({
      href: `/category/${category.slug}`,
      label: getCategoryDisplayName(category),
    }));
  }, [productData?.category, categories, currentLocale]);

  return (
    <PageWrapper
      customLabels={customLabels}
      intermediateCrumbs={intermediateCrumbs}
    >
      <div className="container mx-auto px-2 sm:px-4 lg:px-6">
        {loading && <LoadingState title={t("loadingProduct")} />}

        {error && (
          <ErrorState
            title={t("errorLoadingProduct")}
            message={error.message || t("messageErrorLoading")}
          />
        )}

        {!loading && !error && productData && (
          <ProductDetail product={productData} />
        )}
      </div>
    </PageWrapper>
  );
};

export default DetailProductPageClient;
