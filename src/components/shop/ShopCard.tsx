import Image from "next/image";
import { Badge } from "../ui/badge";
import { Eye, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { ImageType, Product } from "@/lib/types";
import { createSendBirdChannel, redirectToMessages } from "@/lib/sendbird";
import { useAuthContext } from "@/context/AuthContext";
import { useState } from "react";
import { getBestImageUrl, handleImageError } from "@/lib/imageUtils";
import { formatPrice } from "@/lib/formatUtils";
import Link from "next/link";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface ShopCardProps {
  item: Product;
  viewMode?: "grid" | "list";
}

const ShopCard = ({ item, viewMode = "grid" }: ShopCardProps) => {
  const { currentUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleContactSeller = async (e: React.MouseEvent) => {
    // Prevent event bubbling to parent Link
    e.stopPropagation();
    e.preventDefault();

    if (!currentUser) {
      // Redirect to login if user is not authenticated
      window.location.href = "/auth";
      return;
    }

    if (currentUser.role.name !== "buyer") {
      alert("Only buyers can contact sellers");
      return;
    }

    setIsLoading(true);

    try {
      const response = await createSendBirdChannel(item);

      if (response.success) {
        // Redirect to messages page with the channel URL
        redirectToMessages();
      }
    } catch (error) {
      console.error("Error creating channel:", error);
      alert("Failed to create chat channel. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (viewMode === "list") {
    // List view
    return (
      <div
        className="border border-border-foreground bg-primary-foreground flex flex-row"
      >
        <Link href={`/marketplace/${item.id}`} className="relative overflow-hidden">
          <Image
            src={
              getBestImageUrl(item.images?.[0] as ImageType, "small") ||
              "/shop/1.jpg"
            }
            alt={item.title}
            width={200}
            height={150}
            onError={(e) => handleImageError(e, "/shop/1.jpg")}
            className="w-[200px] h-full object-cover"
          />
          {/* Badge */}
        <div className="absolute top-2 left-0">
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
        </div>
        </Link>
        <div className="flex flex-col justify-between p-4 flex-1">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-lg font-semibold">
                {formatPrice(item.price, "$")}
              </p>
            </div>
            <p className="font-extrabold text-lg mb-2">{item.title}</p>
            <p className="font-light text-sm text-gray-600 mb-4">
              {item.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback className="bg-black text-white text-sm uppercase">
                    {item?.seller?.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex items-center gap-1">
                <Eye size={16} className="text-foreground/50" />
                <p className="text-sm text-foreground/50">
                  {item.viewsCount} {item.viewsCount === 1 ? "view" : "views"}
                </p>
              </div>
            </div>
            <Button
              className="flex items-center gap-2 rounded-none py-2.5 px-5 bg-gold-main hover:bg-gold-main/90 text-white"
              onClick={(e) => handleContactSeller(e)}
              disabled={isLoading}
            >
              <MessageSquare size={15} />
              <p className="text-sm font-semibold">
                {isLoading ? "Creating..." : "Contact Seller"}
              </p>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <Link
      href={`/marketplace/${item.id}`}
      className="border border-border-foreground flex flex-col bg-primary-foreground"
    >
      <div className="relative overflow-hidden">
        <Image
          src={
            getBestImageUrl(item.images?.[0] as ImageType, "small") ||
            "/shop/1.jpg"
          }
          alt={item.title}
          width={266}
          height={200}
          onError={(e) => handleImageError(e, "/shop/1.jpg")}
          className="w-full h-full object-cover"
        />
        {/* Badge */}
        <div className="absolute top-2 left-0">
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
        </div>
      </div>
      <div className="flex flex-col p-7.5">
        <div className="flex flex-col gap-2">
          <p className="font-medium text-xl">{item.title}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <p className="text-sm text-foreground/50">Seller:</p>
                <p className="text-sm underline">{item.seller?.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={16} className="text-foreground/50" />
              <p className="text-sm text-foreground/50">{item.viewsCount}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-5">
            <p className="text-xl font-medium text-gold-main">
              {formatPrice(item.price, "$")}
            </p>
            <Button
              className="rounded-none py-2.5 px-5 bg-gold-main hover:bg-gold-main/90 text-white"
              onClick={(e) => handleContactSeller(e)}
              disabled={isLoading}
            >
              {/* <MessageSquare size={15} /> */}
              <p className="text-xs font-semibold">
                {isLoading ? "Creating..." : "Contact Seller"}
              </p>
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ShopCard;
