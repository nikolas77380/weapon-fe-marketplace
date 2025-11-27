import {
  Chat,
  Message,
  CreateChatRequest,
  SendMessageRequest,
  FinishChatRequest,
} from "@/types/chat";
import { getSessionTokenFromCookie } from "./auth";
import { normalizeToIsoString } from "./date-helpers";

const getMessageServiceUrl = () => {
  return process.env.NEXT_PUBLIC_MESSAGE_SERVICE_URL || "http://localhost:3010";
};

// Базовый fetch для message-service
const messageServiceFetch = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  console.log(`[messageServiceFetch] Starting request to ${path}`);
  const token = getSessionTokenFromCookie();

  if (!token) {
    console.error("[messageServiceFetch] No token found");
    throw new Error("No authentication token found");
  }

  const baseUrl = getMessageServiceUrl();
  const url = `${baseUrl}${path}`;
  console.log(`[messageServiceFetch] Request URL: ${url}`);

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    cache: "no-store",
  });

  console.log(`[messageServiceFetch] Response status: ${response.status}`);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Message service error (${response.status}):`, errorText);
    throw new Error(
      `Message service request failed: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();
  console.log(`[messageServiceFetch] Response data:`, data);
  return data;
};

// Получение списка чатов пользователя
export const getUserChats = async (): Promise<Chat[]> => {
  try {
    const chats = await messageServiceFetch<any[]>(`/api/chats`);

    return chats.map((chat) => {
      const productId = chat.current_product_id ?? null;

      return {
        id: chat.id,
        topic: "",
        participants: [],
        status: "active" as const,
        createdAt: normalizeToIsoString(chat.created_at),
        updatedAt: normalizeToIsoString(chat.created_at),
        unreadCount: chat.unread_count || 0,
        productId: productId,
        product: productId
          ? {
              id: productId,
              title: "",
              slug: "",
            }
          : undefined,
        buyer_id: chat.buyer_id,
        seller_id: chat.seller_id,
        isArchived: chat.is_archived || false,
        isFavorite: chat.is_favorite || false,
        lastMessage: chat.last_message
          ? {
              id: chat.last_message.id,
              text: chat.last_message.text,
              sender_id: chat.last_message.sender_id,
              createdAt: normalizeToIsoString(chat.last_message.created_at),
            }
          : undefined,
      };
    });
  } catch (error) {
    console.error("Failed to fetch user chats:", error);
    throw error;
  }
};

// Создание нового чата
export const createChat = async (
  chatData: CreateChatRequest
): Promise<Chat> => {
  const response = await messageServiceFetch<any>(`/api/chats`, {
    method: "POST",
    body: JSON.stringify({
      participantIds: chatData.participantIds,
      productId: chatData.productId,
      topic: chatData.topic,
    }),
  });

  return {
    id: response.id,
    topic: chatData.topic || "",
    participants: [], // Будет загружено на фронтенде
    status: "active" as const,
    createdAt: response.created_at,
    updatedAt: response.created_at,
  };
};

// Отправка сообщения - теперь через сокет, но оставляем для обратной совместимости
// В реальности это должно вызываться через socket.emit('message:send', ...)
export const sendMessage = async (
  messageData: SendMessageRequest
): Promise<Message> => {
  // Это должно быть удалено, так как отправка сообщений теперь через сокет
  // Но оставляем для обратной совместимости
  throw new Error(
    "sendMessage should be called through socket, not REST API. Use socket.emit('message:send', ...) instead."
  );
};

// Получение сообщений чата
export const getChatMessages = async (
  chatId: string | number
): Promise<Message[]> => {
  const chatIdStr = String(chatId);
  const messages = await messageServiceFetch<any[]>(
    `/api/chats/${chatIdStr}/messages?limit=100&offset=0`
  );

  // Преобразуем формат из message-service в формат фронтенда
  return messages.map((msg) => ({
    id: msg.id,
    text: msg.text,
    sender: undefined,
    sender_id: msg.sender_id,
    chat: {} as Chat,
    isRead: msg.is_read ?? false,
    readBy: [],
    product: msg.product_id
      ? {
          id: msg.product_id,
          title: "",
          slug: "",
        }
      : undefined,
    createdAt: normalizeToIsoString(msg.created_at),
    updatedAt: normalizeToIsoString(msg.created_at),
  }));
};

// Отметка сообщений как прочитанных
export const markMessagesAsRead = async (
  messageIds: (string | number)[]
): Promise<void> => {
  const messageIdsStr = messageIds.map((id) => String(id));
  await messageServiceFetch(`/api/chats/messages/mark-read`, {
    method: "PUT",
    body: JSON.stringify({ messageIds: messageIdsStr }),
  });
};

// Отметка всех сообщений чата как прочитанных
export const markChatAsRead = async (
  chatId: string | number
): Promise<{ success: boolean; unread_count: number }> => {
  const chatIdStr = String(chatId);
  return await messageServiceFetch(`/api/chats/${chatIdStr}/mark-read`, {
    method: "PUT",
  });
};

// Завершение чата
export const finishChat = async (
  chatId: string | number,
  status: FinishChatRequest["status"]
): Promise<Chat> => {
  const chatIdStr = String(chatId);
  const response = await messageServiceFetch<any>(
    `/api/chats/${chatIdStr}/finish`,
    {
      method: "PUT",
      body: JSON.stringify({ status }),
    }
  );

  return {
    id: response.id,
    topic: "",
    participants: [],
    status: status,
    createdAt: response.created_at,
    updatedAt: response.created_at,
  };
};

// Архивирование/разархивирование чата
export const toggleChatArchive = async (
  chatId: string | number,
  isArchived: boolean
): Promise<{ success: boolean; is_archived: boolean }> => {
  const chatIdStr = String(chatId);
  return await messageServiceFetch(`/api/chats/${chatIdStr}/archive`, {
    method: "PUT",
    body: JSON.stringify({ value: isArchived }),
  });
};

// Добавление/удаление чата из избранного
export const toggleChatFavorite = async (
  chatId: string | number,
  isFavorite: boolean
): Promise<{ success: boolean; is_favorite: boolean }> => {
  const chatIdStr = String(chatId);
  return await messageServiceFetch(`/api/chats/${chatIdStr}/favorite`, {
    method: "PUT",
    body: JSON.stringify({ value: isFavorite }),
  });
};
