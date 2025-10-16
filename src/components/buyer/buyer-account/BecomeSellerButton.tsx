"use client";

import { Button } from "@/components/ui/button";
import { useUserRoleManagement } from "@/hooks/useChangeUserRole";
import { useTranslations } from "next-intl";
import { UserProfile } from "@/lib/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BecomeSellerButtonProps {
  currentUser: UserProfile;
  className?: string;
}

const BecomeSellerButton = ({
  currentUser,
  className,
}: BecomeSellerButtonProps) => {
  const t = useTranslations("BuyerAccountHeader");
  const { changeUserRole, isLoading } = useUserRoleManagement();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleBecomeSeller = async () => {
    if (!currentUser?.id) {
      console.error("User ID not found");
      return;
    }

    try {
      setIsProcessing(true);
      await changeUserRole(currentUser.id, "seller");

      // Show success toast
      toast.success(t("successMessage"));

      // Redirect to seller account after successful role change
      router.push("/account");
    } catch (error) {
      console.error("Failed to change user role:", error);
      toast.error(t("errorMessage"));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={className}>
      <p className="text-sm text-gold-main mb-4 text-center">
        {t("becomeSellerText")}
      </p>
      <div className="w-full flex justify-center">
        <Button
          onClick={handleBecomeSeller}
          disabled={isLoading || isProcessing}
          className="px-2.5 py-2 w-fit bg-gold-main hover:bg-gold-main/80 text-white disabled:opacity-50"
        >
          {isLoading || isProcessing
            ? t("processing")
            : t("becomeSellerButton")}
        </Button>
      </div>
    </div>
  );
};

export default BecomeSellerButton;
