import { MetaForm } from "@/components/seller/seller-account";
import { requireAuth } from "@/lib/server-auth";
import { isBuyer, isSeller } from "@/lib/utils";
import React from "react";

const SettingsPage = async () => {
  const currentUser = await requireAuth();
  return (
    <main className="w-full h-full min-h-screen mb-20">
      <div className="container mx-auto px-2 sm:px-4 lg:px-6">
        {isBuyer(currentUser) && (
          <>
            <div>isBuyer</div>
          </>
        )}
        {isSeller(currentUser) && (
          <>
            <MetaForm currentUser={currentUser} />
          </>
        )}
      </div>
    </main>
  );
};

export default SettingsPage;
