import DetailProductPageComponent from "@/components/shop/detail-page/DetailProductPageComponent";
import React from "react";

const DetailProductPage = async ({
  params,
}: {
  params: Promise<{ id: number }>;
}) => {
  const { id } = await params;

  return <DetailProductPageComponent productId={id} />;
};

export default DetailProductPage;
