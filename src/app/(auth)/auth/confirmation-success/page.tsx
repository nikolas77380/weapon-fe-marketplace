"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const ConfirmationSuccessPage = () => {
  const router = useRouter();
  const t = useTranslations("ConfirmationSuccess");

  const handleGoToLogin = () => {
    router.push("/auth?mode=login");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/10 px-4 py-8">
      <div className="max-w-md w-full">
        {/* Success Card */}
        <div className="bg-background border border-border-foreground rounded-lg shadow-lg p-6 sm:p-8 md:p-10 space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gold-main/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-gold-main/10 rounded-full p-4">
                <CheckCircle2 className="w-16 h-16 sm:w-20 sm:h-20 text-gold-main" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {t("title")}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>

          {/* Description */}
          <div className="space-y-4 text-center">
            <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
              {t("description")}
            </p>
            <p className="text-sm text-muted-foreground">{t("loginPrompt")}</p>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-foreground"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t("dividerText")}
              </span>
            </div>
          </div>

          {/* Login Button */}
          <Button
            onClick={handleGoToLogin}
            className="w-full bg-gold-main hover:bg-gold-main/90 text-white font-medium py-6 text-base sm:text-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {t("buttonLogin")}
          </Button>

          {/* Additional Info */}
          <p className="text-xs text-center text-muted-foreground">
            {t("welcomeMessage")}
          </p>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">{t("footerNote")}</p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationSuccessPage;
