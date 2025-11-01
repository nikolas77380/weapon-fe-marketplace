"use client";

import React from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useFavourites } from "@/hooks/useFavourites";
import { useTranslations } from "next-intl";

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
  const t = useTranslations('ProductDetail');

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

  const tooltipText = isFavourited(productId)
    ? t('buttonRemoveFavourite')
    : t('buttonAddFavourite')

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size="sm"
            className={cn(
              "rounded-full transition-all duration-200 px-8 py-6",
              // sizeClasses[size],
              isFavourited(productId) && "text-red-500 hover:text-red-600",
              !isFavourited(productId) && "text-gray-400 hover:text-red-500",
              className
            )}
            onClick={handleToggleFavourite}
            disabled={loading}
            aria-label={tooltipText}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            ) : (
              <Heart
                // size={size === "sm" ? 12 : size === "md" ? 14 : 20}
                className={cn(
                  "transition-all duration-200 size-8",
                  isFavourited(productId) && "fill-current"
                )}
              />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FavouriteButton;
