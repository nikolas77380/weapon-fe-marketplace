"use client";

import ErrorState from "@/components/ui/ErrorState";
import LoadingState from "@/components/ui/LoadingState";
import NotFoundState from "@/components/ui/NotFoundState";
import { useProductQuery } from "@/hooks/useProductsQuery";
import ProductDetail from "./ProductDetail";
import PageWrapper from "@/components/ui/PageWrapper";
import { useViewedProducts } from "@/hooks/useViewedProducts";
import { useEffect, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Product, UserProfile } from "@/lib/types";

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

  // Prepare intermediate crumbs for category
  const intermediateCrumbs = useMemo(() => {
    if (!productData?.category) return undefined;

    const getCategoryDisplayName = (category: any) => {
      return currentLocale === "ua" && category?.translate_ua
        ? category.translate_ua
        : category?.name;
    };

    return [
      {
        href: `/category/${productData.category.slug}`,
        label: getCategoryDisplayName(productData.category),
      },
    ];
  }, [productData?.category, currentLocale]);

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
