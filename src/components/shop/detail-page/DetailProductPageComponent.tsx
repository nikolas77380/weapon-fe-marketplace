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

interface DetailProductPageComponentProps {
  productId: number;
}

const DetailProductPageComponent = ({
  productId,
}: DetailProductPageComponentProps) => {
  const { data: product, isLoading, error } = useProductQuery(productId);
  const { addViewedProduct } = useViewedProducts();
  const loading = isLoading;
  const currentLocale = useLocale();
  const t = useTranslations("ProductDetail");

  // We save the product to viewed items when it is loaded.
  useEffect(() => {
    if (product && !loading && !error) {
      addViewedProduct(product.id);
    }
  }, [product, loading, error, addViewedProduct]);

  const customLabels = {
    [productId.toString()]: product?.title || "Product",
  };

  // Prepare intermediate crumbs for category
  const intermediateCrumbs = useMemo(() => {
    if (!product?.category) return undefined;

    const getCategoryDisplayName = (category: any) => {
      return currentLocale === "ua" && category?.translate_ua
        ? category.translate_ua
        : category?.name;
    };

    return [
      {
        href: `/category/${product.category.slug}`,
        label: getCategoryDisplayName(product.category),
      },
    ];
  }, [product?.category, currentLocale]);

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

        {!loading && !error && !product && (
          <NotFoundState
            title={t("productNotFound")}
            message={t("messageProductNotFound")}
          />
        )}

        {!loading && !error && product && <ProductDetail product={product} />}
      </div>
    </PageWrapper>
  );
};

export default DetailProductPageComponent;
