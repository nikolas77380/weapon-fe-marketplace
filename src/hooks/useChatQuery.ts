import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserChats,
  getChatMessages,
  sendMessage,
  markChatAsRead,
  finishChat,
  createChat,
} from "@/lib/chat-api";
import { Chat, Message, CreateChatRequest } from "@/types/chat";
import { queryKeys } from "@/lib/query-keys";
import { useUnreadChats } from "@/context/UnreadChatsContext";

// Хук для получения списка чатов пользователя
export const useUserChatsQuery = () => {
  const { refreshUnreadCount } = useUnreadChats();

  return useQuery({
    queryKey: queryKeys.chats.list(),
    queryFn: async () => {
      const chats = await getUserChats();
      // Обновляем счетчик непрочитанных после загрузки
      refreshUnreadCount();
      return chats;
    },
    staleTime: 30 * 1000, // 30 секунд
    refetchOnWindowFocus: false,
  });
};

// Хук для получения сообщений чата
export const useChatMessagesQuery = (
  chatId: number | null,
  enabled = true,
  chatStatus?: string
) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: queryKeys.chats.messages(chatId || 0),
    queryFn: async () => {
      if (!chatId) return [];
      const messages = await getChatMessages(chatId);
      return messages;
    },
    enabled: enabled && !!chatId,
    staleTime: 10 * 1000, // 10 секунд
    refetchOnWindowFocus: false,
    // Автоматическое обновление для активных чатов (polling)
    refetchInterval: chatStatus === "active" ? 10000 : false, // 10 секунд для активных чатов
    // Используем placeholderData для сохранения старых данных при обновлении
    // Это предотвращает потерю данных во время обновления
    placeholderData: (previousData) => {
      // Всегда возвращаем предыдущие данные, если они есть
      // React Query автоматически использует их как placeholder пока идет загрузка
      return previousData;
    },
    // Гарантируем что данные не теряются при переключении между чатами
    gcTime: 5 * 60 * 1000, // 5 минут
  });
};

// Хук для отправки сообщения
export const useSendMessageMutation = () => {
  const queryClient = useQueryClient();
  const { refreshUnreadCount } = useUnreadChats();

  return useMutation({
    mutationFn: async (data: { text: string; chatId: number }) => {
      return await sendMessage(data);
    },
    onSuccess: async (newMessage, variables) => {
      // Обновляем список сообщений в кеше
      queryClient.setQueryData<Message[]>(
        queryKeys.chats.messages(variables.chatId),
        (oldMessages = []) => {
          // Проверяем, нет ли уже такого сообщения (на случай дубликатов)
          const exists = oldMessages.some((msg) => msg.id === newMessage.id);
          if (exists) return oldMessages;
          return [...oldMessages, newMessage];
        }
      );

      // Обновляем список чатов
      queryClient.setQueryData<Chat[]>(
        queryKeys.chats.list(),
        (oldChats = []) => {
          return oldChats.map((chat) =>
            chat.id === variables.chatId
              ? { ...chat, updatedAt: new Date().toISOString() }
              : chat
          );
        }
      );

      // Делаем refetch сообщений, чтобы получить обновленные данные с сервера
      // Это важно для получения актуальных данных, включая обновления от других участников
      await queryClient.refetchQueries({
        queryKey: queryKeys.chats.messages(variables.chatId),
      });

      await refreshUnreadCount();
    },
  });
};

// Хук для отметки чата как прочитанного
export const useMarkChatAsReadMutation = () => {
  const queryClient = useQueryClient();
  const { refreshUnreadCount } = useUnreadChats();

  return useMutation({
    mutationFn: async (chatId: number) => {
      return await markChatAsRead(chatId);
    },
    onSuccess: async (messages, chatId) => {
      // Обновляем сообщения в кеше
      queryClient.setQueryData<Message[]>(
        queryKeys.chats.messages(chatId),
        messages
      );

      await refreshUnreadCount();
    },
  });
};

// Хук для завершения чата
export const useFinishChatMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      chatId,
      status,
    }: {
      chatId: number;
      status: "successfully_completed" | "unsuccessfully_completed" | "closed";
    }) => {
      return await finishChat(chatId, status);
    },
    onSuccess: (updatedChat) => {
      // Обновляем список чатов
      queryClient.setQueryData<Chat[]>(
        queryKeys.chats.list(),
        (oldChats = []) => {
          return oldChats.map((chat) =>
            chat.id === updatedChat.id ? updatedChat : chat
          );
        }
      );
    },
  });
};

// Хук для создания чата
export const useCreateChatMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateChatRequest) => {
      return await createChat(data);
    },
    onSuccess: (newChat) => {
      // Добавляем новый чат в список
      queryClient.setQueryData<Chat[]>(
        queryKeys.chats.list(),
        (oldChats = []) => {
          // Проверяем, нет ли уже такого чата
          const exists = oldChats.some((chat) => chat.id === newChat.id);
          if (exists) {
            return oldChats.map((chat) =>
              chat.id === newChat.id ? newChat : chat
            );
          }
          return [newChat, ...oldChats];
        }
      );
    },
  });
};
