import Image from "next/image";
import { Badge } from "../../ui/badge";
import { Heart } from "lucide-react";
import { FavouriteProduct } from "@/lib/favourites";
import { getBestImageUrl, handleImageError } from "@/lib/imageUtils";
import { formatPrice } from "@/lib/formatUtils";
import Link from "next/link";

interface FavouriteCardProps {
  favourite: FavouriteProduct;
  viewMode?: "grid" | "list";
}

const FavouriteCard = ({
  favourite,
  viewMode = "grid",
}: FavouriteCardProps) => {
  const product = favourite.product;

  if (viewMode === "list") {
    // List view
    return (
      <div className="bg-[#E7E7E7] flex flex-row">
        <div className="relative overflow-hidden">
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
            className="w-[200px] h-full object-cover"
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
            <div className="flex items-center justify-between mb-2">
              <div className="px-2.5 py-0.5 rounded-sm">
                <p className="text-xs">Favourite</p>
              </div>
              <p className="text-lg font-semibold">
                {formatPrice(product.price)}
              </p>
            </div>
            <p className="font-extrabold text-lg mb-2">{product.title}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {product.seller?.companyName && (
                  <>
                    <p className="text-xs text-muted-foreground">Seller:</p>
                    <p className="text-xs font-bold">
                      {product.seller?.companyName}
                    </p>
                  </>
                )}
              </div>
              <div className="rounded-sm bg-green-500 py-1 px-2">
                <p className="text-xs text-white font-semibold">Available</p>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground">
                  Added: {new Date(favourite.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Link
              href={`/marketplace/${product.id}`}
              className="py-2 px-4 rounded-md bg-button-main text-white hover:bg-button-main/90 duration-300 transition-all"
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
    <div className="border border-[#D3D3D3] rounded-lg flex flex-col">
      <div className="relative border-b border-[#D3D3D3] overflow-hidden">
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
          className="w-full h-[125px] object-cover rounded-t-lg"
        />
        {/* Favourite indicator */}
        <div className="absolute top-2 right-2">
          <div className="bg-red-500 p-1.5 rounded-full shadow-lg">
            <Heart size={12} className="text-white fill-white" />
          </div>
        </div>
        {/* Favourite badge */}
        <div className="absolute top-2 left-0">
          <Badge className="text-xs font-semibold rounded-none bg-red-500 text-white">
            Favourite
          </Badge>
        </div>
      </div>
      <div className="flex flex-col p-2">
        <div className="flex items-center justify-between">
          <div className="px-2.5 py-0.5 bg-[#D9D9D9] rounded-sm">
            <p className="text-xs">Saved Item</p>
          </div>
          <p className="text-sm font-semibold">{formatPrice(product.price)}</p>
        </div>

        <div className="flex flex-col gap-2 mt-6.5">
          <p className="font-extrabold text-sm">{product.title}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {product.seller?.companyName && (
                  <>
                    <p className="text-xs text-muted-foreground">Seller:</p>
                    <p className="text-xs font-bold">
                      {product.seller?.companyName}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="rounded-sm bg-green-500 py-0.5 px-2">
              <p className="text-xs text-white font-semibold">Available</p>
            </div>

            <div>
              <p className="text-xs font-bold text-muted-foreground">
                {new Date(favourite.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center mt-3">
            <Link
              href={`/marketplace/${product.id}`}
              className="py-1.5 px-3.5 text-sm rounded-md bg-button-main text-white hover:bg-button-main/90 duration-300 transition-all"
            >
              View Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavouriteCard;
