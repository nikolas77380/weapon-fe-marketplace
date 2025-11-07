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
import { User } from "@/types/chat";

// Хук для получения списка чатов пользователя
export const useUserChatsQuery = (initialChats?: Chat[]) => {
  const { refreshUnreadCount } = useUnreadChats();

  return useQuery({
    queryKey: queryKeys.chats.list(),
    queryFn: async () => {
      const chats = await getUserChats();
      // Обновляем счетчик непрочитанных после загрузки
      refreshUnreadCount();
      return chats;
    },
    initialData: initialChats,
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
export const useSendMessageMutation = (currentUser?: User) => {
  const queryClient = useQueryClient();
  const { refreshUnreadCount } = useUnreadChats();

  return useMutation({
    mutationFn: async (data: { text: string; chatId: number }) => {
      return await sendMessage(data);
    },
    // Оптимистичное обновление
    onMutate: async ({ text, chatId }) => {
      // Отменяем исходящие запросы для этого чата
      await queryClient.cancelQueries({
        queryKey: queryKeys.chats.messages(chatId),
      });

      // Сохраняем предыдущие сообщения для отката
      const previousMessages = queryClient.getQueryData<Message[]>(
        queryKeys.chats.messages(chatId)
      );

      // Получаем текущий чат из кеша
      const chats = queryClient.getQueryData<Chat[]>(queryKeys.chats.list());
      const currentChat = chats?.find((c) => c.id === chatId);

      // Используем переданного пользователя или берем из чата
      const sender = currentUser || currentChat?.participants?.[0];

      // Создаем временное оптимистичное сообщение
      // Используем отрицательный ID для временных сообщений
      const tempId = -Date.now();
      const optimisticMessage = {
        id: tempId,
        text,
        chat: currentChat || ({} as Chat),
        sender: sender,
        isRead: false,
        readBy: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isOptimistic: true,
      } as Message & { isOptimistic?: boolean };

      // Оптимистично добавляем сообщение
      queryClient.setQueryData<Message[]>(
        queryKeys.chats.messages(chatId),
        (oldMessages = []) => {
          // Проверяем, нет ли уже такого временного сообщения
          const exists = oldMessages.some(
            (msg) =>
              (msg as any).isOptimistic && msg.id === optimisticMessage.id
          );
          if (exists) return oldMessages;
          return [...oldMessages, optimisticMessage];
        }
      );

      // Обновляем список чатов (обновляем updatedAt)
      queryClient.setQueryData<Chat[]>(
        queryKeys.chats.list(),
        (oldChats = []) => {
          return oldChats.map((chat) =>
            chat.id === chatId
              ? { ...chat, updatedAt: new Date().toISOString() }
              : chat
          );
        }
      );

      return { previousMessages };
    },
    onError: (err, variables, context) => {
      // Откатываем при ошибке
      if (context?.previousMessages !== undefined) {
        queryClient.setQueryData(
          queryKeys.chats.messages(variables.chatId),
          context.previousMessages
        );
      }
    },
    onSuccess: async (newMessage, variables) => {
      // Заменяем временное сообщение на реальное
      queryClient.setQueryData<Message[]>(
        queryKeys.chats.messages(variables.chatId),
        (oldMessages = []) => {
          // Удаляем все временные сообщения с таким же текстом
          const filtered = oldMessages.filter(
            (msg) => !(msg as any).isOptimistic || msg.text !== newMessage.text
          );

          // Проверяем, нет ли уже такого сообщения (на случай дубликатов)
          const exists = filtered.some((msg) => msg.id === newMessage.id);
          if (exists) return filtered;

          // Добавляем реальное сообщение
          return [...filtered, newMessage];
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

      // Обновляем hasUnreadMessages для этого чата в списке чатов
      queryClient.setQueryData<Chat[]>(
        queryKeys.chats.list(),
        (oldChats = []) => {
          return oldChats.map((chat) =>
            chat.id === chatId ? { ...chat, hasUnreadMessages: false } : chat
          );
        }
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
