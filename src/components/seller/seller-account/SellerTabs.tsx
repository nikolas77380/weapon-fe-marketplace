import React from "react";
import { Product, UserProfile } from "@/lib/types";
import SellerTabsMobile from "./SellerTabsMobile";
import SellerTabsDesktop from "./SellerTabsDesktop";

const SellerAccountTabs = ({
  products,
  loading,
  refetch,
  currentUser,
}: {
  products: Product[];
  loading: boolean;
  refetch: () => void;
  currentUser: UserProfile;
}) => {
  return (
    <>
      <SellerTabsMobile
        products={products}
        loading={loading}
        refetch={refetch}
        currentUser={currentUser}
      />
      <SellerTabsDesktop
        products={products}
        loading={loading}
        refetch={refetch}
        currentUser={currentUser}
      />
    </>
  );
};

export default SellerAccountTabs;
