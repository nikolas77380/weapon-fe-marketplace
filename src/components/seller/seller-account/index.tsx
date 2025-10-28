"use client";

import { UserProfile } from "@/lib/types";
import SellerAccountTabs from "./SellerTabs";
import { useSellerProductsQuery } from "@/hooks/useProductsQuery";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const SellerAccount = ({ currentUser }: { currentUser: UserProfile }) => {
  const { currentUser: user, updateUserData } = useCurrentUser(currentUser);

  const {
    data: response,
    isLoading,
    refetch,
  } = useSellerProductsQuery(user.id);

  const products = response?.data || [];
  const loading = isLoading;

  return (
    <div className="w-full min-h-screen h-full">
      {/* Seller Tabs */}
      <SellerAccountTabs
        products={products}
        loading={loading}
        refetch={refetch}
        currentUser={user}
        onUserUpdate={updateUserData}
      />
    </div>
  );
};

export default SellerAccount;
export { default as MetaForm } from "./MetaForm";
