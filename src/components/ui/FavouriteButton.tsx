"use client";

import React from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFavourites } from "@/hooks/useFavourites";

interface FavouriteButtonProps {
  productId: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
}

const FavouriteButton: React.FC<FavouriteButtonProps> = ({
  productId,
  className,
  size = "md",
  variant = "ghost",
}) => {
  const { isFavourited, toggleFavourite, loading } = useFavourites();

  const handleToggleFavourite = async () => {
    if (loading) return;
    await toggleFavourite(productId);
  };

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <Button
      variant={variant}
      size="sm"
      className={cn(
        "rounded-full transition-all duration-200",
        sizeClasses[size],
        isFavourited(productId) && "text-red-500 hover:text-red-600",
        !isFavourited(productId) && "text-gray-400 hover:text-red-500",
        className
      )}
      onClick={handleToggleFavourite}
      disabled={loading}
      aria-label={
        isFavourited(productId) ? "Remove from favourites" : "Add to favourites"
      }
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
      ) : (
        <Heart
          size={size === "sm" ? 16 : size === "md" ? 18 : 20}
          className={cn(
            "transition-all duration-200",
            isFavourited(productId) && "fill-current"
          )}
        />
      )}
    </Button>
  );
};

export default FavouriteButton;
