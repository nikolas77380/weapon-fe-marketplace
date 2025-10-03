"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Certificate } from "@/hooks/useCertificates";
import { Download, FileText, ZoomIn, ZoomOut, SearchX } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface CertificateModalProps {
  certificate: Certificate | null;
  isOpen: boolean;
  onClose: () => void;
}

const CertificateModal = ({
  certificate,
  isOpen,
  onClose,
}: CertificateModalProps) => {
  const t = useTranslations("CertificateModal");
  const [zoomLevel, setZoomLevel] = useState(100); // Zoom level in percentage
  const minZoom = 25;
  const maxZoom = 300;
  const zoomStep = 25;

  if (!certificate) return null;

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

  const handleDownload = () => {
    if (certificate.certificateFile) {
      const link = document.createElement("a");
      link.href = certificate.certificateFile.url;
      link.download = certificate.certificateFile.name || "certificate";
      link.click();
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + zoomStep, maxZoom));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - zoomStep, minZoom));
  };

  const handleZoomReset = () => {
    setZoomLevel(100);
  };

  const renderFilePreview = () => {
    if (!certificate.certificateFile) {
      return (
        <div className="w-full h-32 min-[300px]:h-40 sm:h-48 md:h-64 lg:h-80 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-400">
            <FileText size={48} className="mx-auto mb-2" />
            <p className="text-sm">{t("noFileAttached")}</p>
          </div>
        </div>
      );
    }

    const { mime, url, name } = certificate.certificateFile;

    if (mime?.startsWith("image/")) {
      return (
        <div className="relative w-full h-32 min-[300px]:h-40 sm:h-48 md:h-64 lg:h-80 bg-gray-50 rounded-lg overflow-auto">
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-in-out"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            <Image
              src={url}
              alt={certificate.title}
              fill
              className="object-contain p-2"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, 80vw"
            />
          </div>
        </div>
      );
    }

    if (mime === "application/pdf") {
      return (
        <div className="w-full h-32 min-[300px]:h-40 sm:h-48 md:h-64 lg:h-80 bg-gray-50 rounded-lg overflow-auto">
          <div
            className="w-full h-full transition-transform duration-300 ease-in-out"
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: "center",
            }}
          >
            <iframe
              src={url}
              className="w-full h-full border-0"
              title={`PDF preview: ${name}`}
            />
          </div>
        </div>
      );
    }

    // For other file types
    return (
      <div className="w-full h-32 min-[300px]:h-40 sm:h-48 md:h-64 lg:h-80 bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-400">
          <FileText size={48} className="mx-auto mb-2" />
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-gray-500">{mime}</p>
        </div>
      </div>
    );
  };

  const handleModalClose = () => {
    setZoomLevel(100); // Reset zoom when closing modal
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-[98vw] min-[300px]:max-w-[95vw] sm:max-w-2xl lg:max-w-4xl max-h-[95vh] overflow-y-auto p-2 min-[300px]:p-3 sm:p-6 [&>button]:cursor-pointer [&>button]:lg:w-6 [&>button]:lg:h-6 [&>button>svg]:lg:w-5 [&>button>svg]:lg:h-5">
        <DialogHeader className="space-y-2 sm:space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 pr-6 sm:pr-8">
            <DialogTitle className="text-lg sm:text-xl lg:text-2xl leading-tight">
              {certificate.title}
            </DialogTitle>
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Zoom Controls - only show if there's a file */}
              {certificate.certificateFile &&
                (certificate.certificateFile.mime?.startsWith("image/") ||
                  certificate.certificateFile.mime === "application/pdf") && (
                  <div className="flex items-center gap-0.5 sm:gap-1 mr-1 sm:mr-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleZoomIn}
                      disabled={zoomLevel >= maxZoom}
                      className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-gray-100 focus:outline-none focus:ring-0 focus-visible:ring-0"
                      title="Zoom In"
                    >
                      <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleZoomOut}
                      disabled={zoomLevel <= minZoom}
                      className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-gray-100 focus:outline-none focus:ring-0 focus-visible:ring-0"
                      title="Zoom Out"
                    >
                      <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleZoomReset}
                      disabled={zoomLevel === 100}
                      className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-gray-100 focus:outline-none focus:ring-0 focus-visible:ring-0"
                      title="Reset Zoom"
                    >
                      <SearchX className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <span className="text-xs text-gray-500 ml-0.5 sm:ml-1 min-w-[2rem] sm:min-w-[3rem] select-none">
                      {zoomLevel}%
                    </span>
                  </div>
                )}
              <Badge
                className={`${getStatusColor(
                  certificate.status
                )} text-xs sm:text-sm flex-shrink-0 self-start mt-2 sm:mt-0`}
              >
                {certificate.status}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* File Preview */}
          {renderFilePreview()}

          {/* Certificate Details */}
          <div className="space-y-3 sm:space-y-4">
            {certificate.description && (
              <div>
                <h4 className="font-semibold text-sm sm:text-base mb-2">
                  {t("description")}
                </h4>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {certificate.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <h4 className="font-semibold text-sm mb-1">{t("issuedBy")}</h4>
                <p className="text-sm text-gray-600">{certificate.issuedBy}</p>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-1">{t("issueDate")}</h4>
                <p className="text-sm text-gray-600">
                  {formatDate(certificate.issuedDate)}
                </p>
              </div>

              {certificate.expiryDate && (
                <div>
                  <h4 className="font-semibold text-sm mb-1">
                    {t("expiryDate")}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {formatDate(certificate.expiryDate)}
                  </p>
                </div>
              )}

              {certificate.certificateNumber && (
                <div>
                  <h4 className="font-semibold text-sm mb-1">
                    {t("certificateNumber")}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {certificate.certificateNumber}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Download Button */}
          {certificate.certificateFile && (
            <div className="flex justify-center pt-2">
              <Button
                onClick={handleDownload}
                className="w-full sm:w-auto px-3 md:px-6 py-1.5 md:py-2 text-sm md:text-base rounded-none"
                variant="outline"
              >
                <Download className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                <span className="hidden min-[400px]:inline">
                  {t("download")}{" "}
                </span>
                {t("certificate")}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateModal;
