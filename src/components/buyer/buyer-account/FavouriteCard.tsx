import Image from "next/image";
import { Heart } from "lucide-react";
import { FavouriteProduct } from "@/lib/favourites";
import { getBestImageUrl, handleImageError } from "@/lib/imageUtils";
import { getDisplayPrice } from "@/lib/formatUtils";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useCurrency } from "@/hooks/useCurrency";
import { useFavourites } from "@/hooks/useFavourites";
import { useState } from "react";

interface FavouriteCardProps {
  favourite: FavouriteProduct;
  viewMode?: "grid" | "list";
  onRemove?: () => void;
}

const FavouriteCard = ({
  favourite,
  viewMode = "grid",
  onRemove,
}: FavouriteCardProps) => {
  const t = useTranslations("BuyerAccountTabs.tabFavourites");
  const tStatus = useTranslations("AddProduct.addProductForm.productStatus");
  const { selectedCurrency } = useCurrency();
  const { removeFromFavourites } = useFavourites();
  const [isRemoving, setIsRemoving] = useState(false);

  const product = favourite.product;

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isRemoving) return;

    setIsRemoving(true);
    const success = await removeFromFavourites(favourite.id, product.id);

    if (success && onRemove) {
      onRemove();
    }

    setIsRemoving(false);
  };

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
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              className="bg-red-500 p-1.5 rounded-full hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Remove from favourites"
            >
              <Heart size={12} className="text-white fill-white" />
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-between p-4 flex-1">
          <div>
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-extrabold text-sm md:text-base lg:text-lg lg:leading-tight flex-1 lg:mr-4">
                {product.title}
              </h3>
              <p className="hidden min-[400px]:block text-sm md:text-base lg:text-lg font-semibold text-gold-main flex-shrink-0 ">
                {getDisplayPrice(product, selectedCurrency)}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 lg:flex-row items-start lg:items-center lg:justify-between">
            <div className="flex items-center justify-between gap-4 w-full lg:w-auto">
              <div className="hidden min-[400px]:block bg-green-500 py-1 px-2 rounded-sm">
                <p className="text-xs lg:text-sm text-white font-semibold">
                  {product.status == "available"
                    ? tStatus("available")
                    : tStatus("unavailable")}
                </p>
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
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="bg-red-500 p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Remove from favourites"
          >
            <Heart size={12} className="text-white fill-white" />
          </button>
        </div>
      </div>

      <div className="flex flex-col p-3 flex-1 justify-between min-h-0">
        {/* Header with price */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-extrabold text-sm leading-tight flex-1 mr-2 line-clamp-2">
            {product.title}
          </h3>
          <p className="text-sm font-semibold text-gold-main flex-shrink-0">
            {getDisplayPrice(product, selectedCurrency)}
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
            <p className="text-xs text-white font-semibold">
              {product.status == "available"
                ? tStatus("available")
                : tStatus("unavailable")}
            </p>
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
