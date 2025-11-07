import BuyerAccountTabs from "@/components/buyer/buyer-account/BuyerAccountTabs";
import SellerAccount from "@/components/seller/seller-account";
import BreadcrumbComponent from "@/components/ui/BreadcrumbComponent";
import { requireAuth } from "@/lib/server-auth";
import { getSellerAccountData } from "@/lib/seller-account-server";
import { isBuyer, isSeller } from "@/lib/utils";
import React from "react";

const BuyerAccountPage = async () => {
  const currentUser = await requireAuth();

  // Загружаем данные продавца на сервере для быстрой отрисовки
  const sellerData = isSeller(currentUser)
    ? await getSellerAccountData(currentUser)
    : null;

  return (
    <main className=" w-full h-full min-h-screen mb-20">
      <div className="container mx-auto mt-5 md:mt-0">
        {isBuyer(currentUser) && (
          <>
            <BreadcrumbComponent
              currentUser={currentUser}
              className="mt-4 mb-10"
            />
            <BuyerAccountTabs currentUser={currentUser} />
          </>
        )}
        {isSeller(currentUser) && sellerData && (
          <>
            <BreadcrumbComponent
              currentUser={currentUser}
              className="mt-4 mb-10"
            />
            <SellerAccount
              currentUser={sellerData.currentUser}
              initialProducts={sellerData.products}
            />
          </>
        )}
      </div>
    </main>
  );
};

export default BuyerAccountPage;
