import React, { useState, useRef, useCallback, useMemo } from "react";

interface CustomScrollbarProps {
  progress: number; // Current progress (0-1)
  onProgressChange: (progress: number) => void; // Callback when progress changes
  totalItems: number; // Total number of elements
  visibleItems: number; // Number of visible elements
  className?: string;
  onDragStart?: () => void; // Callback when drag starts
  onDragEnd?: () => void; // Callback when drag is completed
}

const CustomScrollbar = ({
  progress,
  onProgressChange,
  totalItems,
  visibleItems,
  className = "",
  onDragStart,
  onDragEnd,
}: CustomScrollbarProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const scrollbarRef = useRef<HTMLDivElement>(null);

  // We calculate the thumb size based on the ratio of visible/total elements
  const thumbWidth = useMemo(
    () => Math.max(10, (visibleItems / totalItems) * 100),
    [visibleItems, totalItems]
  );

  // Handling clicks and drags on the scrollbar
  const handleScrollbarInteraction = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
      if (!scrollbarRef.current) return;

      const rect = scrollbarRef.current.getBoundingClientRect();
      const clientX = "clientX" in e ? e.clientX : (e as any).clientX;
      const clickX = clientX - rect.left;
      const scrollbarWidth = rect.width;
      const clickProgress = Math.max(0, Math.min(1, clickX / scrollbarWidth));

      onProgressChange(clickProgress);
    },
    [onProgressChange]
  );

  // Drag thumb handling
  const handleThumbMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      onDragStart?.(); // Notify the parent about the start of drag

      const handleMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        handleScrollbarInteraction(e);
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        onDragEnd?.(); // Notifying the parent about the end of the drag
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [onDragStart, onDragEnd, handleScrollbarInteraction]
  );

  return (
    <div
      ref={scrollbarRef}
      className={`w-full h-0.5 bg-gray-200 rounded-full mt-2 cursor-pointer relative ${className}`}
      onClick={handleScrollbarInteraction}
    >
      <div
        className={`absolute top-0 h-full bg-gold-main rounded-full cursor-grab active:cursor-grabbing hover:bg-gold-main/90 ${
          isDragging ? "transition-none" : "transition-all duration-200"
        }`}
        style={{
          width: `${thumbWidth}%`,
          left: `${progress * (100 - thumbWidth)}%`,
        }}
        onMouseDown={handleThumbMouseDown}
      />
    </div>
  );
};

export default CustomScrollbar;
