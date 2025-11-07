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

// Используем поле hasUnreadMessages из API, если оно доступно
// Иначе проверяем сообщения (fallback для обратной совместимости)
const hasUnreadMessages = (chat: Chat, currentUserId?: number): boolean => {
  // Приоритет: используем поле из API
  if (chat.hasUnreadMessages !== undefined) {
    return chat.hasUnreadMessages;
  }

  // Fallback: проверяем сообщения (для обратной совместимости)
  if (!chat.messages || !currentUserId) return false;

  return chat.messages.some(
    (message) => !message.isRead && message.sender?.id !== currentUserId
  );
};

const getInitials = (name: string | null | undefined) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getChatTitle = (chat: Chat, currentUserId?: number): string => {
  if (!currentUserId || !chat.participants || chat.participants.length === 0) {
    return chat.topic;
  }

  const otherParticipant = chat.participants.find(
    (p) => p.id !== currentUserId
  );

  if (!otherParticipant) {
    return chat.topic;
  }

  if (otherParticipant.metadata?.companyName) {
    return `${otherParticipant.username} (${otherParticipant.metadata.companyName})`;
  }

  return otherParticipant.displayName || otherParticipant.username;
};

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  currentChatId,
  onChatSelect,
  loading = false,
}) => {
  const t = useTranslations("Chat");
  const { currentUser } = useAuthContext();

  // Сортируем чаты по updatedAt - это поле теперь обновляется при каждом действии в чате
  const sortedChats = [...chats].sort((a, b) => {
    const dateA = new Date(a.updatedAt).getTime();
    const dateB = new Date(b.updatedAt).getTime();

    // Сортируем по убыванию (самые новые сверху)
    return dateB - dateA;
  });
  if (loading && !chats.length) {
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
      {sortedChats.map((chat) => {
        // Получаем последнее сообщение из кеша, если оно есть
        // Но для отображения времени используем updatedAt, так как messages не приходит с бэка
        const lastMessage =
          chat.messages && chat.messages.length > 0 ? chat.messages[0] : null;
        const isActive = currentChatId === chat.id;
        const hasUnread = hasUnreadMessages(chat, currentUser?.id);

        // Используем updatedAt для отображения времени, так как это поле обновляется на бэке
        // при каждом действии в чате (отправка сообщения и т.д.)
        const displayTime = chat.updatedAt;

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
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {/* Точка главного цвета - показываем только если есть непрочитанные сообщения */}
                  {hasUnread && (
                    <div className="h-2 w-2 rounded-full bg-gold-main shrink-0 mt-1.5"></div>
                  )}
                  <h3 className="font-semibold text-base sm:text-lg truncate text-gray-900">
                    {getChatTitle(chat, currentUser?.id)}
                  </h3>
                </div>
                {/* <Badge
                  className={`${getStatusColor(
                    chat.status
                  )} text-xs sm:text-sm whitespace-nowrap`}
                >
                  {t(`status.${chat.status}`)}
                </Badge> */}
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
                    {formatDistanceToNow(new Date(displayTime), {
                      addSuffix: true,
                      locale: uk,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
