import React from "react";
import { Separator } from "../ui/separator";
import Link from "next/link";
import Logo from "../ui/Logo";
import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations('Footer');
  return (
    <div className="py-7 bg-sidebar-accent">
      <div className="container mx-auto flex flex-col items-center">
        <div className="flex justify-between w-full">
          <ul>
            <li className="font-bold text-2xl mb-5">
              <Logo />
            </li>
            <li className="font-light w-full max-w-52">
              {t('description')}
            </li>
          </ul>

          <ul>
            <h1 className="font-medium text-xl mb-3.5">{t('mainTitle')}</h1>
            <Link
              href="/faq"
              className=" hover:text-gold-main transition-colors
              duration-300"
            >
              <li className="mb-1 text-sm">{t('subtitleGeneral')}</li>
            </Link>
            <li className="text-sm mb-1">{t('subtitleGeneral2')}</li>
            <li className="text-sm mb-1">{t('subtitleGeneral3')}</li>
            <li className="text-sm">{t('subtitleGeneral4')}</li>
          </ul>

          <ul>
            <h1 className="font-medium text-xl mb-3.5">{t('mainTitle2')}</h1>
            <Link
              href="/contact"
              className=" hover:text-gold-main transition-colors
            duration-300"
            >
              <li className="mb-1 text-sm">{t('subtitleContact')}</li>
            </Link>
            <li className="text-sm mb-1">{t('subtitleContact2')}</li>
            <li className="text-sm">{t('subtitleContact3')}</li>
          </ul>
        </div>

        <div>
          <Separator
            orientation="horizontal"
            className="w-full mt-20 bg-gray-primary"
          />
        </div>

        <div className="my-6">
          <h2 className="font-light text-2xl">
            © 2025 Esviem Defence. {t('titleRightsReserved')}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Footer;
