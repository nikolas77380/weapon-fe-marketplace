import BuyerAccountHeader from '@/components/buyer/buyer-account/BuyerAccountHeader'
import BuyerAccountTabs from '@/components/buyer/buyer-account/BuyerAccountTabs'
import React from 'react'

const BuyerAccountPage = () => {
  return (
    <main className=' w-full h-full min-h-screen mb-20'>
      <div className='container mx-auto mt-16'>
        <BuyerAccountHeader />
        <BuyerAccountTabs />
      </div>
    </main>
  )
}

export default BuyerAccountPage
