"use client";

import React, { useMemo } from "react";
import { useTopProductsByCategory } from "@/hooks/useTopProductsByCategory";
import { useTranslations } from "next-intl";
import ProductsSlider from "../ui/ProductsSlider";
import { Product } from "@/lib/types";

interface TopProductsSliderProps {
  initialTopProducts?: Product[];
}

const TopProductsSlider: React.FC<TopProductsSliderProps> = ({
  initialTopProducts,
}) => {
  const t = useTranslations("TopProducts");
  const { data: topProducts = [] } =
    useTopProductsByCategory(initialTopProducts);

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
