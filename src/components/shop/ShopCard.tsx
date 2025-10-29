import Image from "next/image";
import { Eye, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { ImageType, Product } from "@/lib/types";
import { useState } from "react";
import { getBestImageUrl, handleImageError } from "@/lib/imageUtils";
import { formatPrice } from "@/lib/formatUtils";
import Link from "next/link";
import { Avatar, AvatarFallback } from "../ui/avatar";
import ContactModal from "./ContactModal";
import { useTranslations } from "next-intl";
import { useContactSeller } from "@/hooks/useContactSeller";

interface ShopCardProps {
  item: Product;
  viewMode?: "grid" | "list";
}

const ShopCard = ({ item, viewMode = "grid" }: ShopCardProps) => {
  const t = useTranslations("ShopCard");

  const [open, setOpen] = useState(false);
  const { contactSeller } = useContactSeller();

  const handleContactSeller = async (e: React.MouseEvent) => {
    // Prevent event bubbling to parent Link
    e.stopPropagation();
    e.preventDefault();

    setOpen(true);
  };

  if (viewMode === "list") {
    // List view
    return (
      <div className="border border-border-foreground flex flex-col min-[400px]:flex-row p-2 rounded-sm">
        <Link
          href={`/marketplace/${item.id}`}
          className="relative overflow-hidden flex-shrink-0"
        >
          <Image
            src={
              getBestImageUrl(item.images?.[0] as ImageType, "small") ||
              "/no-image.png"
            }
            alt={item.title}
            width={150}
            height={150}
            onError={(e) => handleImageError(e, "/no-image.png")}
            className="w-full h-[150px] min-[400px]:w-[160px] sm:w-[200px] min-[400px]:h-full object-contain"
          />

          {/* Badge */}
          {/* <div className="absolute top-2 left-0">
          <Badge
            className={`
              text-xs font-semibold rounded-none
              ${
                item.attributesJson?.condition === "New" &&
                "bg-green-500 text-white"
              }
              ${
                item.attributesJson?.condition === "Pre-order" &&
                "bg-yellow-500 text-black"
              }
              ${
                item.attributesJson?.condition === "In Stock" &&
                "bg-blue-500 text-white"
              }
            `}
          >
            {item.attributesJson?.condition}
          </Badge>
        </div> */}
        </Link>
        <div className="flex flex-col justify-between p-3 min-[400px]:p-4 flex-1">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-base sm:text-lg font-semibold">
                {formatPrice(item.price, "$")}
              </p>
            </div>
            <p className="font-extrabold text-base sm:text-lg mb-2 truncate">
              {item.title}
            </p>
            <p className="font-light text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-3">
              {item.description}
            </p>
          </div>
          <div
            className="flex flex-col gap-3 min-[460px]:flex-row min-[400px]:items-start 
          min-[400px]:justify-between"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
                  <AvatarFallback className="bg-black text-white text-xs sm:text-sm uppercase">
                    {item?.seller?.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs sm:text-sm truncate max-w-[100px]">
                  {item?.seller?.username}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Eye size={14} className="sm:w-4 sm:h-4 text-foreground/50" />
                <p className="text-xs sm:text-sm text-foreground/50">
                  {item.viewsCount}
                </p>
              </div>
            </div>
            <Button
              className="flex items-center border border-border-foreground gap-2 rounded-sm py-2 px-3 
              sm:py-2.5 sm:px-5 hover:underline bg-transparent hover:bg-transparent 
              shadow-none text-gold-main self-start min-[400px]:self-auto"
              onClick={(e) => handleContactSeller(e)}
              disabled={false}
            >
              <MessageSquare size={14} className="sm:w-[15px] sm:h-[15px]" />
              <p className="text-xs sm:text-sm font-semibold">
                {t("titleCardSeller")}
              </p>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="border rounded-sm border-border-foreground flex flex-col">
      <Link href={`/marketplace/${item.id}`}>
        <div className="relative overflow-hidden h-[120px] xs:h-[150px] sm:h-[200px] min-h-[120px] xs:min-h-[150px] sm:min-h-[200px] max-h-[120px] xs:max-h-[150px] sm:max-h-[200px] p-2 xs:p-2.5 sm:p-3">
          <Image
            src={
              getBestImageUrl(item.images?.[0] as ImageType, "small") ||
              "/no-image.png"
            }
            alt={item.title}
            width={266}
            height={200}
            onError={(e) => handleImageError(e, "/no-image.png")}
            className="w-full h-full object-contain"
          />
          {/* Badge */}
          {/* <div className="absolute top-2 left-0">
          <Badge
            className={`
              text-xs font-semibold rounded-none
              ${
                item.attributesJson?.condition === "New" &&
                "bg-green-500 text-white"
              }
              ${
                item.attributesJson?.condition === "Pre-order" &&
                "bg-yellow-500 text-black"
              }
              ${
                item.attributesJson?.condition === "In Stock" &&
                "bg-blue-500 text-white"
              }
            `}
          >
            {item.attributesJson?.condition}
          </Badge>
        </div> */}
        </div>
      </Link>
      <div className="flex flex-col p-2 xs:p-2.5 sm:p-3.5">
        <div className="flex flex-col gap-1.5 xs:gap-2">
          <div className="flex justify-end w-full">
            <p className="text-sm xs:text-base sm:text-lg font-medium text-gold-main">
              {formatPrice(item.price, "$")}
            </p>
          </div>
          <Link
            href={`/marketplace/${item.id}`}
            className="font-medium text-sm xs:text-base sm:text-lg hover:text-gold-main transition-colors duration-300 w-full min-w-0 truncate"
          >
            {item.title}
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Link
                  href={`/company/${item.seller?.id}`}
                  className="text-xs xs:text-sm hover:underline cursor-pointer truncate"
                >
                  {item.seller?.username}
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={12} className="xs:w-4 xs:h-4 text-foreground/50" />
              <p className="text-xs xs:text-sm text-foreground/50">
                {item.viewsCount}
              </p>
            </div>
          </div>

          {/* Contact Seller */}
          <div className="mt-2 xs:mt-3 sm:mt-5 flex items-center justify-center">
            <Button
              className="rounded-none py-1.5 xs:py-2 sm:py-2.5 px-0 hover:underline text-gold-main bg-transparent hover:bg-transparent border-none shadow-none"
              onClick={(e) => handleContactSeller(e)}
              disabled={false}
            >
              {/* <MessageSquare size={15} /> */}
              <p className="font-semibold group-hover:underline text-xs xs:text-sm">
                {t("titleCardSeller")}
              </p>
            </Button>
          </div>
        </div>
        {open && (
          <ContactModal
            open={open}
            onOpenChange={setOpen}
            sellerId={item.seller?.id}
          />
        )}
      </div>
    </div>
  );
};

export default ShopCard;
