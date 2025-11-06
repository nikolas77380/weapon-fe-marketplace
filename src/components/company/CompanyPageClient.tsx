"use client";

import React from "react";
import PageWrapper from "../ui/PageWrapper";
import LoadingState from "../ui/LoadingState";
import ErrorState from "../ui/ErrorState";
import NotFoundState from "../ui/NotFoundState";
import CompanyDetail from "./CompanyDetail";
import { useTranslations } from "next-intl";
import { useSellerData } from "@/hooks/useSellerData";
import { UserProfile } from "@/lib/types";

interface CompanyPageClientProps {
  initialSellerData: UserProfile;
  initialSellerMeta?: any;
  currentUser?: UserProfile | null;
}

const CompanyPageClient = ({
  initialSellerData,
  initialSellerMeta,
  currentUser,
}: CompanyPageClientProps) => {
  // Используем хук для обновления данных в фоне
  // initialData уже загружены на сервере, поэтому сразу показываем их
  const { sellerData, sellerMeta, loading, error } = useSellerData(
    initialSellerData.id
  );
  const t = useTranslations("CompanyDetail");

  // Используем данные из query или initialData
  // initialData используется сразу, а хук обновит данные в фоне
  const sellerDataToUse = sellerData || initialSellerData;

  // Показываем loading только если нет initialData и идет загрузка
  const isLoading = loading && !initialSellerData;

  // Создаем кастомные названия для хлебных крошек
  const customLabels = {
    [sellerDataToUse.id.toString()]:
      sellerDataToUse.metadata?.companyName || "Company",
  };

  return (
    <PageWrapper customLabels={customLabels}>
      {isLoading && <LoadingState title={t("loadingCompany")} />}

      {error && (
        <ErrorState
          title={t("errorLoadingCompany")}
          message={error || t("messageErrorLoading")}
        />
      )}

      {!isLoading && !error && sellerDataToUse && (
        <CompanyDetail sellerData={sellerDataToUse} />
      )}
    </PageWrapper>
  );
};

export default CompanyPageClient;
