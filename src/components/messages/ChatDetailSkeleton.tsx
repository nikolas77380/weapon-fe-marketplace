"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ChatDetailSkeletonProps {
  messageCount?: number;
}

export const ChatDetailSkeleton: React.FC<ChatDetailSkeletonProps> = ({
  messageCount = 4,
}) => {
  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header skeleton */}
      <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-3">
        <div className="hidden md:block w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Message list skeleton */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {Array.from({ length: messageCount }).map((_, index) => {
          const isOwn = index % 2 === 0;
          return (
            <div
              key={index}
              className={cn(
                "flex w-full",
                isOwn ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "rounded-2xl px-4 py-3 max-w-[70%] animate-pulse",
                  isOwn ? "bg-gray-200" : "bg-white border border-gray-200"
                )}
              >
                <div className="h-3 w-32 bg-gray-300 rounded mb-2" />
                <div className="h-3 w-48 bg-gray-300 rounded" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Composer skeleton */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    </div>
  );
};


