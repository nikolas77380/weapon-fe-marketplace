"use client";

import React, { useEffect } from "react";
import { Chat } from "@/types/chat";
import { useChat } from "@/hooks/useChat";
import { ChatList } from "./ChatList";
import { ChatInterface } from "./ChatInterface";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, AlertCircle } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { useTranslations } from "next-intl";

export const ChatApp: React.FC = () => {
  const { currentUser } = useAuthContext();
  const t = useTranslations("Chat");

  const {
    chats,
    currentChat,
    messages,
    loading,
    error,
    loadUserChats,
    loadChat,
    sendNewMessage,
    finishCurrentChat,
  } = useChat();

  // Загружаем чаты при монтировании компонента
  useEffect(() => {
    if (currentUser) {
      loadUserChats();
    }
  }, [loadUserChats, currentUser]);

  // Если пользователь не авторизован, показываем сообщение
  if (!currentUser) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="h-16 w-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">{t("authRequired")}</h3>
          <p className="text-gray-500 mb-4">{t("authRequiredDescription")}</p>
          <Button asChild>
            <a href="/auth">{t("loginButton")}</a>
          </Button>
        </div>
      </div>
    );
  }

  const handleChatSelect = async (chat: Chat) => {
    try {
      await loadChat(chat.id, currentUser?.id);
    } catch (error) {
      console.error("Failed to load chat:", error);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!currentChat) return;

    try {
      await sendNewMessage(text, currentChat.id);
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  };

  const handleFinishChat = async (
    status: "successfully_completed" | "unsuccessfully_completed" | "closed"
  ) => {
    if (!currentChat) return;

    try {
      await finishCurrentChat(status);
    } catch (error) {
      console.error("Failed to finish chat:", error);
    }
  };

  if (error) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("loadingError")}</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={loadUserChats}>{t("retryButton")}</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full flex">
      {/* Боковая панель со списком чатов */}
      <div className="w-80 border-r bg-gray-50 flex flex-col">
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">{t("title")}</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <ChatList
            chats={chats}
            currentChatId={currentChat?.id}
            onChatSelect={handleChatSelect}
            loading={loading}
          />
        </div>
      </div>

      {/* Основная область чата */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <ChatInterface
            chat={currentChat}
            messages={messages}
            currentUserId={currentUser?.id}
            onSendMessage={handleSendMessage}
            onFinishChat={handleFinishChat}
            loading={loading}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("selectChat")}</h3>
              <p className="text-gray-500 mb-4">{t("selectChatDescription")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
