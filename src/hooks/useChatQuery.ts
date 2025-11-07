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
    // Это критически важно для предотвращения мерцания при refetch
    placeholderData: (previousData) => previousData,
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
      // Если currentUser не определен, не создаем оптимистичное сообщение
      // Это предотвратит неправильное позиционирование сообщения
      if (!currentUser) {
        return { previousMessages: [] };
      }

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

      // Используем только переданного пользователя - это гарантирует правильное позиционирование
      // Убеждаемся, что sender имеет все необходимые поля
      const sender: User = {
        id: currentUser.id,
        username: currentUser.username,
        email: currentUser.email,
        displayName: currentUser.displayName || currentUser.username,
        confirmed: currentUser.confirmed,
        blocked: currentUser.blocked,
        createdAt: currentUser.createdAt,
        updatedAt: currentUser.updatedAt,
        metadata: currentUser.metadata,
      };

      // Создаем временное оптимистичное сообщение
      // Используем отрицательный ID для временных сообщений
      const tempId = -Date.now();
      // Время для оптимистичного сообщения - используем текущее время клиента
      // Реальное сообщение с сервера будет иметь серверное время
      // При замене на реальное сообщение время обновится автоматически
      const optimisticMessage = {
        id: tempId,
        text,
        chat: currentChat || ({} as Chat),
        sender: sender,
        isRead: false,
        readBy: [],
        createdAt: new Date().toISOString(), // Время клиента для оптимистичного обновления
        updatedAt: new Date().toISOString(),
        isOptimistic: true,
        isSending: true, // Флаг для отображения индикатора отправки
      } as Message & { isOptimistic?: boolean; isSending?: boolean };

      // Оптимистично добавляем сообщение
      // Сообщения уже отсортированы с бэка (старые -> новые), просто добавляем в конец
      queryClient.setQueryData<Message[]>(
        queryKeys.chats.messages(chatId),
        (oldMessages = []) => {
          // Проверяем, нет ли уже такого временного сообщения
          const exists = oldMessages.some(
            (msg) =>
              (msg as any).isOptimistic && msg.id === optimisticMessage.id
          );
          if (exists) return oldMessages;

          // Добавляем оптимистичное сообщение в конец (оно самое новое)
          // Сортировка не нужна - сообщения уже отсортированы с бэка
          return [...oldMessages, optimisticMessage];
        }
      );

      // Оптимистично обновляем время в списке чатов для немедленного отображения
      queryClient.setQueryData<Chat[]>(
        queryKeys.chats.list(),
        (oldChats = []) => {
          return oldChats.map((chat) => {
            if (chat.id !== chatId) {
              return chat;
            }

            // Обновляем messages в чате - оптимистичное сообщение должно быть первым
            const existingMessages = chat.messages || [];
            // Удаляем другие оптимистичные сообщения с таким же текстом, если есть
            const messagesWithoutOptimistic = existingMessages.filter(
              (m) =>
                !(m as any).isOptimistic || m.text !== optimisticMessage.text
            );
            const updatedMessages = [
              optimisticMessage,
              ...messagesWithoutOptimistic,
            ];

            return {
              ...chat,
              updatedAt: optimisticMessage.createdAt, // Временно используем время клиента
              messages: updatedMessages, // Обновляем список сообщений
            };
          });
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
      // Заменяем временное сообщение на реальное, сохраняя все старые сообщения
      queryClient.setQueryData<Message[]>(
        queryKeys.chats.messages(variables.chatId),
        (oldMessages = []) => {
          // Если старых сообщений нет, просто возвращаем новое
          if (!oldMessages || oldMessages.length === 0) {
            return [newMessage];
          }

          // Сохраняем все старые сообщения, которые не являются оптимистичными с таким же текстом
          // Это гарантирует, что все реальные сообщения сохраняются
          const messagesWithoutOptimistic = oldMessages.filter((msg) => {
            // Сохраняем все сообщения, которые:
            // 1. Не являются оптимистичными ИЛИ
            // 2. Являются оптимистичными, но с другим текстом
            const isOptimistic = (msg as any).isOptimistic;
            const hasSameText = msg.text === newMessage.text;
            return !isOptimistic || !hasSameText;
          });

          // Проверяем, нет ли уже такого сообщения (на случай дубликатов)
          const exists = messagesWithoutOptimistic.some(
            (msg) => msg.id === newMessage.id
          );
          if (exists) {
            // Если сообщение уже есть, просто возвращаем список без оптимистичных
            return messagesWithoutOptimistic;
          }

          // Добавляем реальное сообщение в конец (оно самое новое)
          // Сортировка не нужна - сообщения уже отсортированы с бэка (старые -> новые)
          return [...messagesWithoutOptimistic, newMessage];
        }
      );

      // Обновляем список чатов с правильным временем из ответа сервера
      // updatedAt теперь обновляется на бэкенде, но мы обновляем его в кеше для немедленного отображения
      queryClient.setQueryData<Chat[]>(
        queryKeys.chats.list(),
        (oldChats = []) => {
          return oldChats.map((chat) => {
            if (chat.id !== variables.chatId) {
              return chat;
            }

            // Обновляем messages в чате для отображения последнего сообщения в списке
            // (если messages есть в кеше)
            const existingMessages = chat.messages || [];
            // Удаляем оптимистичные сообщения с таким же текстом и дубликаты
            const messagesWithoutDuplicate = existingMessages.filter((m) => {
              // Удаляем оптимистичные сообщения с таким же текстом
              if ((m as any).isOptimistic && m.text === newMessage.text) {
                return false;
              }
              // Удаляем дубликаты по ID
              if (m.id === newMessage.id) {
                return false;
              }
              return true;
            });
            // Новое сообщение всегда первое (самое новое)
            const updatedMessages = [newMessage, ...messagesWithoutDuplicate];

            return {
              ...chat,
              // Используем время из ответа сервера для updatedAt
              // Это будет синхронизировано с бэкендом, который также обновляет updatedAt
              updatedAt: newMessage.createdAt,
              messages: updatedMessages, // Обновляем список сообщений для отображения в списке
            };
          });
        }
      );

      // Инвалидируем список чатов, чтобы обновления применились
      // Это гарантирует, что изменения в chat.updatedAt и chat.messages отобразятся
      queryClient.invalidateQueries({
        queryKey: queryKeys.chats.list(),
        refetchType: "none", // Не делаем refetch, только инвалидируем для обновления кеша
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
