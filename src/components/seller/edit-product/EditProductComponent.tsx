"use client";

import React from "react";
import { useSellerProductsQuery } from "@/hooks/useProductsQuery";
import EditProductForm from "./EditProductForm";
import { Product, UserProfile } from "@/lib/types";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import NotFoundState from "@/components/ui/NotFoundState";
import EditPageWrapper from "@/components/ui/PageWrapper";
import { useTranslations, useLocale } from "next-intl";
import { getProductTitle } from "@/lib/product-i18n";

interface EditProductComponentProps {
  productSlug: string;
  currentUser: UserProfile;
}

const EditProductComponent = ({
  productSlug,
  currentUser,
}: EditProductComponentProps) => {
  const locale = useLocale() as "ua" | "en";
  const {
    data: response,
    isLoading,
    error,
  } = useSellerProductsQuery(currentUser.id);
  const products = response?.data || [];
  const loading = isLoading;
  const product = products.find((p: Product) => p.slug === productSlug);
  const t = useTranslations("EditProduct");
  const productLabel = product
    ? getProductTitle(product, locale) || productSlug
    : productSlug;

  return (
    <EditPageWrapper
      currentUser={currentUser}
      customLabels={
        product
          ? {
              [productSlug]: productLabel,
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
