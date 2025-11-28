import { useEffect, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/context/AuthContext";
import { queryKeys } from "@/lib/query-keys";
import { Chat } from "@/types/chat";
import { useUserChatsQuery } from "./useChatQuery";

/**
 * Хук для отслеживания общего количества непрочитанных сообщений через WebSocket
 * Обновляется в реальном времени при получении новых сообщений
 */
export const useUnreadMessagesCount = () => {
  const { socket, chatSocketConnected } = useAuthContext();
  const queryClient = useQueryClient();
  const [unreadCount, setUnreadCount] = useState(0);

  // Загружаем чаты для получения начальных данных
  const { data: chats = [] } = useUserChatsQuery();

  // Функция для пересчета общего количества непрочитанных
  const recalculateTotal = useCallback(() => {
    const chats = queryClient.getQueryData<Chat[]>(queryKeys.chats.list());
    if (chats) {
      const total = chats.reduce(
        (sum, chat) => sum + (chat.unreadCount ?? 0),
        0
      );
      setUnreadCount(total);
    }
  }, [queryClient]);

  // Обновляем счетчик при изменении данных из useUserChatsQuery
  useEffect(() => {
    if (chats) {
      const total = chats.reduce(
        (sum, chat) => sum + (chat.unreadCount ?? 0),
        0
      );
      setUnreadCount(total);
    }
  }, [chats]);

  // Получаем начальное значение из кеша и подписываемся на изменения
  useEffect(() => {
    recalculateTotal();

    // Подписываемся на изменения в кеше для синхронизации
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (
        event?.type === "updated" &&
        event?.query?.queryKey?.[0] === queryKeys.chats.all[0]
      ) {
        recalculateTotal();
      }
    });

    return unsubscribe;
  }, [queryClient, recalculateTotal]);

  // Подписываемся на события WebSocket для обновления в реальном времени
  useEffect(() => {
    if (!socket || !chatSocketConnected) return;

    const handleUnreadUpdated = (data: {
      chatId: string | number;
      unreadCount: number;
    }) => {
      console.log("[useUnreadMessagesCount] Unread count updated:", data);

      // Обновляем кеш для конкретного чата
      queryClient.setQueryData<Chat[]>(
        queryKeys.chats.list(),
        (oldChats = []) => {
          return oldChats.map((chat) =>
            String(chat.id) === String(data.chatId)
              ? { ...chat, unreadCount: data.unreadCount }
              : chat
          );
        }
      );

      // Пересчитываем общее количество
      recalculateTotal();
    };

    const handleNewMessage = (data: any) => {
      // При получении нового сообщения обновляем счетчик
      // Событие unread:updated должно прийти следом, но на всякий случай обновляем
      queryClient.invalidateQueries({
        queryKey: queryKeys.chats.list(),
      });

      // Пересчитываем после небольшой задержки, чтобы дать время обновиться кешу
      setTimeout(recalculateTotal, 100);
    };

    const handleMessageRead = (data: any) => {
      // При прочтении сообщения обновляем счетчик
      queryClient.setQueryData<Chat[]>(
        queryKeys.chats.list(),
        (oldChats = []) => {
          return oldChats.map((chat) =>
            String(chat.id) === String(data.chatId)
              ? { ...chat, unreadCount: 0 }
              : chat
          );
        }
      );

      // Пересчитываем общее количество
      recalculateTotal();
    };

    socket.on("unread:updated", handleUnreadUpdated);
    socket.on("message:new", handleNewMessage);
    socket.on("message:read", handleMessageRead);

    return () => {
      socket.off("unread:updated", handleUnreadUpdated);
      socket.off("message:new", handleNewMessage);
      socket.off("message:read", handleMessageRead);
    };
  }, [socket, chatSocketConnected, queryClient, recalculateTotal]);

  return unreadCount;
};
