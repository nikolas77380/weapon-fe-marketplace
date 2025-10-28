import React from "react";
import { Product, UserProfile } from "@/lib/types";
import SellerTabsMobile from "./SellerTabsMobile";
import SellerTabsDesktop from "./SellerTabsDesktop";

const SellerAccountTabs = ({
  products,
  loading,
  refetch,
  currentUser,
  onUserUpdate,
}: {
  products: Product[];
  loading: boolean;
  refetch: () => void;
  currentUser: UserProfile;
  onUserUpdate?: (updatedUser: UserProfile) => void;
}) => {
  return (
    <>
      <SellerTabsMobile
        products={products}
        loading={loading}
        refetch={refetch}
        currentUser={currentUser}
        onUserUpdate={onUserUpdate}
      />
      <SellerTabsDesktop
        products={products}
        loading={loading}
        refetch={refetch}
        currentUser={currentUser}
        onUserUpdate={onUserUpdate}
      />
    </>
  );
};

export default SellerAccountTabs;
