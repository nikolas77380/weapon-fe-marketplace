/**
 * Helpers to display product title and description in the user's locale.
 * Falls back to product.title / product.description when translations are missing (e.g. legacy products).
 */

import type { Product } from "./types";
import type { Locale } from "@/i18n/config";

export function getProductTitle(
  product: Pick<Product, "title" | "titleUa" | "titleEn"> | null | undefined,
  locale: Locale
): string {
  if (!product) return "";
  if (locale === "ua" && product.titleUa) return product.titleUa;
  if (locale === "en" && product.titleEn) return product.titleEn;
  return product.title ?? "";
}

export function getProductDescription(
  product: Pick<Product, "description" | "descriptionUa" | "descriptionEn"> | null | undefined,
  locale: Locale
): string | undefined {
  if (!product) return undefined;
  if (locale === "ua" && product.descriptionUa != null) return product.descriptionUa;
  if (locale === "en" && product.descriptionEn != null) return product.descriptionEn;
  return product.description;
}
