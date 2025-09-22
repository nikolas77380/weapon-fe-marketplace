import BuyerAccountTabs from "@/components/buyer/buyer-account/BuyerAccountTabs";
import SellerAccount from "@/components/seller/seller-account";
import BreadcrumbComponent from "@/components/ui/BreadcrumbComponent";
import { requireAuth } from "@/lib/server-auth";
import { isBuyer, isSeller } from "@/lib/utils";
import React from "react";

const BuyerAccountPage = async () => {
  const currentUser = await requireAuth();

  return (
    <main className=" w-full h-full min-h-screen mb-20">
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 mt-5 md:mt-0">
        {isBuyer(currentUser) && (
          <>
            <BreadcrumbComponent
              currentUser={currentUser}
              className="mt-4 mb-10"
            />
            <BuyerAccountTabs currentUser={currentUser} />
          </>
        )}
        {isSeller(currentUser) && (
          <>
            <BreadcrumbComponent
              currentUser={currentUser}
              className="mt-4 mb-10 hidden md:block"
            />
            <SellerAccount currentUser={currentUser} />
          </>
        )}
      </div>
    </main>
  );
};

export default BuyerAccountPage;
