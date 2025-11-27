"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ChatListSkeletonProps {
  count?: number;
  t: (key: string) => string;
}

export const ChatListSkeleton: React.FC<ChatListSkeletonProps> = ({
  count = 5,
  t,
}) => {
  return (
    <>
      {/* Поиск */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder={t("searchChats") || "Search chats..."}
            disabled
            className="pl-10 bg-gray-50"
          />
        </div>
      </div>

      {/* Фильтры (скелетон) */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-9 w-20 bg-gray-200 rounded-full animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Список чатов - скелетоны */}
      <div className="space-y-0">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="p-4 border-b border-gray-100 animate-pulse"
          >
            <div className="flex justify-between items-start gap-3">
              {/* Аватар скелетон */}
              <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 mt-1" />

              <div className="flex-1 min-w-0 space-y-2">
                {/* Имя скелетон */}
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                {/* Последнее сообщение скелетон */}
                <div className="h-4 bg-gray-200 rounded w-full" />
              </div>

              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                {/* Время скелетон */}
                <div className="h-3 w-12 bg-gray-200 rounded" />
                {/* Счетчик непрочитанных (опционально) */}
                {index % 3 === 0 && (
                  <div className="h-5 w-5 bg-gray-200 rounded-full" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

