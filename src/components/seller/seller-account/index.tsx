"use client";

import { UserProfile } from "@/lib/types";
import SellerAccountTabs from "./SellerTabs";
import { useSellerProductsQuery } from "@/hooks/useProductsQuery";

const SellerAccount = ({ currentUser }: { currentUser: UserProfile }) => {
  const {
    data: response,
    isLoading,
    refetch,
  } = useSellerProductsQuery(currentUser.id);

  const products = response?.data || [];
  const loading = isLoading;

  return (
    <div className="w-full min-h-screen h-full">
      {/* Seller Tabs */}
      <SellerAccountTabs
        products={products}
        loading={loading}
        refetch={refetch}
        currentUser={currentUser}
      />
    </div>
  );
};

export default SellerAccount;
export { default as MetaForm } from "./MetaForm";
