"use client";

import { useNavigation } from "@/context/NavigationContext";
import { TopProgressBar } from "./TopProgressBar";

export function NavigationLoader() {
  const { isNavigating } = useNavigation();

  return <TopProgressBar isLoading={isNavigating} />;
}
