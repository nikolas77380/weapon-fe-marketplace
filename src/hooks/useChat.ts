import {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
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
  const [isSwitchingChat, setIsSwitchingChat] = useState(false);
  const lastMarkedReadRef = useRef<number | null>(null);
  const queryClient = useQueryClient();
  // Храним последние сообщения для каждого чата, чтобы не терять данные при обновлении
  const lastMessagesByChatRef = useRef<Map<number, Message[]>>(new Map());
  // Отслеживаем предыдущий chatId для определения переключения чата
  const previousChatIdRef = useRef<number | null>(null);
  // Отслеживаем chatId, для которого мы показываем сообщения
  const displayedChatIdRef = useRef<number | null>(null);

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

  // Отслеживаем состояние видимости страницы для refetch при возвращении
  const wasHiddenRef = useRef(document.hidden);

  // Обработчик возврата фокуса на страницу - делаем refetch сообщений и списка чатов
  useEffect(() => {
    // Инициализируем начальное состояние
    wasHiddenRef.current = document.hidden;

    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;

      // Если страница стала видимой (вернулись на вкладку/приложение)
      if (isVisible && wasHiddenRef.current) {
        // Обновляем список чатов
        if (loadUserChats) {
          loadUserChats();
        }

        // Обновляем сообщения текущего чата, если он есть
        if (currentChatId && messagesQuery.refetch) {
          messagesQuery.refetch();
        }
      }

      wasHiddenRef.current = !isVisible;
    };

    // Добавляем обработчик для desktop и mobile
    // visibilitychange работает на всех платформах (desktop, mobile, tablet)
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Также обрабатываем событие focus для дополнительной надежности
    // Особенно полезно на мобильных устройствах
    const handleFocus = () => {
      if (!document.hidden && wasHiddenRef.current) {
        handleVisibilityChange();
      }
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [currentChatId, messagesQuery.refetch, loadUserChats]);

  // Используем данные из query, но сохраняем последние данные в ref
  // Это предотвращает потерю данных при обновлении
  const messagesFromQuery = messagesQuery.data || [];

  // Отслеживаем переключение чата: используем useLayoutEffect для синхронной установки флага
  useLayoutEffect(() => {
    const chatJustSwitched = currentChatId !== previousChatIdRef.current;

    if (chatJustSwitched) {
      // Чат переключился - сразу очищаем отображаемый chatId и устанавливаем флаг переключения
      displayedChatIdRef.current = null;
      previousChatIdRef.current = currentChatId;

      // Если данных нет в кеше для нового чата, показываем скелетон
      if (messagesFromQuery.length === 0) {
        setIsSwitchingChat(true);
      } else {
        // Если данные есть в кеше, сразу обновляем displayedChatIdRef
        displayedChatIdRef.current = currentChatId;
        setIsSwitchingChat(false);
      }
    }
  }, [currentChatId, messagesFromQuery.length]);

  // Сбрасываем флаг переключения когда данные загружены
  useEffect(() => {
    // Если данные загружены для текущего чата, обновляем displayedChatIdRef и сбрасываем флаг
    if (
      currentChatId &&
      messagesFromQuery.length > 0 &&
      !messagesQuery.isLoading
    ) {
      displayedChatIdRef.current = currentChatId;
      setIsSwitchingChat(false);
    }

    // Также сбрасываем флаг, если загрузка завершилась (даже если сообщений нет)
    if (
      currentChatId &&
      !messagesQuery.isLoading &&
      !messagesQuery.isFetching
    ) {
      displayedChatIdRef.current = currentChatId;
      setIsSwitchingChat(false);
    }
  }, [
    currentChatId,
    messagesFromQuery.length,
    messagesQuery.isLoading,
    messagesQuery.isFetching,
  ]);

  // Сохраняем последние данные для текущего чата и инициализируем displayedChatIdRef
  useEffect(() => {
    if (currentChatId && messagesFromQuery.length > 0) {
      lastMessagesByChatRef.current.set(currentChatId, messagesFromQuery);
      // Если данные загружены и мы еще не показываем этот чат, обновляем displayedChatIdRef
      if (
        displayedChatIdRef.current !== currentChatId &&
        !messagesQuery.isLoading
      ) {
        displayedChatIdRef.current = currentChatId;
      }
    }
  }, [messagesFromQuery, currentChatId, messagesQuery.isLoading]);

  // Получаем последние сохраненные сообщения для текущего чата
  const lastMessages = currentChatId
    ? lastMessagesByChatRef.current.get(currentChatId) || []
    : [];

  // Определяем, происходит ли переключение чата синхронно
  // Это когда chatId изменился, но данные для нового чата еще не загружены
  // Используем ref для сравнения, чтобы не вызывать проблемы с React
  const chatJustSwitched = currentChatId !== previousChatIdRef.current;
  const isSwitchingChatSync =
    chatJustSwitched &&
    messagesFromQuery.length === 0 &&
    messagesQuery.isLoading;

  // Критически важно: показываем сообщения только если они относятся к текущему чату
  // Если displayedChatIdRef не совпадает с currentChatId, значит идет переключение
  // Также проверяем синхронно, не переключился ли чат только что
  const shouldShowMessages =
    currentChatId !== null &&
    !chatJustSwitched && // Не показываем сообщения сразу после переключения
    displayedChatIdRef.current === currentChatId &&
    !isSwitchingChat &&
    !isSwitchingChatSync;

  // Используем данные из query, если они есть, иначе используем последние сохраненные
  // НО: если происходит переключение чата, не показываем старые сообщения
  const messages = shouldShowMessages
    ? messagesFromQuery.length > 0
      ? messagesFromQuery
      : lastMessages
    : [];

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
  // Показываем loading при первой загрузке или при переключении чата
  const loading =
    chatsLoading ||
    (messagesInitialLoading && messages.length === 0) ||
    isSwitchingChat ||
    isSwitchingChatSync;

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
    setIsSwitchingChat(false);
    lastMarkedReadRef.current = null;
    previousChatIdRef.current = null;
    displayedChatIdRef.current = null;
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
