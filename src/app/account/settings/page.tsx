import MetaForm from '@/components/seller/seller-account/metaForm';
import { requireAuth } from '@/lib/server-auth';
import { isBuyer, isSeller } from '@/lib/utils';
import React from 'react'

const SettingsPage = async() => {
  const currentUser = await requireAuth();
  return (
    <main className=" w-full h-full min-h-screen mb-20">
      <div className="container mx-auto mt-16">
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
  )
}

export default SettingsPage
