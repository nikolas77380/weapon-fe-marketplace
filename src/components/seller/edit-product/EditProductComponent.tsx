"use client";

import React from "react";
import { useProducts } from "@/hooks/useProducts";
import EditProductForm from "./EditProductForm";
import { UserProfile } from "@/lib/types";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import NotFoundState from "@/components/ui/NotFoundState";
import EditPageWrapper from "@/components/ui/EditPageWrapper";

interface EditProductComponentProps {
  productSlug: string;
  currentUser: UserProfile;
}

const EditProductComponent = ({
  productSlug,
  currentUser,
}: EditProductComponentProps) => {
  const { products, loading, error } = useProducts({ seller: currentUser.id });
  const product = products.find((p) => p.slug === productSlug);

  return (
    <EditPageWrapper currentUser={currentUser}>
      {loading && <LoadingState title="Loading product..." />}

      {error && <ErrorState title="Error loading product" message={error} />}

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
