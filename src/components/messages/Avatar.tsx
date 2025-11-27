import React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  imageUrl?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  isOnline?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "w-10 h-10 text-base",
  md: "w-12 h-12 text-lg",
  lg: "w-16 h-16 text-2xl",
};

const onlineIndicatorSizes = {
  sm: "w-2.5 h-2.5 border-2",
  md: "w-3 h-3 border-2",
  lg: "w-4 h-4 border-[3px]",
};

export const Avatar: React.FC<AvatarProps> = ({
  imageUrl,
  name,
  size = "md",
  isOnline = false,
  className,
}) => {
  const initial = (name?.[0] || "?").toUpperCase();

  return (
    <div className={cn("relative flex-shrink-0", className)}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name || "User"}
          className={cn(
            sizeClasses[size],
            "rounded-full object-cover border-2 border-gray-200"
          )}
        />
      ) : (
        <div
          className={cn(
            sizeClasses[size],
            "rounded-full bg-gold-main flex items-center justify-center text-white font-semibold"
          )}
        >
          {initial}
        </div>
      )}
      
      {isOnline && (
        <div
          className={cn(
            onlineIndicatorSizes[size],
            "absolute bottom-0 right-0 bg-gold-main rounded-full border-white"
          )}
        />
      )}
    </div>
  );
};


