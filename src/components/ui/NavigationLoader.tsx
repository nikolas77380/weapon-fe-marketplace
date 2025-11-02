"use client";

import { useNavigation } from "@/context/NavigationContext";
import { Loader2 } from "lucide-react";

export function NavigationLoader() {
  const { isNavigating } = useNavigation();

  if (!isNavigating) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      {/* Затемненный backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Спиннер по центру */}
      <div className="relative z-10 bg-white/95 dark:bg-gray-900/95 rounded-full p-6 shadow-2xl">
        <Loader2
          className="w-8 h-8 animate-spin"
          style={{ color: "var(--color-gold-main)" }}
        />
      </div>
    </div>
  );
}
