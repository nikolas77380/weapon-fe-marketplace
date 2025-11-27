import React from "react";
import { Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";

interface MessageItemProps {
  message: Message;
  isOwnMessage: boolean;
  formatTime: (date: string | undefined) => string;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isOwnMessage,
  formatTime,
}) => {
  console.log("[MessageItem] Rendering message:", {
    id: message.id,
    text: message.text?.substring(0, 20),
    isOwnMessage,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  });
  const messageTime = formatTime(message.createdAt || message.updatedAt);
  const isRead = message.isRead ?? false;
  const showStatusIndicator = isOwnMessage;

  console.log("[MessageItem] Message:", {
    id: message.id,
    text: message.text?.substring(0, 20),
    isOwnMessage,
    isRead,
    showStatusIndicator,
  });

  if (!message.text || message.text.trim().length === 0) {
    return null;
  }

  return (
    <div className={cn("flex", isOwnMessage ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-xs sm:max-w-sm md:max-w-md px-4 py-2 rounded-lg",
          isOwnMessage
            ? "bg-gold-main text-white"
            : "bg-white border border-gray-200 text-gray-900"
        )}
      >
        <p className="text-sm">{message.text}</p>
        <div className="flex items-center justify-end gap-1.5 mt-1.5">
          <span
            className={cn(
              "text-xs whitespace-nowrap opacity-80",
              isOwnMessage ? "text-white/80" : "text-gray-500"
            )}
          >
            {messageTime}
          </span>
          {showStatusIndicator && (
            <span
              className={cn(
                "flex items-center flex-shrink-0 opacity-80",
                isOwnMessage ? "text-white/80" : "text-gray-500"
              )}
              title={isRead ? "Read" : "Sent"}
            >
              {isRead ? (
                <CheckCheck className="h-3.5 w-3.5" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
