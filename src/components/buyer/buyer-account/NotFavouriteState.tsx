"use client";

import { useTranslations } from "next-intl";
import React from "react";

const NotFavouriteState = () => {
  const t = useTranslations("NotFavourite");
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-12">
      <div className="text-6xl mb-4">💔</div>
      <p className="font-medium font-roboto text-lg text-gray-500">
        {t("titleNotFavourite")}
      </p>
      <p className="font-light font-roboto text-sm text-gray-400 mt-2">
        {t("descriptionNotFavourite")}
      </p>
    </div>
  );
};

export default NotFavouriteState;
