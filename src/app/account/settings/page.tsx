import MetaForm from "@/components/seller/seller-account/MetaForm";
import { requireAuth } from "@/lib/server-auth";
import { isBuyer, isSeller } from "@/lib/utils";
import React from "react";

const SettingsPage = async () => {
  const currentUser = await requireAuth();
  return (
    <main className=" w-full h-full min-h-screen mb-20">
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
    </main>
  );
};

export default SettingsPage;
