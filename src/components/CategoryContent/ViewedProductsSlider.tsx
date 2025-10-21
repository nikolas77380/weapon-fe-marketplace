"use client";

import React from "react";
import { useViewedProducts } from "@/hooks/useViewedProducts";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { useAuthContext } from "@/context/AuthContext";
import { Product } from "@/lib/types";
import { useTranslations } from "next-intl";
import ProductsSlider from "../ui/ProductsSlider";

const ViewedProductsSlider = () => {
  const t = useTranslations("ViewedRecommendedProductsSlider");
  const { currentUser } = useAuthContext();
  const { viewedProductIds, hasViewedProducts } = useViewedProducts();

  const { data: response } = useProductsQuery({
    pagination: {
      page: 1,
      pageSize: 100,
    },
  });

  const allProducts = response?.data || [];

  // Filter only viewed products in the correct order
  const viewedProducts: Product[] = viewedProductIds
    .map((id) => allProducts.find((product: Product) => product.id === id))
    .filter((product): product is Product => product !== undefined);

  if (!currentUser || !hasViewedProducts || viewedProducts.length === 0) {
    return null;
  }

  return (
    <ProductsSlider
      products={viewedProducts}
      title={t("title")}
      navigationPrefix="viewed"
      sliderClassName="viewed-products-slider custom-scrollbar"
    />
  );
};

export default ViewedProductsSlider;
