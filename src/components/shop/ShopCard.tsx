import Image from "next/image";
import { Badge } from "../ui/badge";
import { MessageSquare, Star } from "lucide-react";
import { Button } from "../ui/button";
import { Product } from "@/lib/types";
import { createSendBirdChannel, redirectToMessages } from "@/lib/sendbird";
import { useAuthContext } from "@/context/AuthContext";
import { useState } from "react";
import { getBestImageUrl, handleImageError } from "@/lib/imageUtils";
import Link from "next/link";

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
        redirectToMessages(response.channel.channelUrl);
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
      <Link
        href={`/marketplace/${item.id}`}
        className="border border-[#D3D3D3] rounded-lg flex flex-row"
      >
        <div className="relative overflow-hidden">
          <Image
            src={getBestImageUrl(item.images?.[0], "small") || "/shop/1.jpg"}
            alt={item.title}
            width={200}
            height={150}
            onError={(e) => handleImageError(e, "/shop/1.jpg")}
            className="w-[200px] h-full object-cover rounded-l-lg"
          />
          <div className="absolute top-2 left-2">
            <Badge
              className={`
                text-xs font-semibold
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
        <div className="flex flex-col justify-between p-4 flex-1">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="px-2.5 py-0.5 bg-[#D9D9D9] rounded-sm">
                <p className="text-xs">{item.category?.name}</p>
              </div>
              <p className="text-lg font-semibold">{item.price}$</p>
            </div>
            <p className="font-extrabold text-lg mb-2">{item.title}</p>
            <p className="font-light text-sm text-gray-600 mb-4">
              {item.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-black flex items-center justify-center">
                  <p className="text-xs text-white font-bold">
                    {item.seller?.username}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={20} className="text-yellow-400" />
                  <p className="text-sm font-medium">{5}</p>
                </div>
              </div>
              <div className="rounded-sm bg-green-500 py-1 px-2">
                <p className="text-xs text-white font-semibold">
                  {item.status}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-[#D3D3D3]">
                  {item.viewsCount} {item.viewsCount === 1 ? "view" : "views"}
                </p>
              </div>
            </div>
            <Button
              className="flex items-center gap-2 py-2 px-4"
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
      </Link>
    );
  }

  // Grid view
  return (
    <Link
      href={`/marketplace/${item.id}`}
      className="border border-[#D3D3D3] rounded-lg flex flex-col"
    >
      <div className="relative border-b border-[#D3D3D3] overflow-hidden">
        <Image
          src={getBestImageUrl(item.images?.[0], "small") || "/shop/1.jpg"}
          alt={item.title}
          width={300}
          height={200}
          onError={(e) => handleImageError(e, "/shop/1.jpg")}
          className="w-full h-[125px] object-cover rounded-t-lg"
        />
        <div className="absolute top-2 left-2">
          <Badge
            className={`
              text-xs font-semibold
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
      <div className="flex flex-col p-2">
        <div className="flex items-center justify-between">
          <div className="px-2.5 py-0.5 bg-[#D9D9D9] rounded-sm">
            <p className="text-xs">{item.category?.name}</p>
          </div>
          <p className="text-sm font-semibold">{item.price}$</p>
        </div>

        <div className="flex flex-col gap-2 mt-6.5">
          <p className="font-extrabold text-sm">{item.title}</p>
          <p className="font-light text-sm">{item.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-7.5 rounded-full bg-black flex items-center justify-center">
                <p className="text-xs text-white font-bold">
                  {item.seller?.username}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Star size={24} className="text-yellow-400" />
                <p className="text-xs font-medium">{5}</p>
              </div>
            </div>

            <div className="rounded-sm bg-green-500 py-0.5 px-2">
              <p className="text-xs text-white font-semibold">{item.status}</p>
            </div>

            <div>
              <p className="text-xs font-bold text-[#D3D3D3]">
                {item.viewsCount} {item.viewsCount === 1 ? "view" : "views"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Button
              className="flex items-center gap-2 py-2 w-2/3"
              onClick={(e) => handleContactSeller(e)}
              disabled={isLoading}
            >
              <MessageSquare size={15} />
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
