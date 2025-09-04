"use client";

import ErrorState from "@/components/ui/ErrorState";
import LoadingState from "@/components/ui/LoadingState";
import NotFoundState from "@/components/ui/NotFoundState";
import { useProduct } from "@/hooks/useProducts";
import ProductDetail from "./ProductDetail";
import PageWrapper from "@/components/ui/PageWrapper";

interface DetailProductPageComponentProps {
  productId: number;
}

const DetailProductPageComponent = ({
  productId,
}: DetailProductPageComponentProps) => {
  const { product, loading, error } = useProduct(productId);

  const customLabels = {
    [productId.toString()]: product?.title || "Product",
  };

  return (
    <PageWrapper customLabels={customLabels}>
      {loading && <LoadingState title="Loading product..." />}

      {error && <ErrorState title="Error loading product" message={error} />}

      {!loading && !error && !product && (
        <NotFoundState
          title="Product not found"
          message={`The product with slug "${productId}" doesn't exist or you don't have permission to edit it.`}
        />
      )}

      {!loading && !error && product && <ProductDetail product={product} />}
    </PageWrapper>
  );
};

export default DetailProductPageComponent;
