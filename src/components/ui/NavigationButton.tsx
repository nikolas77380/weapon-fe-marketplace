import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationButtonProps {
  direction: "left" | "right";
  onClick: () => void;
  className?: string;
  size?: number;
  disabled?: boolean;
  showLeftButton?: boolean;
}

const NavigationButton = ({
  direction,
  onClick,
  className,
  size = 26,
  disabled = false,
  showLeftButton = true,
}: NavigationButtonProps) => {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;

  if (!showLeftButton) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        `absolute top-1/2 z-10 transform -translate-y-1/2 
        bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 
        flex items-center justify-center transition-all duration-200 
        shadow-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`,
        direction === "left" ? "left-4" : "right-4",
        className
      )}
    >
      <Icon size={size} className="text-gray-500" />
    </button>
  );
};

export default NavigationButton;
