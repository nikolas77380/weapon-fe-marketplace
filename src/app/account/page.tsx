import BuyerAccountHeader from "@/components/buyer/buyer-account/BuyerAccountHeader";
import BuyerAccountTabs from "@/components/buyer/buyer-account/BuyerAccountTabs";
import SellerAccount from "@/components/seller/seller-account";
import { requireAuth } from "@/lib/server-auth";
import { isBuyer, isSeller } from "@/lib/utils";
import React from "react";

const BuyerAccountPage = async () => {
  const currentUser = await requireAuth();

  return (
    <main className=" w-full h-full min-h-screen mb-20">
      <div className="container mx-auto mt-16">
        {isBuyer(currentUser) && (
          <>
            <BuyerAccountHeader currentUser={currentUser} />
            <BuyerAccountTabs />
          </>
        )}
        {isSeller(currentUser) && (
          <>
            <SellerAccount currentUser={currentUser} />
          </>
        )}
      </div>
    </main>
  );
};

export default BuyerAccountPage;
