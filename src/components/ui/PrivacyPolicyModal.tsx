"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { useTranslations } from "next-intl";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const t = useTranslations("PrivacyPolicy");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] mx-4 sm:mx-0 p-0 rounded-lg overflow-hidden border-none backdrop-blur-xs">
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-gold-main">
            {t("title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 text-xs sm:text-sm leading-relaxed p-4 sm:p-6 pt-2 sm:pt-4 overflow-y-auto max-h-[calc(90vh-100px)] sm:max-h-[calc(90vh-120px)]">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
              {t("section1.title")}
            </h2>
            <p className="text-gray-700 mb-3 sm:mb-4">
              {t("section1.content")}
            </p>
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
              {t("section2.title")}
            </h2>
            <p className="text-gray-700 mb-3 sm:mb-4">
              {t("section2.content")}
            </p>
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
              {t("section3.title")}
            </h2>
            <p className="text-gray-700 mb-3 sm:mb-4">
              {t("section3.content")}
            </p>
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
              {t("section4.title")}
            </h2>
            <p className="text-gray-700 mb-3 sm:mb-4">
              {t("section4.content")}
            </p>
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
              {t("section5.title")}
            </h2>
            <p className="text-gray-700 mb-3 sm:mb-4">
              {t("section5.content")}
            </p>
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
              {t("section6.title")}
            </h2>
            <p className="text-gray-700 mb-3 sm:mb-4">
              {t("section6.content")}
            </p>
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
              {t("section7.title")}
            </h2>
            <p className="text-gray-700 mb-3 sm:mb-4">
              {t("section7.content")}
            </p>
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
              {t("section8.title")}
            </h2>
            <p className="text-gray-700 mb-3 sm:mb-4">
              {t("section8.content")}
            </p>
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
              {t("section9.title")}
            </h2>
            <p className="text-gray-700 mb-3 sm:mb-4">
              {t("section9.content")}
            </p>
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
              {t("section10.title")}
            </h2>
            <p className="text-gray-700 mb-3 sm:mb-4">
              {t("section10.content")}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicyModal;
