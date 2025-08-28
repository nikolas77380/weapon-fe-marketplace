"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "@/lib/types";
import AddProductForms from "./AddProductForms";
import MetadataRequiredDialog from "./MetadataRequiredDialog";

const AddProductPageComponent = ({
  currentUser,
}: {
  currentUser: UserProfile;
}) => {
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
    <>
      <MetadataRequiredDialog open={showDialog} onOpenChange={setShowDialog} />
      <div className="text-center py-12 text-gray-500">
        Please complete your company details to add products.
      </div>
    </>
  );
};

export default AddProductPageComponent;
