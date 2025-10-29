"use client";

import { useSellerData } from "@/hooks/useSellerData";
import React from "react";
import PageWrapper from "../ui/PageWrapper";
import LoadingState from "../ui/LoadingState";
import ErrorState from "../ui/ErrorState";
import NotFoundState from "../ui/NotFoundState";
import CompanyDetail from "./CompanyDetail";
import { useTranslations } from "next-intl";

interface CompanyPageComponentProps {
  companyId: number;
}

const CompanyPageComponent = ({ companyId }: CompanyPageComponentProps) => {
  const { sellerData, loading, error } = useSellerData(companyId);
  const t = useTranslations("CompanyDetail");

  // Создаем кастомные названия для хлебных крошек
  const customLabels = {
    [companyId.toString()]: sellerData?.metadata?.companyName || "Company",
  };

  return (
    <PageWrapper customLabels={customLabels}>
      {loading && <LoadingState title={t("loadingCompany")} />}

      {error && (
        <ErrorState
          title={t("errorLoadingCompany")}
          message={error || t("messageErrorLoading")}
        />
      )}

      {!loading && !error && !sellerData && (
        <NotFoundState
          title={t("companyNotFound")}
          message={t("messageCompanyNotFound")}
        />
      )}

      {!loading && !error && sellerData && (
        <CompanyDetail sellerData={sellerData} />
      )}
    </PageWrapper>
  );
};

export default CompanyPageComponent;
