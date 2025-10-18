"use client";

import React, { useEffect } from "react";
import { Chat, Message } from "@/types/chat";
import { ChatHeader } from "./ChatHeader";
import { MessageArea } from "./MessageArea";
import { MessageInput } from "./MessageInput";
import { useChatPolling } from "@/hooks/useChatPolling";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
  chat: Chat;
  messages: Message[];
  currentUserId?: number;
  onSendMessage: (text: string) => Promise<void>;
  onFinishChat: (
    status: "successfully_completed" | "unsuccessfully_completed" | "closed"
  ) => void;
  loading?: boolean;
  sendingMessage?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  chat,
  messages,
  currentUserId,
  onSendMessage,
  onFinishChat,
  loading = false,
  sendingMessage = false,
}) => {
  const t = useTranslations("Chat");
  const [localMessages, setLocalMessages] = React.useState<Message[]>(messages);
  const [currentChat, setCurrentChat] = React.useState<Chat>(chat);

  // Обновляем локальное состояние при изменении пропсов
  useEffect(() => {
    setLocalMessages(messages);
    setCurrentChat(chat);
  }, [messages, chat]);

  // Настройка polling для обновления сообщений
  useChatPolling({
    chatId: chat.id,
    onMessagesUpdate: (newMessages) => {
      setLocalMessages(newMessages);
    },
    onChatUpdate: (updatedChat) => {
      setCurrentChat(updatedChat);
    },
    enabled: chat.status === "active", // Polling только для активных чатов
    pollingInterval: 10000, // 10 секунд
  });

  const isChatActive = currentChat.status === "active";

  return (
    <div>
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <ChatHeader
          chat={currentChat}
          onFinishChat={onFinishChat}
          loading={loading}
        />
      </div>

      <div className="flex-1 bg-gray-50">
        <MessageArea
          messages={localMessages}
          currentUserId={currentUserId}
          loading={loading}
        />
      </div>

      <div className="sticky bottom-0 z-20 bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)]">
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
