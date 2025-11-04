import { UserProfile } from "@/lib/types";
import { useTranslations } from "next-intl";

interface BusinessInfoProps {
  sellerData: UserProfile;
}

const BusinessInfo = ({ sellerData }: BusinessInfoProps) => {
  const t = useTranslations("CompanyDetail.tabBusinessInfo");

  return (
    <div className="mt-4">
      <div>
        {sellerData?.metadata?.businessId && (
          <p className="flex items-center gap-2">
            <span className="font-bold">{t("titleBusinessId")}</span>
            <span className="text-gray-700 font-light">
              {sellerData?.metadata?.businessId}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default BusinessInfo;
