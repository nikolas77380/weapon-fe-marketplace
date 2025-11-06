import React from "react";
import { notFound } from "next/navigation";
import { getProductPageData } from "@/lib/product-server";
import DetailProductPageClient from "@/components/shop/detail-page/DetailProductPageClient";

const DetailProductPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const productId = parseInt(id);

  if (isNaN(productId)) {
    notFound();
  }

  try {
    // Загружаем данные на сервере
    const { product, currentUser } = await getProductPageData(productId);

    if (!product) {
      notFound();
    }

    return (
      <DetailProductPageClient
        initialProduct={product}
        currentUser={currentUser}
      />
    );
  } catch (error) {
    console.error(
      `[Product Page] Failed to load product ${productId} on server:`,
      error
    );
    notFound();
  }
};

export default DetailProductPage;
