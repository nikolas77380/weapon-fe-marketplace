"use client";

import { Product, UserProfile } from "@/lib/types";
import SellerAccountTabs from "./SellerTabs";
import { useSellerProductsQuery } from "@/hooks/useProductsQuery";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const SellerAccount = ({
  currentUser,
  initialProducts = [],
}: {
  currentUser: UserProfile;
  initialProducts?: Product[];
}) => {
  const { currentUser: user, updateUserData } = useCurrentUser(currentUser);

  const {
    data: response,
    isLoading,
    refetch,
  } = useSellerProductsQuery(
    user.id,
    initialProducts.length > 0
      ? {
          data: initialProducts,
          meta: {
            pagination: {
              page: 1,
              pageSize: 30,
              pageCount: 1,
              total: initialProducts.length,
            },
          },
        }
      : undefined
  );

  // Используем данные из запроса, если они есть, иначе initialProducts
  const products = response?.data || initialProducts;
  // Показываем loading только если нет initialData и идет загрузка
  const loading = isLoading && initialProducts.length === 0;

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
