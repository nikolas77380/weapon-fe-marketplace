import { useState, useCallback, useEffect, useRef } from "react";
import { Chat, Message } from "@/types/chat";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  useUserChatsQuery,
  useChatMessagesQuery,
  useSendMessageMutation,
  useMarkChatAsReadMutation,
  useFinishChatMutation,
} from "./useChatQuery";

export const useChat = () => {
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const lastMarkedReadRef = useRef<number | null>(null);
  const queryClient = useQueryClient();
  // Храним последние сообщения для каждого чата, чтобы не терять данные при обновлении
  const lastMessagesByChatRef = useRef<Map<number, Message[]>>(new Map());

  // Загрузка списка чатов
  const {
    data: chats = [],
    isLoading: chatsLoading,
    error: chatsError,
    refetch: loadUserChats,
  } = useUserChatsQuery();

  // Получаем статус текущего чата для polling
  const currentChatStatus = currentChatId
    ? chats.find((c) => c.id === currentChatId)?.status
    : undefined;

  // Загрузка сообщений чата
  const messagesQuery = useChatMessagesQuery(
    currentChatId,
    !!currentChatId,
    currentChatStatus
  );

  // Используем данные из query, но сохраняем последние данные в ref
  // Это предотвращает потерю данных при обновлении
  const messagesFromQuery = messagesQuery.data || [];

  // Сохраняем последние данные для текущего чата
  useEffect(() => {
    if (currentChatId && messagesFromQuery.length > 0) {
      lastMessagesByChatRef.current.set(currentChatId, messagesFromQuery);
    }
  }, [messagesFromQuery, currentChatId]);

  // Получаем последние сохраненные сообщения для текущего чата
  const lastMessages = currentChatId
    ? lastMessagesByChatRef.current.get(currentChatId) || []
    : [];

  // Используем данные из query, если они есть, иначе используем последние сохраненные
  // Это гарантирует что данные не теряются во время обновления текущего чата
  const messages =
    messagesFromQuery.length > 0 ? messagesFromQuery : lastMessages;

  const messagesInitialLoading = messagesQuery.isLoading;
  const messagesFetching = messagesQuery.isFetching;
  const messagesError = messagesQuery.error;

  // Мутации
  const sendMessageMutation = useSendMessageMutation();
  const markAsReadMutation = useMarkChatAsReadMutation();
  const finishChatMutation = useFinishChatMutation();

  // Автоматическая отметка как прочитанного при загрузке чата
  useEffect(() => {
    if (
      currentChatId &&
      messages.length > 0 &&
      !messagesInitialLoading &&
      lastMarkedReadRef.current !== currentChatId
    ) {
      // Отмечаем как прочитанный только один раз после загрузки
      markAsReadMutation.mutate(currentChatId);
      lastMarkedReadRef.current = currentChatId;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChatId, messages.length, messagesInitialLoading]);

  // Получаем текущий чат из списка
  const currentChat = currentChatId
    ? chats.find((c) => c.id === currentChatId) || null
    : null;

  // Комбинированные состояния loading
  // Показываем loading только при первой загрузке, когда нет данных
  // Если у нас уже есть сообщения (из кеша), не показываем loading
  const loading =
    chatsLoading || (messagesInitialLoading && messages.length === 0);

  // Комбинированный error
  const error = chatsError?.message || messagesError?.message || undefined;

  const loadChat = useCallback(async (chatId: number) => {
    setCurrentChatId(chatId);
    // Данные будут загружены автоматически через useChatMessagesQuery
  }, []);

  const sendNewMessage = useCallback(
    async (text: string, chatId: number) => {
      try {
        await sendMessageMutation.mutateAsync({ text, chatId });
      } catch (err) {
        throw err;
      }
    },
    [sendMessageMutation]
  );

  const finishCurrentChat = useCallback(
    async (
      status: "successfully_completed" | "unsuccessfully_completed" | "closed"
    ) => {
      if (!currentChatId) return;
      try {
        await finishChatMutation.mutateAsync({ chatId: currentChatId, status });
      } catch (err) {
        throw err;
      }
    },
    [currentChatId, finishChatMutation]
  );

  const clearCurrentChat = useCallback(() => {
    setCurrentChatId(null);
    lastMarkedReadRef.current = null;
    // Не очищаем сохраненные сообщения, они могут понадобиться при возврате к чату
  }, []);

  return {
    chats,
    currentChat,
    messages,
    loading,
    isFetching: messagesFetching, // Для отслеживания обновлений без показа скелетона
    error,
    loadUserChats,
    loadChat,
    sendNewMessage,
    finishCurrentChat,
    clearCurrentChat,
  };
};
