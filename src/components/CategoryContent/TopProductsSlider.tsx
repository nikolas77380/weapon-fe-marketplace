"use client";

import React from "react";
import { useTopProductsByCategory } from "@/hooks/useTopProductsByCategory";
import { useTranslations } from "next-intl";
import ProductsSlider from "../ui/ProductsSlider";

const TopProductsSlider = () => {
  const t = useTranslations("TopProducts");
  const { data: topProducts = [] } = useTopProductsByCategory();

  return (
    <ProductsSlider
      products={topProducts}
      title={t("title")}
      navigationPrefix="top-products"
      sliderClassName="top-products-slider custom-scrollbar"
    />
  );
};

export default TopProductsSlider;
