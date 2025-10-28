"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "@/lib/types";
import AddProductForms from "./AddProductForms";
import MetadataRequiredDialog from "./MetadataRequiredDialog";
import { useTranslations } from "next-intl";

const AddProductPageComponent = ({
  currentUser,
}: {
  currentUser: UserProfile;
}) => {
  const t = useTranslations('AddProduct');

  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (!currentUser.metadata) {
      setShowDialog(true);
    }
  }, [currentUser.metadata]);

  if (currentUser.metadata) {
    return <AddProductForms />;
  }

  return (
    <div className="w-full">
      <MetadataRequiredDialog open={showDialog} onOpenChange={setShowDialog} />
      <div className="text-center py-12 text-gray-500">
        {t('errorAddProduct')}
      </div>
    </div>
  );
};

export default AddProductPageComponent;
