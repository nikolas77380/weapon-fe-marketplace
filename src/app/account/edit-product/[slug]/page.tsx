import React from "react";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/server-auth";
import EditProductComponent from "@/components/seller/edit-product/EditProductComponent";

const EditProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const currentUser = await requireAuth();

  if (!currentUser) {
    redirect("/auth?mode=login");
  }

  if (currentUser.role.name !== "seller") {
    redirect("/account");
  }

  return <EditProductComponent productSlug={slug} currentUser={currentUser} />;
};

export default EditProductPage;
