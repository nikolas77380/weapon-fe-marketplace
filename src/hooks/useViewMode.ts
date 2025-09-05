import { useState } from "react";

export type ViewMode = "grid" | "list";

export const useViewMode = (initialMode: ViewMode = "grid") => {
  const [viewMode, setViewMode] = useState<ViewMode>(initialMode);

  const toggleToGrid = () => setViewMode("grid");
  const toggleToList = () => setViewMode("list");

  return {
    viewMode,
    setViewMode,
    toggleToGrid,
    toggleToList,
  };
};
