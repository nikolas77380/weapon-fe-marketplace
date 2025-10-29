"use client";

import React from "react";
import { useSellerProductsQuery } from "@/hooks/useProductsQuery";
import EditProductForm from "./EditProductForm";
import { Product, UserProfile } from "@/lib/types";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import NotFoundState from "@/components/ui/NotFoundState";
import EditPageWrapper from "@/components/ui/PageWrapper";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("EditProduct");

  return (
    <EditPageWrapper
      currentUser={currentUser}
      customLabels={
        product
          ? {
              [productSlug]: product.title || product.name || productSlug,
            }
          : {}
      }
    >
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

      {!loading && !error && product && <EditProductForm product={product} />}
    </EditPageWrapper>
  );
};

export default EditProductComponent;
