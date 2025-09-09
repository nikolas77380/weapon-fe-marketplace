import { Product } from "./types";

export const calculateTotalViews = (products: Product[]): number => {
  return products.reduce((sum, product) => {
    const views = Number(product.viewsCount) || 0;
    return sum + views;
  }, 0);
};
