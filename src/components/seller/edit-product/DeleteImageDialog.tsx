"use client"

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl";
import { useProductActions } from "@/hooks/useProductsQuery";

interface DeleteImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteImageDialog: React.FC<DeleteImageDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const t = useTranslations("EditProduct.deleteModal");
  const { loading } = useProductActions();

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("dialogTitleDeleteImage")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("dialogDescriptionDeleteImage")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} className="p-2">
            {t("buttonCancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 p-2"
          >
            {loading ? t("buttonDeleting") : t("buttonDelete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteImageDialog;