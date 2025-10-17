"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SellerMeta } from "@/lib/types";
import { useTranslations } from "next-intl";

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-col gap-2 mt-2">
              <div>
                <b>{t("titleCompanyName")} </b> {sellerData?.companyName}
              </div>
              <div>
                <b>{t("titlePhoneNumbers")} </b> {sellerData?.phoneNumbers}
              </div>
              <div>
                <b>{t("titleWebSite")} </b> {sellerData?.webSite}
              </div>
              <div>
                <b>{t("titleCountry")} </b> {sellerData?.country}
              </div>
              <div>
                <b>{t("titleAddress")} </b> {sellerData?.address}
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="py-2.5 px-6"
          >
            {t("buttonClose")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
