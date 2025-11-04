"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { Building2, Phone, Globe, MapPin, Flag, Loader2 } from "lucide-react";
import { useSellerMetaBySeller } from "@/hooks/useSellerMeta";
import { useContactSeller } from "@/hooks/useContactSeller";
import { useAuthContext } from "@/context/AuthContext";
import LoadingState from "../ui/LoadingState";
import { COUNTRIES } from "@/lib/utils";

interface MetadataRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sellerId: number;
  productId?: number;
  productTitle?: string;
}

const ContactModal = ({
  open,
  onOpenChange,
  sellerId,
  productId,
  productTitle,
}: MetadataRequiredDialogProps) => {
  const t = useTranslations("ShopCard.contactModal");
  const { currentUser } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const { sellerMeta, loading: isSellerMetaLoading } = useSellerMetaBySeller(
    sellerId,
    open
  );
  const locale = useLocale();
  const { contactSeller } = useContactSeller();

  const handleContactSeller = async () => {
    if (sellerId) {
      setLoading(true);
      try {
        await contactSeller(sellerId, {
          productId,
          productTitle,
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to contact seller:", error);
        setLoading(false);
      }
    }
  };
  console.log(sellerMeta);
  return (
    <div className="px-2 w-full">
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="rounded-lg border-none !max-w-sm md:!max-w-lg overflow-hidden p-0">
          {isSellerMetaLoading ? (
            <LoadingState title={t("loadingSellerMeta")} />
          ) : (
            <>
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
                  {sellerMeta?.companyName && (
                    <div className="flex items-start gap-3 p-2 xs:p-3 bg-gray-50 rounded-lg">
                      <Building2 className="w-4 h-4 text-gold-main mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-600 mb-1">
                          {t("titleCompanyName")}
                        </p>
                        <p className="text-sm font-semibold text-gray-800 break-words">
                          {sellerMeta.companyName}{" "}
                          {sellerMeta?.businessId &&
                            `(${sellerMeta?.businessId})`}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Phone Numbers */}
                  {sellerMeta?.phoneNumbers && (
                    <div className="flex items-start gap-3 p-2 xs:p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-4 h-4 text-gold-main mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-600 mb-1">
                          {t("titlePhoneNumbers")}
                        </p>
                        <a
                          href={`tel:${sellerMeta.phoneNumbers.replace(
                            /\s/g,
                            ""
                          )}`}
                          className="text-sm font-semibold text-gold-main hover:text-gold-main/80 break-words underline"
                        >
                          {sellerMeta.phoneNumbers}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Website */}
                  {sellerMeta?.webSite && (
                    <div className="flex items-start gap-3 p-2 xs:p-3 bg-gray-50 rounded-lg">
                      <Globe className="w-4 h-4 text-gold-main mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-600 mb-1">
                          {t("titleWebSite")}
                        </p>
                        <a
                          href={
                            sellerMeta.webSite.startsWith("http")
                              ? sellerMeta.webSite
                              : `https://${sellerMeta.webSite}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-gold-main hover:text-gold-main/80 break-words underline"
                        >
                          {sellerMeta.webSite}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Country */}
                  {sellerMeta?.country && (
                    <div className="flex items-start gap-3 p-2 xs:p-3 bg-gray-50 rounded-lg">
                      <Flag className="w-4 h-4 text-gold-main mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-600 mb-1">
                          {t("titleCountry")}
                        </p>
                        <p className="text-sm font-semibold text-gray-800 break-words">
                          {COUNTRIES.find(
                            (country) => country.iso2 === sellerMeta.country
                          )?.name
                            ? locale === "ua"
                              ? COUNTRIES.find(
                                  (country) =>
                                    country.iso2 === sellerMeta.country
                                )?.ua
                              : COUNTRIES.find(
                                  (country) =>
                                    country.iso2 === sellerMeta.country
                                )?.name
                            : locale === "ua"
                            ? COUNTRIES.find(
                                (country) => country.name === sellerMeta.country
                              )?.ua
                            : COUNTRIES.find(
                                (country) => country.name === sellerMeta.country
                              )?.name}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Address */}
                  {sellerMeta?.address && (
                    <div className="flex items-start gap-3 p-2 xs:p-3 bg-gray-50 rounded-lg">
                      <MapPin className="w-4 h-4 text-gold-main mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-600 mb-1">
                          {t("titleAddress")}
                        </p>
                        <p className="text-sm font-semibold text-gray-800 break-words">
                          {sellerMeta.address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-3 xs:p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex flex-col gap-2">
                {currentUser && (
                  <Button
                    onClick={handleContactSeller}
                    className="w-full bg-gold-main mt-2 hover:bg-gold-main/90 text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-300"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      t("buttonContactSeller")
                    )}
                  </Button>
                )}
                <Button
                  onClick={() => onOpenChange(false)}
                  className="w-full bg-gold-main hover:bg-gold-main/90 text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-300"
                  disabled={loading}
                >
                  {t("buttonClose")}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactModal;
