"use client";

import React from "react";
import { Message } from "@/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { uk } from "date-fns/locale";
import { Check, CheckCheck } from "lucide-react";

interface MessageItemProps {
  message: Message;
  currentUserId?: number;
  ref?: React.Ref<HTMLDivElement>;
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
        className={`flex items-center max-w-[280px] xs:max-w-xs sm:max-w-sm md:max-w-md ${
          isOwnMessage ? "flex-row-reverse" : "flex-row"
        } gap-2`}
      >
        {!isOwnMessage && (
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={message.sender.metadata?.avatar?.url}
              alt={message.sender.displayName || message.sender.username}
            />
            <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
              {getInitials(
                message.sender.displayName || message.sender.username
              )}
            </AvatarFallback>
          </Avatar>
        )}

        <div
          className={`flex flex-col ${
            isOwnMessage ? "items-end" : "items-start"
          }`}
        >
          <div
            className={`max-w-[280px] xs:max-w-xs sm:max-w-sm md:max-w-md px-4 py-2 rounded-lg break-words ${
              isOwnMessage
                ? "bg-gold-main text-white"
                : "bg-white border border-gray-200 text-gray-900"
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
            <div
              className={`flex items-center ${
                isOwnMessage ? "gap-0" : "gap-4"
              }`}
            >
              <div>
                {!isOwnMessage && (
                  <span className="text-xs text-gray-500 mb-1">
                    {message.sender.username}
                  </span>
                )}
              </div>
              <div
                className={`flex items-center mt-1 ${
                  isOwnMessage ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {isOwnMessage && (
                  <div className="ml-1">
                    {isRead ? (
                      <CheckCheck className="h-3 w-3 text-white" />
                    ) : (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                )}
                <span
                  className={`text-xs ${
                    isOwnMessage ? "text-gray-200" : "text-gray-500"
                  }`}
                >
                  {format(new Date(message.createdAt), "HH:mm", { locale: uk })}
                </span>
              </div>
            </div>
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
            <AvatarImage
              src={message.sender.metadata?.avatar?.url}
              alt={message.sender.displayName || message.sender.username}
            />
            <AvatarFallback className="bg-green-100 text-green-800 text-xs">
              {getInitials(
                message.sender.displayName || message.sender.username
              )}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
};
