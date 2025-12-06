"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import LoadingState from "@/components/ui/LoadingState";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { useUserChatsQuery, useChatMessagesQuery } from "@/hooks/useChatQuery";
import { useChatParticipants } from "@/hooks/useChatParticipants";
import { queryKeys } from "@/lib/query-keys";
import { Chat, Message } from "@/types/chat";
import { Send, ArrowLeft, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatList, ChatFilter } from "./ChatList";
import { ChatListSkeleton } from "./ChatListSkeleton";
import { MessageItem } from "./MessageItem";
import { ProductContext } from "./ProductContext";
import { MessageComposer } from "./MessageComposer";
import { Avatar } from "./Avatar";
import { normalizeToIsoString } from "@/lib/date-helpers";
import { ChatDetailSkeleton } from "./ChatDetailSkeleton";

const Messages = () => {
  const {
    currentUser,
    currentUserLoading,
    chatSocketConnected,
    socket,
    reconnectChatSocket,
  } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("Chat");
  const queryClient = useQueryClient();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // Получаем chatId из URL при загрузке
  const chatIdFromUrl = searchParams.get("chatId");

  const [selectedChatId, setSelectedChatId] = useState<string | number | null>(
    chatIdFromUrl
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());
  const [activeFilter, setActiveFilter] = useState<ChatFilter>("all");
  const [pendingProductId, setPendingProductId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastReconnectAttemptRef = useRef<number>(0);
  const productContextChatIdRef = useRef<string | null>(null);
  // Получаем список чатов пользователя
  const {
    data: chats = [],
    isLoading: chatsLoading,
    isFetching: chatsFetching,
    isFetched: chatsFetched,
    error: chatsError,
  } = useUserChatsQuery();

  console.log("[Messages] Chats loaded:", {
    chatsCount: chats.length,
    chats: chats.slice(0, 3).map((c) => ({ id: c.id, productId: c.productId })),
  });

  // Загружаем данные собеседников для чатов
  const {
    chats: chatsWithParticipants,
    isLoading: participantsLoading,
    isError: participantsError,
  } = useChatParticipants(chats, currentUser?.id);

  // Получаем сообщения выбранного чата
  const { data: messages = [], isLoading: messagesLoading } =
    useChatMessagesQuery(selectedChatId as number | null, !!selectedChatId);

  // Синхронизируем URL с выбранным чатом
  useEffect(() => {
    const currentChatIdInUrl = searchParams.get("chatId");
    if (selectedChatId && String(selectedChatId) !== currentChatIdInUrl) {
      // Обновляем URL при выборе чата
      const params = new URLSearchParams(searchParams.toString());
      params.set("chatId", String(selectedChatId));
      const next = params.toString();
      router.push(next ? `${pathname}?${next}` : pathname, { scroll: false });
    } else if (!selectedChatId && currentChatIdInUrl) {
      // Убираем chatId из URL при сбросе выбора
      const params = new URLSearchParams(searchParams.toString());
      params.delete("chatId");
      const next = params.toString();
      router.push(next ? `${pathname}?${next}` : pathname, { scroll: false });
    }
  }, [selectedChatId, searchParams, router, pathname]);

  // Считываем productId из URL (если пользователь пришел из карточки товара)
  useEffect(() => {
    const productParam = searchParams.get("productId");
    const chatParam = searchParams.get("chatId");

    if (productParam && chatParam) {
      const numericProductId = Number(productParam);
      if (!Number.isNaN(numericProductId)) {
        if (
          pendingProductId !== numericProductId ||
          productContextChatIdRef.current !== chatParam
        ) {
          setPendingProductId(numericProductId);
          productContextChatIdRef.current = chatParam;
        }
      }
    }

    if (!productParam && pendingProductId !== null) {
      setPendingProductId(null);
      productContextChatIdRef.current = null;
    }
  }, [searchParams, pendingProductId]);

  // Очищаем pendingProductId, если контекст уже добавлен на сервере (например, в существующем чате)
  useEffect(() => {
    if (
      pendingProductId === null ||
      !selectedChatId ||
      productContextChatIdRef.current !== String(selectedChatId)
    ) {
      return;
    }

    const latestProductMessage = [...messages]
      .reverse()
      .find(
        (message) =>
          message.product?.id === pendingProductId &&
          (!message.text || !message.text.trim())
      );

    if (latestProductMessage) {
      setPendingProductId(null);
      productContextChatIdRef.current = null;

      const params = new URLSearchParams(searchParams.toString());
      params.delete("productId");
      const next = params.toString();
      router.replace(next ? `${pathname}?${next}` : pathname, {
        scroll: false,
      });
    }
  }, [
    messages,
    pendingProductId,
    selectedChatId,
    searchParams,
    router,
    pathname,
  ]);

  const chatCounts = useMemo(
    () => ({
      all: chatsWithParticipants.length,
      unread: chatsWithParticipants.filter((chat: any) => chat.unreadCount > 0)
        .length,
      favorites: chatsWithParticipants.filter((chat: any) => chat.isFavorite)
        .length,
      archived: chatsWithParticipants.filter((chat: any) => chat.isArchived)
        .length,
    }),
    [chatsWithParticipants]
  );

  // Фильтруем чаты по активному фильтру и поисковому запросу
  const filteredChats = chatsWithParticipants.filter((chat: any) => {
    // Фильтр по поисковому запросу
    const displayName = chat.participantCompany
      ? `${chat.participantName} (${chat.participantCompany})`
      : chat.participantName || "";
    const matchesSearch = displayName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Фильтр по типу
    switch (activeFilter) {
      case "unread":
        return chat.unreadCount > 0;
      case "favorites":
        return chat.isFavorite === true;
      case "archived":
        return chat.isArchived === true;
      case "all":
      default:
        return true;
    }
  });

  // Находим выбранный чат и текущий продукт из контекста
  const selectedChat = chatsWithParticipants.find(
    (chat: any) => chat.id === selectedChatId
  );
  const initialProductId =
    selectedChat?.product?.id ?? selectedChat?.productId ?? null;
  const isChatDetailLoading = messagesLoading;

  // Автоподключение сокета при его отсутствии
  useEffect(() => {
    if (!currentUser || chatSocketConnected) {
      return;
    }

    const now = Date.now();
    if (now - lastReconnectAttemptRef.current < 5000) {
      return;
    }

    lastReconnectAttemptRef.current = now;
    reconnectChatSocket?.();
  }, [currentUser, chatSocketConnected, reconnectChatSocket]);

  // Прокрутка к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Автоматически отмечаем сообщения как прочитанные при открытии чата
  useEffect(() => {
    if (!selectedChatId || !socket || !chatSocketConnected) return;

    const timer = setTimeout(() => {
      socket.emit("message:mark-read", {
        chatId: String(selectedChatId),
      });

      // Обновляем локальный счетчик непрочитанных
      queryClient.setQueryData<Chat[]>(queryKeys.chats.list(), (oldChats) =>
        oldChats
          ? oldChats.map((chat) =>
              chat.id === selectedChatId ? { ...chat, unreadCount: 0 } : chat
            )
          : []
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedChatId, socket, chatSocketConnected, queryClient]);

  // Слушаем новые сообщения
  useEffect(() => {
    if (!socket || !chatSocketConnected) return;

    const handleNewMessage = (data: any) => {
      const senderId = data.sender_id ?? data.senderId;
      const productIdPayload = data.product_id ?? data.productId;
      const normalizedCreatedAt = normalizeToIsoString(
        data.createdAt || data.created_at || new Date().toISOString()
      );

      // Обновляем сообщения если это текущий чат
      if (data.chatId && String(data.chatId) === String(selectedChatId)) {
        // Немедленно добавляем сообщение в кеш
        queryClient.setQueryData<Message[]>(
          queryKeys.chats.messages(selectedChatId as number),
          (oldMessages = []) => {
            // Проверяем, не добавлено ли уже это сообщение
            const messageExists = oldMessages.some(
              (msg) => String(msg.id) === String(data.id)
            );
            if (messageExists) return oldMessages;

            const newMessage: Message = {
              id: data.id,
              text: data.text,
              sender_id: senderId,
              chat: {} as Chat,
              isRead: false,
              readBy: [],
              product: productIdPayload
                ? {
                    id: productIdPayload,
                    title: "",
                    slug: "",
                  }
                : undefined,
              createdAt: normalizedCreatedAt,
              updatedAt: normalizedCreatedAt,
            };

            return [...oldMessages, newMessage];
          }
        );

        // Автоматически отмечаем как прочитанное если это не наше сообщение
        if (senderId !== currentUser?.id) {
          setTimeout(() => {
            socket.emit("message:mark-read", {
              chatId: String(selectedChatId),
            });
          }, 500);
        }
      }

      // Обновляем список чатов (для счетчиков и последнего сообщения)
      queryClient.invalidateQueries({
        queryKey: queryKeys.chats.list(),
      });
    };

    const handleUnreadUpdated = (data: any) => {
      console.log("[Messages] Unread count updated:", data);

      // Обновляем список чатов
      queryClient.invalidateQueries({
        queryKey: queryKeys.chats.list(),
      });
    };

    const handleMessageRead = (data: any) => {
      console.log("[Messages] Message marked as read:", data);

      // Обновляем статусы сообщений в текущем чате
      if (String(data.chatId) === String(selectedChatId)) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.chats.messages(selectedChatId as number),
        });
      }
    };

    socket.on("message:new", handleNewMessage);
    socket.on("unread:updated", handleUnreadUpdated);
    socket.on("message:read", handleMessageRead);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("unread:updated", handleUnreadUpdated);
      socket.off("message:read", handleMessageRead);
    };
  }, [
    socket,
    chatSocketConnected,
    queryClient,
    selectedChatId,
    currentUser?.id,
  ]);

  // Отслеживание онлайн статусов
  useEffect(() => {
    if (!socket || !chatSocketConnected) return;

    // Запрашиваем список онлайн пользователей при подключении
    socket.emit(
      "users:online",
      (response: { success?: boolean; users?: number[] }) => {
        console.log("[Messages] Online users response:", response);
        if (response.success && response.users) {
          setOnlineUsers(new Set(response.users));
        }
      }
    );

    const handleUserOnline = (data: { userId: number }) => {
      console.log("[Messages] User came online:", data.userId);
      setOnlineUsers((prev) => new Set([...prev, data.userId]));
    };

    const handleUserOffline = (data: { userId: number }) => {
      console.log("[Messages] User went offline:", data.userId);
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(data.userId);
        return next;
      });
    };

    socket.on("user:online", handleUserOnline);
    socket.on("user:offline", handleUserOffline);

    return () => {
      socket.off("user:online", handleUserOnline);
      socket.off("user:offline", handleUserOffline);
    };
  }, [socket, chatSocketConnected]);

  // Отправка сообщения
  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChatId) {
      return;
    }

    if (!socket || !chatSocketConnected) {
      console.warn("[Messages] Socket unavailable, attempting reconnect");
      reconnectChatSocket?.();
      return;
    }

    const chatIdStr = String(selectedChatId);

    const shouldAttachProduct =
      pendingProductId !== null &&
      productContextChatIdRef.current === chatIdStr;

    const payload: {
      chatId: string;
      text: string;
      productId?: number;
    } = {
      chatId: chatIdStr,
      text: messageText.trim(),
    };

    if (shouldAttachProduct) {
      payload.productId = pendingProductId;
    }

    // Отправляем сообщение через WebSocket
    socket.emit("message:send", payload);

    setMessageText("");

    if (shouldAttachProduct) {
      setPendingProductId(null);
      productContextChatIdRef.current = null;

      const params = new URLSearchParams(searchParams.toString());
      params.delete("productId");
      const next = params.toString();
      router.replace(next ? `${pathname}?${next}` : pathname, {
        scroll: false,
      });
    }

    // Обновляем список чатов после отправки
    setTimeout(() => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.chats.list(),
      });
      // Обновляем сообщения чтобы получить актуальное время с сервера
      queryClient.invalidateQueries({
        queryKey: queryKeys.chats.messages(selectedChatId as number),
      });
    }, 300);
  };

  // Обработчики контекстного меню чата
  const handleMarkAsRead = (chatId: string | number) => {
    console.log("[Messages] Mark as read:", chatId);
    if (!socket || !chatSocketConnected) return;

    socket.emit("message:mark-read", {
      chatId: String(chatId),
    });

    // Обновляем локальный счетчик
    queryClient.setQueryData<Chat[]>(queryKeys.chats.list(), (oldChats) =>
      oldChats
        ? oldChats.map((chat) =>
            chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
          )
        : []
    );
  };

  const handleArchive = async (chatId: string | number) => {
    console.log("[Messages] Archive chat:", chatId);

    // Находим чат для определения текущего состояния
    const chat = chatsWithParticipants.find((c: any) => c.id === chatId);
    const newArchivedState = !chat?.isArchived;

    try {
      // Импортируем API метод динамически
      const { toggleChatArchive } = await import("@/lib/chat-api");
      await toggleChatArchive(chatId, newArchivedState);

      // Обновляем локальные данные
      queryClient.setQueryData<Chat[]>(queryKeys.chats.list(), (oldChats) =>
        oldChats
          ? oldChats.map((chat) =>
              chat.id === chatId
                ? { ...chat, isArchived: newArchivedState }
                : chat
            )
          : []
      );

      // Инвалидируем запрос для обновления с сервера
      queryClient.invalidateQueries({
        queryKey: queryKeys.chats.list(),
      });
    } catch (error) {
      console.error("[Messages] Failed to archive chat:", error);
    }
  };

  const handleFavorite = async (chatId: string | number) => {
    console.log("[Messages] Favorite chat:", chatId);

    // Находим чат для определения текущего состояния
    const chat = chatsWithParticipants.find((c: any) => c.id === chatId);
    const newFavoriteState = !chat?.isFavorite;

    try {
      // Импортируем API метод динамически
      const { toggleChatFavorite } = await import("@/lib/chat-api");
      await toggleChatFavorite(chatId, newFavoriteState);

      // Обновляем локальные данные
      queryClient.setQueryData<Chat[]>(queryKeys.chats.list(), (oldChats) =>
        oldChats
          ? oldChats.map((chat) =>
              chat.id === chatId
                ? { ...chat, isFavorite: newFavoriteState }
                : chat
            )
          : []
      );

      // Инвалидируем запрос для обновления с сервера
      queryClient.invalidateQueries({
        queryKey: queryKeys.chats.list(),
      });
    } catch (error) {
      console.error("[Messages] Failed to favorite chat:", error);
    }
  };

  const handleDeleteChat = (chatId: string | number) => {
    console.log("[Messages] Delete chat:", chatId);
    // TODO: Implement delete functionality with confirmation
  };

  // Форматирование времени для сообщений
  const formatMessageTime = (dateString: string | undefined): string => {
    if (!dateString) {
      return t("timeFormat.now");
    }

    try {
      const date = new Date(normalizeToIsoString(dateString));
      const now = new Date();

      if (isNaN(date.getTime())) {
        return t("timeFormat.now");
      }

      const diffInMs = now.getTime() - date.getTime();

      if (diffInMs < 0) {
        return t("timeFormat.now");
      }

      const diffInSeconds = Math.floor(diffInMs / 1000);
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInSeconds < 10) {
        return t("timeFormat.justNow");
      }

      if (diffInMinutes < 1) {
        return t("timeFormat.now");
      }
      if (diffInMinutes < 60) {
        return t("timeFormat.minutesShort", { count: diffInMinutes });
      }
      if (diffInHours < 24) {
        return t("timeFormat.hoursShort", { count: diffInHours });
      }
      if (diffInDays < 7) {
        return t("timeFormat.daysShort", { count: diffInDays });
      }

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting message time:", error);
      return t("timeFormat.now");
    }
  };

  // Функция для получения даты сообщения (для разделителей дней)
  const getMessageDateLabel = (
    dateString: string | undefined
  ): string | null => {
    if (!dateString) return null;

    try {
      const date = new Date(normalizeToIsoString(dateString));
      const now = new Date();

      if (isNaN(date.getTime())) return null;

      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const messageDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );

      if (messageDate.getTime() === today.getTime()) {
        return t("timeFormat.today");
      }
      if (messageDate.getTime() === yesterday.getTime()) {
        return t("timeFormat.yesterday");
      }

      return date.toLocaleDateString("uk-UA", {
        day: "numeric",
        month: "long",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    } catch (error) {
      console.error("Error getting message date label:", error);
      return null;
    }
  };

  // Проверка, нужно ли показывать разделитель дня
  const shouldShowDaySeparator = (
    currentMessage: Message,
    previousMessage: Message | null
  ): boolean => {
    if (!previousMessage) return true;

    const currentDate = getMessageDateLabel(currentMessage.createdAt);
    const previousDate = getMessageDateLabel(previousMessage.createdAt);

    return currentDate !== previousDate;
  };

  const isInitialChatsLoading =
    (chatsLoading || chatsFetching) && !chatsFetched;

  // Блокируем скролл страницы на /messages
  // Редирект на логин, если пользователь не авторизован
  useEffect(() => {
    if (!currentUserLoading && !currentUser) {
      router.push("/auth?mode=login");
    }
  }, [currentUser, currentUserLoading, router]);

  const navbarHeight = 64;
  const keyboardOffset = isKeyboardOpen ? 300 : 0; // fixed keyboard height per requirement

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    position: "fixed",
    top: `${navbarHeight}px`, // keep under navbar
    left: 0,
    right: 0,
    bottom: 0,
    height: `calc(100dvh - ${navbarHeight}px - ${keyboardOffset}px)`,
    overflow: "hidden", // prevent container scroll
    background: "white",
  };

  const handleComposerFocus = useCallback(() => {
    if (typeof window !== "undefined" && window.innerWidth <= 1024) {
      setIsKeyboardOpen(true);
      // Scroll page to top to keep headers visible when keyboard opens.
      // Do an immediate jump and a follow-up to handle Safari keyboard reflow.
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 80);
      });
    }
  }, []);

  const handleComposerBlur = useCallback(() => {
    setIsKeyboardOpen(false);
  }, []);

  if (currentUserLoading || isInitialChatsLoading) {
    return (
      <div
        ref={containerRef}
        className="flex bg-white overflow-hidden"
        style={containerStyle}
      >
        {/* Левая панель (skeletoн) */}
        <div className="w-full md:w-96 border-r border-gray-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse" />
          </div>
          <div className="flex-1 overflow-y-auto">
            <ChatListSkeleton count={6} t={t} />
          </div>
        </div>

        {/* Правая панель (скелетон) */}
        <div className="hidden md:flex flex-1">
          <ChatDetailSkeleton messageCount={6} />
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="flex bg-white overflow-hidden"
      style={containerStyle}
    >
      {/* Левая панель: Список чатов */}
      <div
        className={cn(
          "w-full md:w-96 border-r border-gray-200 flex flex-col overflow-hidden",
          selectedChatId ? "hidden md:flex" : "flex"
        )}
        style={{ minHeight: 0 }}
      >
        <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            {t("messages") || "Messages"}
          </h2>
          <MessageSquare className="h-5 w-5" />
        </div>

        <div className="flex-1 overflow-y-auto">
          {chatsError || participantsError ? (
            <div className="text-center py-8 text-red-500">
              <p className="font-semibold">{t("errorLoadingChats")}</p>
            </div>
          ) : participantsLoading || isInitialChatsLoading ? (
            <ChatListSkeleton count={5} t={t} />
          ) : (
            <ChatList
              chats={filteredChats}
              selectedChatId={selectedChatId}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onChatSelect={setSelectedChatId}
              onlineUsers={onlineUsers}
              t={t}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              onMarkAsRead={handleMarkAsRead}
              onArchive={handleArchive}
              onFavorite={handleFavorite}
              onDelete={handleDeleteChat}
              chatCounts={chatCounts}
            />
          )}
        </div>
      </div>

      {/* Правая панель: Окно сообщений */}
      <div
        className={cn(
          "flex-1 flex flex-col bg-white",
          selectedChatId ? "flex" : "hidden md:flex"
        )}
        style={{
          display: selectedChatId ? "flex" : undefined,
          flexDirection: "column",
          height: "100%", // Fill the parent container
          minHeight: 0, // Important for flex children
        }}
      >
        {selectedChatId && selectedChat ? (
          isChatDetailLoading ? (
            <ChatDetailSkeleton />
          ) : (
            <>
              {/* Заголовок чата */}
              <div
                className="p-4 border-b border-gray-200 bg-white flex items-center gap-3"
                style={{ flex: "0 0 auto", flexShrink: 0 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setSelectedChatId(null)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>

                {/* Аватар участника */}
                <Avatar
                  imageUrl={selectedChat.participant?.metadata?.avatar?.url}
                  name={
                    selectedChat.participantName ||
                    selectedChat.participantCompany
                  }
                  size="sm"
                  isOnline={
                    selectedChat.participant?.id
                      ? onlineUsers.has(selectedChat.participant.id)
                      : false
                  }
                />

                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-gray-900 truncate">
                    {selectedChat.participantCompany
                      ? `${selectedChat.participantName} (${selectedChat.participantCompany})`
                      : selectedChat.participantName ||
                        selectedChat.topic ||
                        `Chat ${String(selectedChat.id).substring(0, 8)}...`}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedChat.participant?.id &&
                    onlineUsers.has(selectedChat.participant.id)
                      ? t("online")
                      : t("offline")}
                  </p>
                </div>
              </div>

              {/* Сообщения */}
              <div
                className="overflow-y-auto p-4 space-y-4 bg-gray-50"
                style={{
                  flex: "1 1 auto",
                  minHeight: 0,
                  WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
                }}
              >
                {!chatSocketConnected && (
                  <div className="bg-amber-50 border border-amber-200 text-sm text-amber-900 rounded-lg p-3 flex items-center justify-between gap-3">
                    <span>{t("connectionLost")}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-amber-900 border-amber-300"
                      onClick={() => reconnectChatSocket?.()}
                    >
                      {t("retryButton")}
                    </Button>
                  </div>
                )}

                {initialProductId &&
                  !messages.some(
                    (message) => message.product?.id === initialProductId
                  ) && <ProductContext productId={initialProductId} />}

                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>{t("noMessagesYet")}</p>
                  </div>
                ) : (
                  messages.map((message: Message, index: number) => {
                    const isOwnMessage =
                      message.sender?.id === currentUser?.id ||
                      message.sender_id === currentUser?.id;

                    // Проверяем, нужно ли показывать ProductContext перед этим сообщением
                    // Показываем, если у сообщения есть product_id и это первое сообщение с этим продуктом
                    const previousMessage =
                      index > 0 ? messages[index - 1] : null;
                    const shouldShowProductContext =
                      message.product?.id &&
                      (!previousMessage ||
                        !previousMessage.product?.id ||
                        previousMessage.product.id !== message.product.id);

                    // Проверяем, нужно ли показывать разделитель дня
                    const showDaySeparator = shouldShowDaySeparator(
                      message,
                      previousMessage
                    );
                    const dateLabel = showDaySeparator
                      ? getMessageDateLabel(message.createdAt)
                      : null;

                    return (
                      <React.Fragment key={message.id}>
                        {showDaySeparator && dateLabel && (
                          <div className="flex items-center justify-center my-4">
                            <div className="bg-gray-200 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                              {dateLabel}
                            </div>
                          </div>
                        )}
                        {shouldShowProductContext && message.product?.id && (
                          <ProductContext productId={message.product.id} />
                        )}
                        <MessageItem
                          message={message}
                          isOwnMessage={isOwnMessage}
                          formatTime={formatMessageTime}
                        />
                      </React.Fragment>
                    );
                  })
                )}
                {pendingProductId !== null &&
                  productContextChatIdRef.current ===
                    String(selectedChatId) && (
                    <ProductContext productId={pendingProductId} />
                  )}
                <div ref={messagesEndRef} />
              </div>

              {/* Форма отправки */}
              <div
                style={{
                  flex: "0 0 auto",
                  flexShrink: 0,
                  paddingBottom: "env(safe-area-inset-bottom)",
                  background: "white",
                }}
              >
                <MessageComposer
                  message={messageText}
                  onChange={setMessageText}
                  onSend={handleSendMessage}
                  placeholder={t("typeMessage") || "Type a message..."}
                  canSend={Boolean(socket && chatSocketConnected)}
                  onFocus={handleComposerFocus}
                  onBlur={handleComposerBlur}
                />
              </div>
            </>
          )
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">
                {t("selectChat") || "Select a chat to start messaging"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
