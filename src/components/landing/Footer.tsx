import React from "react";
import { Separator } from "../ui/separator";
import Link from "next/link";
import Logo from "../ui/Logo";
import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations("Footer");
  return (
    <div className="py-4 sm:py-6 lg:py-7 bg-sidebar-accent">
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 flex flex-col items-center">
        <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-6 sm:gap-8 lg:gap-0">
          <ul className="text-center sm:text-left">
            <li className="font-bold text-xl sm:text-2xl mb-3 sm:mb-5 flex justify-center sm:justify-start">
              <Logo />
            </li>
            <li className="font-light text-sm sm:text-base w-full max-w-full sm:max-w-52">
              {t("description")}
            </li>
          </ul>

          <ul className="text-center sm:text-left">
            <h1 className="font-medium text-lg sm:text-xl mb-2 sm:mb-3.5">
              {t("mainTitle")}
            </h1>
            <Link
              href="/faq"
              className="hover:text-gold-main transition-colors duration-300"
            >
              <li className="mb-1 text-xs sm:text-sm">
                {t("subtitleGeneral")}
              </li>
            </Link>
            <li className="text-xs sm:text-sm mb-1">{t("subtitleGeneral2")}</li>
            <li className="text-xs sm:text-sm mb-1">{t("subtitleGeneral3")}</li>
            <li className="text-xs sm:text-sm">{t("subtitleGeneral4")}</li>
          </ul>

          <ul className="text-center sm:text-left">
            <h1 className="font-medium text-lg sm:text-xl mb-2 sm:mb-3.5">
              {t("mainTitle2")}
            </h1>
            <Link
              href="/contact"
              className="hover:text-gold-main transition-colors duration-300"
            >
              <li className="mb-1 text-xs sm:text-sm">
                {t("subtitleContact")}
              </li>
            </Link>
            <li className="text-xs sm:text-sm mb-1">{t("subtitleContact2")}</li>
            <li className="text-xs sm:text-sm">{t("subtitleContact3")}</li>
          </ul>
        </div>

        {/* <div>
          <Separator
            orientation="horizontal"
            className="w-full mt-8 sm:mt-12 lg:mt-20 bg-gray-primary"
          />
        </div> */}

        <div className="mt-5 md:mt-10 text-center">
          <h2 className="font-light text-xs sm:text-sm lg:text-base">
            <span className="font-medium text-sm">
              © {new Date().getFullYear()} Esviem Defence.
            </span>{" "}
            {t("titleRightsReserved")}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Footer;
