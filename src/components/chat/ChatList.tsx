"use client";

import React from "react";
import { Chat } from "@/types/chat";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Users, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { uk } from "date-fns/locale";
import { useTranslations } from "next-intl";
import { useAuthContext } from "@/context/AuthContext";

interface ChatListProps {
  chats: Chat[];
  currentChatId?: number;
  onChatSelect: (chat: Chat) => void;
  loading?: boolean;
}

const getStatusColor = (status: Chat["status"]) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "successfully_completed":
      return "bg-blue-100 text-blue-800";
    case "unsuccessfully_completed":
      return "bg-red-100 text-red-800";
    case "closed":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Function to determine if there are unread messages in the chat
const hasUnreadMessages = (chat: Chat, currentUserId?: number): boolean => {
  if (!chat.messages || !currentUserId) return false;

  return chat.messages.some(
    (message) => !message.isRead && message.sender.id !== currentUserId
  );
};

// Функция для получения инициалов
const getInitials = (name: string | null | undefined) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  currentChatId,
  onChatSelect,
  loading = false,
}) => {
  const t = useTranslations("Chat");
  const { currentUser } = useAuthContext();
  if (loading) {
    return (
      <div className="space-y-4 p-2">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse border-gray-300">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <Card className="shadow-none border-none bg-transparent">
        <CardContent className="p-6 text-center text-gray-500">
          <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">{t("noChats")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="">
      {chats.map((chat) => {
        const lastMessage = chat.messages?.[0];
        const isActive = currentChatId === chat.id;
        const hasUnread = hasUnreadMessages(chat, currentUser?.id);

        return (
          <div
            key={chat.id}
            className={`p-2 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
              isActive
                ? "border-l-4 border-l-gold-main bg-gold-main/10"
                : hasUnread
                ? "bg-blue-50 border-l-4 border-l-blue-500"
                : "border-gray-200"
            }`}
            onClick={() => onChatSelect(chat)}
          >
            <div className="p-4 sm:p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-base sm:text-lg truncate text-gray-900">
                  {chat.topic}
                </h3>
                <Badge
                  className={`${getStatusColor(
                    chat.status
                  )} text-xs sm:text-sm whitespace-nowrap`}
                >
                  {t(`status.${chat.status}`)}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-3 lg:gap-4 items-center text-sm text-gray-500 mb-2">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 mr-1 shrink-0 text-xs" />
                  <span className="text-xs">
                    {chat.participants.length} {t("participants")}
                  </span>
                </div>

                {/* Аватары участников */}
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-1">
                    {chat.participants.slice(0, 3).map((participant) => (
                      <Avatar
                        key={participant.id}
                        className="h-5 w-5 border border-white"
                      >
                        <AvatarImage
                          src={participant.metadata?.avatar?.url}
                          alt={participant.displayName || participant.username}
                        />
                        <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                          {getInitials(
                            participant.displayName || participant.username
                          )}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {chat.participants.length > 3 && (
                      <div className="h-5 w-5 rounded-full bg-gray-100 border border-white flex items-center justify-center">
                        <span className="text-xs text-gray-600">
                          +{chat.participants.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 mr-1 shrink-0 text-xs" />
                  <span className="text-xs">
                    {formatDistanceToNow(new Date(chat.updatedAt), {
                      addSuffix: true,
                      locale: uk,
                    })}
                  </span>
                </div>
              </div>

              {lastMessage && (
                <div className="text-sm text-gray-600 truncate">
                  <span className="font-medium">
                    {lastMessage.sender.displayName}:
                  </span>
                  <span className="ml-1">{lastMessage.text}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
