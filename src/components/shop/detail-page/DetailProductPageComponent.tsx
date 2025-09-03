"use client";

import EditPageWrapper from "@/components/ui/EditPageWrapper";
import ErrorState from "@/components/ui/ErrorState";
import LoadingState from "@/components/ui/LoadingState";
import NotFoundState from "@/components/ui/NotFoundState";
import { useProduct } from "@/hooks/useProducts";
import { UserProfile } from "@/lib/types";
import ProductDetail from "./ProductDetail";

interface DetailProductPageComponentProps {
  productId: number;
  currentUser: UserProfile;
}

const DetailProductPageComponent = ({
  productId,
  currentUser,
}: DetailProductPageComponentProps) => {
  const { product, loading, error } = useProduct(productId);

  return (
    <EditPageWrapper currentUser={currentUser}>
      {loading && <LoadingState title="Loading product..." />}

      {error && <ErrorState title="Error loading product" message={error} />}

      {!loading && !error && !product && (
        <NotFoundState
          title="Product not found"
          message={`The product with slug "${productId}" doesn't exist or you don't have permission to edit it.`}
        />
      )}

      {!loading && !error && product && <ProductDetail product={product} />}
    </EditPageWrapper>
  );
};

export default DetailProductPageComponent;
