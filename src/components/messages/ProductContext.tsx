import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProductData } from "@/hooks/useProductData";

interface ProductContextProps {
  productData?: any;
  isLoading?: boolean;
  error?: any;
  productId?: number;
}

const ProductContextSkeleton = () => (
  <div className="mb-4">
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
      <div className="w-16 h-16 bg-gray-200 rounded animate-pulse flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />
    </div>
  </div>
);

export const ProductContext: React.FC<ProductContextProps> = ({
  productData: externalProductData,
  isLoading: externalIsLoading,
  error: externalError,
  productId,
}) => {
  // Если передан productId, загружаем данные через хук
  const {
    data: fetchedProductData,
    isLoading: fetchedIsLoading,
    error: fetchedError,
  } = useProductData(productId);

  // Используем переданные данные или загруженные
  const productData = externalProductData ?? fetchedProductData;
  const isLoading = externalIsLoading ?? fetchedIsLoading;
  const error = externalError ?? fetchedError;

  console.log("[ProductContext] Full productData:", productData);
  console.log(
    "[ProductContext] productData keys:",
    productData ? Object.keys(productData) : "null"
  );
  console.log("[ProductContext] productData.data:", productData?.data);

  if (isLoading) {
    return <ProductContextSkeleton />;
  }

  if (error) {
    return (
      <div className="mb-4 p-3 bg-red-50 rounded-lg">
        <p className="text-sm text-red-600">Error loading product</p>
      </div>
    );
  }

  // Проверяем разные варианты структуры данных
  const product = productData?.data || productData;

  if (!product || !product.id) {
    console.log("[ProductContext] No valid product data");
    return null;
  }

  console.log("[ProductContext] Using product:", product);

  return (
    <div className="mb-4">
      <Link
        href={`/marketplace/${product.id}`}
        target="_blank"
        className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-gold-main hover:shadow-sm transition-all group"
      >
        <div
          className={cn(
            "relative w-16 h-16 flex-shrink-0 rounded overflow-hidden",
            !product.images?.[0]?.url && "bg-gray-100"
          )}
        >
          {product.images?.[0]?.url ? (
            <Image
              src={product.images[0].url}
              alt={product.title}
              fill
              className="object-cover"
            />
          ) : null}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-gold-main transition-colors">
            {product.title}
          </h4>
          <p className="text-sm font-bold text-gold-main">
            ${product.priceUSD?.toLocaleString()}
          </p>
        </div>
        <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gold-main flex-shrink-0 mt-1" />
      </Link>
    </div>
  );
};
