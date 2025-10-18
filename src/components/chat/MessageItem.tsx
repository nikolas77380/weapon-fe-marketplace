"use client";

import React from "react";
import { Message } from "@/types/chat";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { ru } from "date-fns/locale";
import { Check, CheckCheck } from "lucide-react";

interface MessageItemProps {
  message: Message;
  currentUserId?: number;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  currentUserId,
}) => {
  const t = useTranslations("Chat");
  const isOwnMessage = message.sender.id === currentUserId;
  const isRead = message.isRead;
  const readByCount = message.readBy?.length || 0;

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`flex max-w-[70%] ${
          isOwnMessage ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {!isOwnMessage && (
          <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
            <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
              {getInitials(message.sender.username)}
            </AvatarFallback>
          </Avatar>
        )}

        <div
          className={`flex flex-col ${
            isOwnMessage ? "items-end" : "items-start"
          }`}
        >
          {!isOwnMessage && (
            <span className="text-xs text-gray-500 mb-1">
              {message.sender.username}
            </span>
          )}

          <div
            className={`px-4 py-2 rounded-lg ${
              isOwnMessage
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
          </div>

          <div
            className={`flex items-center mt-1 ${
              isOwnMessage ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <span className="text-xs text-gray-500">
              {format(new Date(message.createdAt), "HH:mm", { locale: ru })}
            </span>

            {isOwnMessage && (
              <div className="ml-1">
                {isRead ? (
                  <CheckCheck className="h-3 w-3 text-blue-500" />
                ) : (
                  <Check className="h-3 w-3 text-gray-400" />
                )}
              </div>
            )}
          </div>

          {isOwnMessage && readByCount > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              {t("messageItem.readBy", { count: readByCount })}
            </div>
          )}
        </div>

        {/* Аватар для собственных сообщений */}
        {isOwnMessage && (
          <Avatar className="h-8 w-8 ml-2 flex-shrink-0">
            <AvatarFallback className="bg-green-100 text-green-800 text-xs">
              {getInitials(message.sender.username)}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
};
