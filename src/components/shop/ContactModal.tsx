"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SellerMeta } from "@/lib/types";
import { useTranslations } from "next-intl";
import { Building2, Phone, Globe, MapPin, Flag } from "lucide-react";

interface MetadataRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sellerData: SellerMeta;
}

const ContactModal = ({
  open,
  onOpenChange,
  sellerData,
}: MetadataRequiredDialogProps) => {
  const t = useTranslations("ShopCard.contactModal");

  return (
    <div className="px-2 w-full">
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="rounded-lg border-none !max-w-sm md:!max-w-lg overflow-hidden p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-gold-main/10 to-gold-main/5 p-3 xs:p-4 sm:p-6 border-b border-gold-main/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gold-main/20 rounded-lg">
                <Building2 className="w-5 h-5 text-gold-main" />
              </div>
              <div>
                <DialogTitle className="text-lg sm:text-xl font-bold text-gray-800">
                  {t("title")}
                </DialogTitle>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  {t("description")}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 xs:p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
            <div className="space-y-4">
              {/* Company Name */}
              {sellerData?.companyName && (
                <div className="flex items-start gap-3 p-2 xs:p-3 bg-gray-50 rounded-lg">
                  <Building2 className="w-4 h-4 text-gold-main mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      {t("titleCompanyName")}
                    </p>
                    <p className="text-sm font-semibold text-gray-800 break-words">
                      {sellerData.companyName}
                    </p>
                  </div>
                </div>
              )}

              {/* Phone Numbers */}
              {sellerData?.phoneNumbers && (
                <div className="flex items-start gap-3 p-2 xs:p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-4 h-4 text-gold-main mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      {t("titlePhoneNumbers")}
                    </p>
                    <a
                      href={`tel:${sellerData.phoneNumbers.replace(/\s/g, "")}`}
                      className="text-sm font-semibold text-gold-main hover:text-gold-main/80 break-words underline"
                    >
                      {sellerData.phoneNumbers}
                    </a>
                  </div>
                </div>
              )}

              {/* Website */}
              {sellerData?.webSite && (
                <div className="flex items-start gap-3 p-2 xs:p-3 bg-gray-50 rounded-lg">
                  <Globe className="w-4 h-4 text-gold-main mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      {t("titleWebSite")}
                    </p>
                    <a
                      href={
                        sellerData.webSite.startsWith("http")
                          ? sellerData.webSite
                          : `https://${sellerData.webSite}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-gold-main hover:text-gold-main/80 break-words underline"
                    >
                      {sellerData.webSite}
                    </a>
                  </div>
                </div>
              )}

              {/* Country */}
              {sellerData?.country && (
                <div className="flex items-start gap-3 p-2 xs:p-3 bg-gray-50 rounded-lg">
                  <Flag className="w-4 h-4 text-gold-main mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      {t("titleCountry")}
                    </p>
                    <p className="text-sm font-semibold text-gray-800 break-words">
                      {sellerData.country}
                    </p>
                  </div>
                </div>
              )}

              {/* Address */}
              {sellerData?.address && (
                <div className="flex items-start gap-3 p-2 xs:p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-gold-main mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      {t("titleAddress")}
                    </p>
                    <p className="text-sm font-semibold text-gray-800 break-words">
                      {sellerData.address}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 xs:p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full bg-gold-main hover:bg-gold-main/90 text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-300"
            >
              {t("buttonClose")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactModal;
