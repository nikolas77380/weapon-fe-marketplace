import { LayoutGrid, List } from "lucide-react";
import { ViewMode } from "@/hooks/useViewMode";

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onGridClick: () => void;
  onListClick: () => void;
  count?: number;
  title?: string;
  showTitle?: boolean;
}

const ViewModeToggle = ({
  viewMode,
  onGridClick,
  onListClick,
  count,
  title,
  showTitle = true,
}: ViewModeToggleProps) => {
  const toggleButtons = (
    <div className="flex items-center gap-1">
      <div
        onClick={onGridClick}
        className={`p-1.5 min-[500px]:p-2 cursor-pointer transition-colors duration-200 ${
          viewMode === "grid"
            ? "bg-[#FE4819]"
            : "bg-transparent hover:bg-[#E7E7E7]/90"
        }`}
      >
        <LayoutGrid
          size={16}
          className={`min-[500px]:w-5 min-[500px]:h-5 ${
            viewMode === "grid" ? "text-white" : "text-black"
          }`}
        />
      </div>
      <div
        onClick={onListClick}
        className={`p-1.5 min-[500px]:p-2 cursor-pointer transition-colors duration-200 ${
          viewMode === "list"
            ? "bg-[#FE4819]"
            : "bg-transparent hover:bg-[#E7E7E7]/90"
        }`}
      >
        <List
          size={16}
          className={`min-[500px]:w-5 min-[500px]:h-5 ${
            viewMode === "list" ? "text-white" : "text-black"
          }`}
        />
      </div>
    </div>
  );

  if (!showTitle) {
    return toggleButtons;
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold">
        {title} {count !== undefined && `(${count})`}
      </h3>
      {toggleButtons}
    </div>
  );
};

export default ViewModeToggle;
