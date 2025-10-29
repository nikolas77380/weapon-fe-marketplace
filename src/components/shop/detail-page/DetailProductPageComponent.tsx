"use client";

import ErrorState from "@/components/ui/ErrorState";
import LoadingState from "@/components/ui/LoadingState";
import NotFoundState from "@/components/ui/NotFoundState";
import { useProductQuery } from "@/hooks/useProductsQuery";
import ProductDetail from "./ProductDetail";
import PageWrapper from "@/components/ui/PageWrapper";
import { useViewedProducts } from "@/hooks/useViewedProducts";
import { useEffect, useMemo } from "react";
import { useLocale } from "next-intl";

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
        {loading && <LoadingState title="Loading product..." />}

        {error && (
          <ErrorState
            title="Error loading product"
            message={error.message || "Failed to load product"}
          />
        )}

        {!loading && !error && !product && (
          <NotFoundState
            title="Product not found"
            message={`The product with slug "${productId}" doesn't exist or you don't have permission to edit it.`}
          />
        )}

        {!loading && !error && product && <ProductDetail product={product} />}
      </div>
    </PageWrapper>
  );
};

export default DetailProductPageComponent;
