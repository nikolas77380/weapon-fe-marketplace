"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface MetadataRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MetadataRequiredDialog = ({
  open,
  onOpenChange,
}: MetadataRequiredDialogProps) => {
  const t = useTranslations("AddProduct.metadataRequiredDialog");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("dialogTitle")}</DialogTitle>
          <DialogDescription>{t("dialogDescription")}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-3 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="py-2.5 px-6 border-red-100 hover:bg-red-100"
          >
            {t("buttonCancel")}
          </Button>
          <Link href="/account/settings">
            <Button className="py-2.5 px-6 bg-gold-main hover:bg-gold-main/80 text-white">
              {t("buttonComplete")}
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MetadataRequiredDialog;
