import DetailProductPageComponent from "@/components/shop/detail-page/DetailProductPageComponent";
import { requireAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import React from "react";

const DetailProductPage = async ({
  params,
}: {
  params: Promise<{ id: number }>;
}) => {
  const { id } = await params;

  const currentUser = await requireAuth();
  
    if (!currentUser) {
      redirect("/auth?mode=login");
    }
  
    if (currentUser.role.name !== "seller") {
      redirect("/account");
    }
  return <DetailProductPageComponent currentUser={currentUser} productId={id} />;
};

export default DetailProductPage;
