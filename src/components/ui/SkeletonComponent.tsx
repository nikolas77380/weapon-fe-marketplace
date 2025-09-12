import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonComponentProps {
  type: "productCard" | "sellerCard" | "title" | "favouriteCard";
  count?: number;
  className?: string;
}

const SkeletonComponent = ({
  type,
  count = 1,
  className = "",
}: SkeletonComponentProps) => {
  const renderSkeleton = () => {
    switch (type) {
      case "productCard":
        return (
          <div className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
            </div>
          </div>
        );

      case "sellerCard":
        return (
          <div className="w-full border border-gray-primary rounded-xl p-5">
            <div className="flex gap-4">
              {/* Скелетон для изображения */}
              <Skeleton className="h-24 w-24 rounded-lg flex-shrink-0" />

              {/* Скелетоны для текста */}
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2 mt-3">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>

              {/* Скелетон для статуса */}
              <div className="flex flex-col items-end gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          </div>
        );

      case "title":
        return <Skeleton className="h-8 w-32 mb-4" />;

      case "favouriteCard":
        return (
          <div className="border border-[#D3D3D3] rounded-lg flex flex-col">
            <div className="relative border-b border-[#D3D3D3] overflow-hidden">
              <Skeleton className="w-full h-[125px] rounded-t-lg" />
              <div className="absolute top-2 right-2">
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
              <div className="absolute top-2 left-0">
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
            <div className="flex flex-col p-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex flex-col gap-2 mt-6.5">
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="flex items-center justify-center mt-3">
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={className}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
};

export default SkeletonComponent;
