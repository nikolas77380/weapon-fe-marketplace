import React, { useState } from "react";
import Link from "next/link";
import Logo from "../ui/Logo";
import { useTranslations } from "next-intl";
import PrivacyPolicyModal from "../ui/PrivacyPolicyModal";
import ContactCompanyModal from "./footer-pages/ContactCompanyModal";
import { Phone } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  const t = useTranslations("Footer");
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handlePrivacyClick = () => {
    setIsPrivacyModalOpen(true);
  };

  const handleClosePrivacyModal = () => {
    setIsPrivacyModalOpen(false);
  };

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  const handleCloseContactModal = () => {
    setIsContactModalOpen(false);
  };

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
            <Link
              href="/account"
              className="hover:text-gold-main transition-colors duration-300"
            >
              <li className="text-xs sm:text-sm mb-1">
                {t("subtitleGeneral2")}
              </li>
            </Link>
            <li
              className="text-xs sm:text-sm mb-1 cursor-pointer hover:text-gold-main transition-colors duration-300"
              onClick={handlePrivacyClick}
            >
              {t("subtitleGeneral3")}
            </li>
            <li
              className="text-xs sm:text-sm cursor-pointer hover:text-gold-main transition-colors duration-300"
              onClick={handleContactClick}
            >
              {t("subtitleGeneral4")}
            </li>
          </ul>

          {/* Contact Us Information */}
          <ul className="text-center sm:text-left">
            <h1 className="font-medium text-lg sm:text-xl mb-2 sm:mb-3.5">
              {t("mainTitle2")}
            </h1>

            {/* Phone Number */}
            <li className="mb-3 sm:mb-4">
              <a
                href="tel:+380507697777"
                className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm hover:text-gold-main transition-colors duration-300"
              >
                <Phone className="w-4 h-4" />
                <span>+380 50 769 77 77</span>
              </a>
            </li>

            {/* Social Media Icons */}
            <li className="flex items-center justify-center sm:justify-start gap-3">
              <a
                href="viber://chat?number=+380507697777"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transform duration-300 transition-all"
                title="Viber"
              >
                <Image
                  src={"/social/viber.png"}
                  alt="signal"
                  width={26}
                  height={26}
                />
              </a>
              <a
                href="https://wa.me/+380507697777"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transform duration-300 transition-all"
                title="WhatsApp"
              >
                <Image
                  src={"/social/whatsapp.png"}
                  alt="signal"
                  width={30}
                  height={30}
                />
              </a>
              <a
                href="https://t.me/+380507697777"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transform duration-300 transition-all"
                title="Telegram"
              >
                <Image
                  src={"/social/telegram.png"}
                  alt="signal"
                  width={26}
                  height={26}
                />
              </a>
              <a
                href="https://signal.me/#p/+380507697777"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transform duration-300 transition-all"
                title="Signal"
              >
                <Image
                  src={"/social/signal.png"}
                  alt="signal"
                  width={30}
                  height={30}
                />
              </a>
            </li>
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

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={handleClosePrivacyModal}
      />

      {/* Contact Modal */}
      <ContactCompanyModal
        isOpen={isContactModalOpen}
        onClose={handleCloseContactModal}
      />
    </div>
  );
};

export default Footer;
