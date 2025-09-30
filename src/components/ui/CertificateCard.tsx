"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Certificate } from "@/hooks/useCertificates";
import CertificateModal from "./CertificateModal";
import Image from "next/image";
import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";

interface CertificateCardProps {
  certificate: Certificate;
}

const CertificateCard = ({ certificate }: CertificateCardProps) => {
  const t = useTranslations("CertificateCard");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "revoked":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Card
        className="w-full h-full border-border-foreground rounded-none shadow-none cursor-pointer hover:shadow-lg transition-shadow duration-200"
        onClick={handleCardClick}
      >
        <CardContent className="p-0">
          {/* Certificate Image/Preview */}
          <div className="relative h-32 sm:h-40 bg-gray-50">
            {certificate.certificateFile ? (
              <div className="w-full h-full flex items-center justify-center">
                {certificate.certificateFile.mime?.startsWith("image/") ? (
                  <Image
                    src={certificate.certificateFile.url}
                    alt={certificate.title}
                    fill
                    className="object-cover p-2"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <FileText size={32} className="mb-2" />
                    <span className="text-xs text-center px-2">
                      {certificate.certificateFile.name}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <FileText size={32} className="mb-2" />
                  <span className="text-xs">{t("noFile")}</span>
                </div>
              </div>
            )}

            {/* Status Badge */}
            <div className="absolute top-2 right-2">
              <Badge
                className={`${getStatusColor(certificate.status)} text-xs`}
              >
                {certificate.status}
              </Badge>
            </div>
          </div>

          {/* Certificate Info */}
          <div className="p-3 sm:p-4">
            <h3 className="font-semibold text-sm sm:text-base line-clamp-2 mb-2">
              {certificate.title}
            </h3>

            {certificate.description && (
              <p className="text-xs text-gray-600 mb-3">
                {certificate.description.length > 15
                  ? certificate.description.slice(0, 15) + "..."
                  : certificate.description}
              </p>
            )}

            <div className="space-y-1 text-xs">
              <div>
                <span className="font-medium text-gray-700">
                  {t("issuedBy")}
                </span>
                <p className="text-gray-600 truncate">{certificate.issuedBy}</p>
              </div>

              <div>
                <span className="font-medium text-gray-700">{t("date")}</span>
                <p className="text-gray-600">
                  {formatDate(certificate.issuedDate)}
                </p>
              </div>

              {certificate.certificateNumber && (
                <div>
                  <span className="font-medium text-gray-700">№:</span>
                  <p className="text-gray-600 truncate">
                    {certificate.certificateNumber}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <CertificateModal
        certificate={certificate}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default CertificateCard;
