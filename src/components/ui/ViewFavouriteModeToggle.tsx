import { LayoutGrid, List } from "lucide-react";
import { ViewMode } from "@/hooks/useViewMode";

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onGridClick: () => void;
  onListClick: () => void;
  count?: number;
  title?: string;
}

const ViewFavouriteModeToggle = ({
  viewMode,
  onGridClick,
  onListClick,
  count,
  title,
}: ViewModeToggleProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold">
        {title} {count !== undefined && `(${count})`}
      </h3>
      <div className="flex items-center gap-1">
        <div
          onClick={onGridClick}
          className={`p-2 rounded-md cursor-pointer transition-colors duration-200 ${
            viewMode === "grid" ? "bg-black" : "bg-[#D9D9D9] hover:bg-gray-300"
          }`}
        >
          <LayoutGrid
            size={20}
            className={viewMode === "grid" ? "text-white" : "text-black"}
          />
        </div>
        <div
          onClick={onListClick}
          className={`p-2 rounded-md cursor-pointer transition-colors duration-200 ${
            viewMode === "list" ? "bg-black" : "bg-[#D9D9D9] hover:bg-gray-300"
          }`}
        >
          <List
            size={20}
            className={viewMode === "list" ? "text-white" : "text-black"}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewFavouriteModeToggle;
