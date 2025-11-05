"use client";

import React from "react";
import { Chat, Message } from "@/types/chat";
import { ChatHeader } from "./ChatHeader";
import { MessageArea } from "./MessageArea";
import { MessageInput } from "./MessageInput";
import { useTranslations } from "next-intl";

interface ChatInterfaceProps {
  chat: Chat;
  messages: Message[];
  currentUserId?: number;
  onSendMessage: (text: string) => Promise<void>;
  onFinishChat: (
    status: "successfully_completed" | "unsuccessfully_completed" | "closed"
  ) => void;
  onBackToChatList: () => void;
  loading?: boolean;
  isFetching?: boolean;
  sendingMessage?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  chat,
  messages,
  currentUserId,
  onSendMessage,
  onFinishChat,
  onBackToChatList,
  loading = false,
  isFetching = false,
  sendingMessage = false,
}) => {
  const t = useTranslations("Chat");

  // Используем данные напрямую из пропсов - React Query уже обрабатывает обновления
  // Не используем локальное состояние, чтобы избежать конфликтов
  const localMessages = messages;
  const currentChat = chat;

  const isChatActive = currentChat.status === "active";

  const handleBack = () => onBackToChatList();

  return (
    <div className="min-w-0 w-full max-w-full overflow-x-hidden flex flex-col h-full">
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 w-full">
        <ChatHeader
          chat={currentChat}
          onFinishChat={onFinishChat}
          loading={loading}
          onBack={handleBack}
        />
      </div>

      <div className="flex-1 bg-gray-50 h-[100vh] overflow-x-hidden w-full">
        <MessageArea
          messages={localMessages}
          currentUserId={currentUserId}
          loading={loading}
          isFetching={isFetching}
        />
      </div>

      <div className="sticky bottom-0 z-20 w-full max-w-full overflow-x-hidden pb-[env(safe-area-inset-bottom,0)]">
        <MessageInput
          onSendMessage={onSendMessage}
          disabled={!isChatActive}
          loading={sendingMessage}
          placeholder={
            isChatActive
              ? t("messageInput.placeholder")
              : t("messageInput.placeholderInactive")
          }
        />
      </div>
    </div>
  );
};
