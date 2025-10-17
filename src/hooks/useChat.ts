import { useState, useCallback } from "react";
import { Chat, Message } from "@/types/chat";
import {
  getUserChats,
  getChatMessages,
  sendMessage,
  markChatAsRead,
  finishChat,
  getUnreadChatsCount,
} from "@/lib/chat-api";

export const useChat = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadChatsCount, setUnreadChatsCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка списка чатов пользователя
  const loadUserChats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userChats = await getUserChats();
      setChats(userChats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chats");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUnreadChatsCount = useCallback(async () => {
    try {
      const { unreadCount } = await getUnreadChatsCount();
      setUnreadChatsCount(unreadCount);
    } catch (err) {
      console.error("Error loading unread chats count:", err);
    }
  }, []);

  const loadChat = useCallback(
    async (chatId: number) => {
      try {
        setLoading(true);
        setError(null);

        // Небольшая задержка для обеспечения готовности токена
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Загружаем сообщения напрямую
        const messages = await getChatMessages(chatId);
        setMessages(messages);

        // Находим чат в списке чатов пользователя
        let chat = chats.find((c) => c.id === chatId);
        console.log(
          "Loading chat:",
          chatId,
          "Found chat:",
          chat,
          "Available chats:",
          chats
        );

        // Если чат не найден в списке, создаем временный объект чата
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

        // Отмечаем все непрочитанные сообщения в чате как прочитанные
        await markChatAsRead(chatId);
      } catch (err) {
        console.error("Error loading chat:", err);
        setError(err instanceof Error ? err.message : "Failed to load chat");
      } finally {
        setLoading(false);
      }
    },
    [chats]
  );

  // Отправка сообщения
  const sendNewMessage = useCallback(async (text: string, chatId: number) => {
    try {
      setError(null);

      // Небольшая задержка для обеспечения готовности токена
      await new Promise((resolve) => setTimeout(resolve, 100));

      const newMessage = await sendMessage({ text, chatId });
      setMessages((prev) => [...prev, newMessage]);

      // Обновляем время последнего обновления чата в списке
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? { ...chat, updatedAt: new Date().toISOString() }
            : chat
        )
      );

      // Обновляем счетчик непрочитанных чатов
      await loadUnreadChatsCount();

      return newMessage;
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err instanceof Error ? err.message : "Failed to send message");
      throw err;
    }
  }, []);

  // Завершение чата
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

  // Очистка текущего чата
  const clearCurrentChat = useCallback(() => {
    setCurrentChat(null);
    setMessages([]);
  }, []);

  return {
    chats,
    currentChat,
    messages,
    unreadChatsCount,
    loading,
    error,
    loadUserChats,
    loadUnreadChatsCount,
    loadChat,
    sendNewMessage,
    finishCurrentChat,
    clearCurrentChat,
  };
};
