"use client";

import { useSellerData } from "@/hooks/useSellerData";
import React from "react";
import PageWrapper from "../ui/PageWrapper";
import LoadingState from "../ui/LoadingState";
import ErrorState from "../ui/ErrorState";
import NotFoundState from "../ui/NotFoundState";
import CompanyDetail from "./CompanyDetail";

interface CompanyPageComponentProps {
  companyId: number;
}

const CompanyPageComponent = ({ companyId }: CompanyPageComponentProps) => {
  const { sellerData, loading, error } = useSellerData(companyId);

  // Создаем кастомные названия для хлебных крошек
  const customLabels = {
    [companyId.toString()]: sellerData?.metadata?.companyName || "Company",
  };

  return (
    <PageWrapper customLabels={customLabels}>
      {loading && <LoadingState title="Loading company..." />}

      {error && <ErrorState title="Error loading company" message={error} />}

      {!loading && !error && !sellerData && (
        <NotFoundState
          title="Company not found"
          message={`The product with slug "${companyId}" doesn't exist or you don't have permission to edit it.`}
        />
      )}

      {!loading && !error && sellerData && (
        <CompanyDetail sellerData={sellerData} />
      )}
    </PageWrapper>
  );
};

export default CompanyPageComponent;
