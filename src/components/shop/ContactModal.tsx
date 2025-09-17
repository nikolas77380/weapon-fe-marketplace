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
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription className="flex flex-col gap-2 mt-2">
            <p>
              <b>{t('titleCompanyName')} </b> {sellerData?.companyName}
            </p>
            <p>
              <b>{t('titlePhoneNumbers')} </b> {sellerData?.phoneNumbers}
            </p>
            <p>
              <b>{t('titleWebSite')} </b> {sellerData?.webSite}
            </p>
            <p>
              <b>{t('titleCountry')} </b> {sellerData?.country}
            </p>
            <p>
              <b>{t('titleAddress')} </b> {sellerData?.address}
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="py-2.5 px-6"
          >
            {t('buttonClose')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
