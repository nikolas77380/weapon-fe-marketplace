import Image from "next/image";
import { Heart } from "lucide-react";
import { FavouriteProduct } from "@/lib/favourites";
import { getBestImageUrl, handleImageError } from "@/lib/imageUtils";
import { formatPrice } from "@/lib/formatUtils";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface FavouriteCardProps {
  favourite: FavouriteProduct;
  viewMode?: "grid" | "list";
}

const FavouriteCard = ({
  favourite,
  viewMode = "grid",
}: FavouriteCardProps) => {
  const t = useTranslations("BuyerAccountTabs.tabFavourites");

  const product = favourite.product;

  if (viewMode === "list") {
    // List view
    return (
      <div className="flex flex-row border border-border-foreground rounded-sm">
        <div className="relative overflow-hidden px-4 py-4">
          <Image
            src={
              typeof product.images?.[0] === "string"
                ? product.images[0]
                : getBestImageUrl(product.images?.[0], "small") || "/shop/1.jpg"
            }
            alt={product.title}
            width={200}
            height={150}
            onError={(e) => handleImageError(e, "/shop/1.jpg")}
            className="w-[200px] h-[150px] object-contain"
          />
          {/* Favourite indicator */}
          <div className="absolute top-2 right-2">
            <div className="bg-red-500 p-1.5 rounded-full">
              <Heart size={12} className="text-white fill-white" />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between p-4 flex-1">
          <div>
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-extrabold text-sm md:text-base lg:text-lg lg:leading-tight flex-1 lg:mr-4">
                {product.title}
              </h3>
              <p className="hidden min-[400px]:block text-sm md:text-base lg:text-lg font-semibold text-gold-main flex-shrink-0 ">
                {formatPrice(product.price)}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 lg:flex-row items-start lg:items-center lg:justify-between">
            <div className="flex items-center justify-between gap-4 w-full lg:w-auto">
              <div className="hidden min-[400px]:block bg-green-500 py-1 px-2 rounded-sm">
                <p className="text-xs lg:text-sm text-white font-semibold">{product.status}</p>
              </div>
              <div>
                <p className="hidden min-[400px]:block text-xs lg:text-sm font-bold text-muted-foreground">
                  Added: {new Date(favourite.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Link
              href={`/marketplace/${product.id}`}
              className="py-2 px-4 bg-gold-main text-white hover:bg-gold-main/90 duration-300 
              transition-all text-xs lg:text-sm rounded-sm"
            >
              View Details →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="border border-primary-foreground flex flex-col h-full rounded-sm">
      <div className="relative overflow-hidden flex-shrink-0">
        <Image
          src={
            typeof product.images?.[0] === "string"
              ? product.images[0]
              : getBestImageUrl(product.images?.[0], "small") || "/shop/1.jpg"
          }
          alt={product.title}
          width={300}
          height={200}
          onError={(e) => handleImageError(e, "/shop/1.jpg")}
          className="w-full h-[125px] object-contain p-2"
        />
        {/* Favourite indicator */}
        <div className="absolute top-2 right-2">
          <div className="bg-red-500 p-1.5 rounded-full shadow-lg">
            <Heart size={12} className="text-white fill-white" />
          </div>
        </div>
      </div>

      <div className="flex flex-col p-3 flex-1 justify-between min-h-0">
        {/* Header with price */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-extrabold text-sm leading-tight flex-1 mr-2 line-clamp-2">
            {product.title}
          </h3>
          <p className="text-sm font-semibold text-gold-main flex-shrink-0">
            {formatPrice(product.price)}
          </p>
        </div>

        {/* Seller info */}
        <div className="mb-3">
          {product.seller?.companyName && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-muted-foreground">Seller:</span>
              <span className="font-bold truncate">
                {product.seller.companyName}
              </span>
            </div>
          )}
        </div>

        {/* Status and date */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="rounded-sm bg-green-500 py-0.5 px-2 flex-shrink-0">
            <p className="text-xs text-white font-semibold">{product.status}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-muted-foreground">
              {new Date(favourite.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Action button */}
        <Link
          href={`/marketplace/${product.id}`}
          className="py-2 px-4 w-full text-center text-sm rounded-md bg-gold-main text-white hover:bg-gold-main/90 duration-300 transition-all flex-shrink-0"
        >
          {t("titleViewDetails")}
        </Link>
      </div>
    </div>
  );
};

export default FavouriteCard;
