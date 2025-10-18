import { useState, useCallback } from "react";
import { Chat, Message } from "@/types/chat";
import {
  getUserChats,
  getChatMessages,
  sendMessage,
  markChatAsRead,
  finishChat,
} from "@/lib/chat-api";
import { useUnreadChats } from "@/context/UnreadChatsContext";

export const useChat = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refreshUnreadCount } = useUnreadChats();

  // Загрузка списка чатов пользователя
  const loadUserChats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userChats = await getUserChats();
      setChats(userChats);
      // Обновляем счетчик непрочитанных чатов
      await refreshUnreadCount();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chats");
    } finally {
      setLoading(false);
    }
  }, [refreshUnreadCount]);

  const loadChat = useCallback(
    async (chatId: number) => {
      try {
        setLoading(true);
        setError(null);

        await new Promise((resolve) => setTimeout(resolve, 100));

        const messages = await getChatMessages(chatId);
        setMessages(messages);

        let chat = chats.find((c) => c.id === chatId);
        console.log(
          "Loading chat:",
          chatId,
          "Found chat:",
          chat,
          "Available chats:",
          chats
        );

        if (!chat) {
          console.log("Chat not found in list, creating temporary chat object");
          chat = {
            id: chatId,
            topic: "Loading...",
            status: "active" as const,
            participants: [],
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }

        setCurrentChat(chat);

        await markChatAsRead(chatId);

        // Обновляем счетчик непрочитанных чатов
        await refreshUnreadCount();
      } catch (err) {
        console.error("Error loading chat:", err);
        setError(err instanceof Error ? err.message : "Failed to load chat");
      } finally {
        setLoading(false);
      }
    },
    [chats, refreshUnreadCount]
  );

  const sendNewMessage = useCallback(async (text: string, chatId: number) => {
    try {
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const newMessage = await sendMessage({ text, chatId });
      setMessages((prev) => [...prev, newMessage]);

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? { ...chat, updatedAt: new Date().toISOString() }
            : chat
        )
      );

      await refreshUnreadCount();

      return newMessage;
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err instanceof Error ? err.message : "Failed to send message");
      throw err;
    }
  }, []);

  const finishCurrentChat = useCallback(
    async (
      status: "successfully_completed" | "unsuccessfully_completed" | "closed"
    ) => {
      if (!currentChat) return;

      try {
        setLoading(true);
        setError(null);
        const updatedChat = await finishChat(currentChat.id, status);
        setCurrentChat(updatedChat);
        setChats((prev) =>
          prev.map((chat) => (chat.id === currentChat.id ? updatedChat : chat))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to finish chat");
      } finally {
        setLoading(false);
      }
    },
    [currentChat]
  );

  // Очистка т  екущего чата
  const clearCurrentChat = useCallback(() => {
    setCurrentChat(null);
    setMessages([]);
  }, []);

  return {
    chats,
    currentChat,
    messages,
    loading,
    error,
    loadUserChats,
    loadChat,
    sendNewMessage,
    finishCurrentChat,
    clearCurrentChat,
  };
};
