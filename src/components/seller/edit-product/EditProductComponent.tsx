"use client";

import React from "react";
import { useSellerProductsQuery } from "@/hooks/useProductsQuery";
import EditProductForm from "./EditProductForm";
import { Product, UserProfile } from "@/lib/types";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import NotFoundState from "@/components/ui/NotFoundState";
import EditPageWrapper from "@/components/ui/PageWrapper";

interface EditProductComponentProps {
  productSlug: string;
  currentUser: UserProfile;
}

const EditProductComponent = ({
  productSlug,
  currentUser,
}: EditProductComponentProps) => {
  const {
    data: response,
    isLoading,
    error,
  } = useSellerProductsQuery(currentUser.id);
  const products = response?.data || [];
  const loading = isLoading;
  const product = products.find((p: Product) => p.slug === productSlug);

  return (
    <EditPageWrapper currentUser={currentUser}>
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
          message={`The product with slug "${productSlug}" doesn't exist or you don't have permission to edit it.`}
        />
      )}

      {!loading && !error && product && <EditProductForm product={product} />}
    </EditPageWrapper>
  );
};

export default EditProductComponent;
