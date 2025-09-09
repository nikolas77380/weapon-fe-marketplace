"use client";

import { UserProfile } from "@/lib/types";
import SellerAccountTabs from "./SellerTabs";
import { useProducts } from "@/hooks/useProducts";

const SellerAccount = ({ currentUser }: { currentUser: UserProfile }) => {
  const { products, loading, refetch } = useProducts({
    seller: currentUser.id,
  });

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
