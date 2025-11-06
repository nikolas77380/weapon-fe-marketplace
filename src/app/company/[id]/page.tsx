import React from "react";
import { notFound } from "next/navigation";
import { getCompanyPageData } from "@/lib/company-server";
import CompanyPageClient from "@/components/company/CompanyPageClient";

const CompanyPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const sellerId = parseInt(id);

  if (isNaN(sellerId)) {
    notFound();
  }

  try {
    // Загружаем данные на сервере
    const { sellerData, sellerMeta, currentUser } = await getCompanyPageData(
      sellerId
    );

    return (
      <CompanyPageClient
        initialSellerData={sellerData}
        initialSellerMeta={sellerMeta}
        currentUser={currentUser}
      />
    );
  } catch (error) {
    console.error("Failed to load company on server:", error);
    notFound();
  }
};

export default CompanyPage;
