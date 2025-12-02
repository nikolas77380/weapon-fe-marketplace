"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  EllipsisVertical,
  Check,
  Archive,
  Star,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatRelativeTimeShort } from "@/lib/time-utils";
import { Avatar } from "./Avatar";

export type ChatFilter = "all" | "unread" | "favorites" | "archived";

interface ChatCounts {
  all: number;
  unread: number;
  favorites: number;
  archived: number;
}

interface ChatListProps {
  chats: any[];
  selectedChatId: string | number | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onChatSelect: (chatId: string | number) => void;
  onlineUsers: Set<number>;
  t: (key: string, params?: any) => string;
  activeFilter?: ChatFilter;
  onFilterChange?: (filter: ChatFilter) => void;
  onMarkAsRead?: (chatId: string | number) => void;
  onArchive?: (chatId: string | number) => void;
  onFavorite?: (chatId: string | number) => void;
  onDelete?: (chatId: string | number) => void;
  chatCounts?: ChatCounts;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  selectedChatId,
  searchQuery,
  onSearchChange,
  onChatSelect,
  onlineUsers,
  t,
  activeFilter = "all",
  onFilterChange,
  onMarkAsRead,
  onArchive,
  onFavorite,
  onDelete,
  chatCounts: externalChatCounts,
}) => {
  const [menuOpenChatId, setMenuOpenChatId] = useState<string | number | null>(
    null
  );
  const menuRef = useRef<HTMLDivElement>(null);

  console.log("[ChatList] Rendering:", {
    chatsCount: chats.length,
    selectedChatId,
    chats: chats.map((c) => ({ id: c.id, productId: c.productId })),
  });

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenChatId(null);
      }
    };

    if (menuOpenChatId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpenChatId]);

  const handleChatClick = (chatId: string | number) => {
    console.log("[ChatList] Chat clicked:", chatId);
    onChatSelect(chatId);
  };

  const handleMenuClick = (e: React.MouseEvent, chatId: string | number) => {
    e.stopPropagation();
    setMenuOpenChatId(menuOpenChatId === chatId ? null : chatId);
  };

  const handleMenuAction = (
    e: React.MouseEvent,
    chatId: string | number,
    action: () => void
  ) => {
    e.stopPropagation();
    action();
    setMenuOpenChatId(null);
  };

  // Подсчет чатов для каждого фильтра
  const getChatCounts = () => {
    return {
      all: chats.length,
      unread: chats.filter((chat) => chat.unreadCount > 0).length,
      favorites: chats.filter((chat) => chat.isFavorite).length,
      archived: chats.filter((chat) => chat.isArchived).length,
    };
  };

  const chatCounts = externalChatCounts ?? getChatCounts();

  const filters: { key: ChatFilter; label: string }[] = [
    { key: "all", label: t("filters.all") || "All" },
    { key: "unread", label: t("filters.unread") || "Unread" },
    { key: "favorites", label: t("filters.favorites") || "Favorites" },
    { key: "archived", label: t("filters.archived") || "Archived" },
  ];

  return (
    <>
      {/* Поиск */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder={t("searchChats") || "Search chats..."}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Фильтры (чипы) */}
      {onFilterChange && (
        <div className="px-4 py-3 border-b border-gray-200 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {filters.map((filter) => {
              const count = chatCounts[filter.key];
              const isActive = activeFilter === filter.key;

              return (
                <button
                  key={filter.key}
                  onClick={() => onFilterChange(filter.key)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                    "flex items-center gap-2",
                    isActive
                      ? "bg-gold-main text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  <span>{filter.label}</span>
                  {count > 0 && (
                    <span
                      className={cn(
                        "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold rounded-full",
                        isActive
                          ? "bg-white text-gold-main"
                          : "bg-gray-200 text-gray-700"
                      )}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Список чатов */}
      {chats.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>{t("noChats") || "No chats yet"}</p>
        </div>
      ) : (
        <div className="space-y-0">
          {chats.map((chat: any) => {
            const displayName = chat.participantCompany
              ? `${chat.participantName} (${chat.participantCompany})`
              : chat.participantName ||
                chat.topic ||
                `Chat ${String(chat.id).substring(0, 8)}...`;

            const lastMessageText = chat.lastMessage?.text || "";
            const lastMessageTime = chat.lastMessage?.createdAt
              ? (() => {
                  console.log('[ChatList] Calling formatRelativeTimeShort with t:', typeof t, 'date:', chat.lastMessage.createdAt);
                  return formatRelativeTimeShort(chat.lastMessage.createdAt, t);
                })()
              : "";

            return (
              <div
                key={chat.id}
                onClick={() => handleChatClick(chat.id)}
                className={cn(
                  "group relative p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
                  selectedChatId === chat.id && "bg-gray-100"
                )}
              >
                <div className="flex justify-between items-start gap-3">
                  {/* Аватар */}
                  <Avatar
                    imageUrl={chat.participant?.metadata?.avatar?.url}
                    name={chat.participantName || chat.participantCompany}
                    size="md"
                    isOnline={
                      chat.participant?.id
                        ? onlineUsers.has(chat.participant.id)
                        : false
                    }
                    className="mt-1"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base mb-1 truncate">
                      {displayName}
                    </p>
                    {lastMessageText && (
                      <p className="text-sm text-gray-600 truncate">
                        {lastMessageText}
                      </p>
                    )}
                  </div>
                  <div className="flex items-start gap-2 flex-shrink-0">
                    <div className="flex flex-col items-end gap-2">
                      {lastMessageTime && (
                        <p className="text-xs text-gray-500 whitespace-nowrap">
                          {lastMessageTime}
                        </p>
                      )}
                      {chat.unreadCount !== undefined &&
                        chat.unreadCount > 0 && (
                          <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-gold-main text-white text-xs font-semibold rounded-full">
                            {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                          </span>
                        )}
                    </div>
                    <div className="relative">
                      <button
                        onClick={(e) => handleMenuClick(e, chat.id)}
                        className={cn(
                          "p-1 rounded hover:bg-gray-200 transition-opacity",
                          // На мобильных всегда видна, на десктопе только при hover/menu open
                          "opacity-100 md:opacity-0 md:group-hover:opacity-100",
                          menuOpenChatId === chat.id && "md:opacity-100"
                        )}
                      >
                        <EllipsisVertical className="h-5 w-5 text-gray-600" />
                      </button>

                      {/* Контекстное меню */}
                      {menuOpenChatId === chat.id && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 top-8 z-50 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
                        >
                          {onMarkAsRead && (
                            <button
                              onClick={(e) =>
                                handleMenuAction(e, chat.id, () =>
                                  onMarkAsRead(chat.id)
                                )
                              }
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                            >
                              <Check className="h-4 w-4" />
                              {t("contextMenu.markAsRead") || "Mark as read"}
                            </button>
                          )}
                          {onArchive && (
                            <button
                              onClick={(e) =>
                                handleMenuAction(e, chat.id, () =>
                                  onArchive(chat.id)
                                )
                              }
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                            >
                              <Archive className="h-4 w-4" />
                              {chat.isArchived
                                ? t("contextMenu.unarchive") || "Unarchive"
                                : t("contextMenu.archive") || "Archive"}
                            </button>
                          )}
                          {onFavorite && (
                            <button
                              onClick={(e) =>
                                handleMenuAction(e, chat.id, () =>
                                  onFavorite(chat.id)
                                )
                              }
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                            >
                              <Star className="h-4 w-4" />
                              {chat.isFavorite
                                ? t("contextMenu.removeFromFavorites") ||
                                  "Remove from favorites"
                                : t("contextMenu.addToFavorites") ||
                                  "Add to favorites"}
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={(e) =>
                                handleMenuAction(e, chat.id, () =>
                                  onDelete(chat.id)
                                )
                              }
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                              {t("contextMenu.deleteChat") || "Delete chat"}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
