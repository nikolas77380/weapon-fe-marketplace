"use client";

import React, { useMemo } from "react";
import { useTopProductsByCategory } from "@/hooks/useTopProductsByCategory";
import { useTranslations } from "next-intl";
import ProductsSlider from "../ui/ProductsSlider";
import { Product } from "@/lib/types";

const TopProductsSlider = () => {
  const t = useTranslations("TopProducts");
  const { data: topProducts = [] } = useTopProductsByCategory();

  const filteredProducts = useMemo(() => {
    return (topProducts as Product[]).filter(
      (product) => product.activityStatus !== "archived"
    );
  }, [topProducts]);

  return (
    <ProductsSlider
      products={filteredProducts}
      title={t("title")}
      navigationPrefix="top-products"
      sliderClassName="top-products-slider custom-scrollbar"
    />
  );
};

export default TopProductsSlider;
