import CompanyPageComponent from '@/components/company/CompanyPageComponent';
import React from 'react'

const CompanyPage = async ({ params }: { params: Promise<{ id: number }> }) => {
  const { id } = await params;
  return (
    <div>
      <CompanyPageComponent companyId={id} />
    </div>
  )
}

export default CompanyPage
