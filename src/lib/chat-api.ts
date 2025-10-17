import {
  Chat,
  Message,
  CreateChatRequest,
  SendMessageRequest,
  FinishChatRequest,
} from "@/types/chat";
import { strapiFetchAuth } from "./strapi";
import { getSessionTokenFromCookie } from "./auth";

// Получение списка чатов пользователя
export const getUserChats = async (): Promise<Chat[]> => {
  const token = getSessionTokenFromCookie();

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await strapiFetchAuth({
      path: "/api/chats/user",
      method: "GET",
      token,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch user chats:", error);
    throw error;
  }
};

// Создание нового чата
export const createChat = async (
  chatData: CreateChatRequest
): Promise<Chat> => {
  const token = getSessionTokenFromCookie();
  if (!token) {
    throw new Error("No authentication token found");
  }
  const response = await strapiFetchAuth({
    path: "/api/chats",
    method: "POST",
    body: chatData,
    token,
  });

  return response.data;
};

// Отправка сообщения
export const sendMessage = async (
  messageData: SendMessageRequest
): Promise<Message> => {
  const token = getSessionTokenFromCookie();
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await strapiFetchAuth({
    path: "/api/messages/send",
    method: "POST",
    body: messageData,
    token,
  });

  return response.data;
};

// Получение сообщений чата
export const getChatMessages = async (chatId: number): Promise<Message[]> => {
  const token = getSessionTokenFromCookie();
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await strapiFetchAuth({
    path: `/api/chats/${chatId}/messages`,
    method: "GET",
    token,
  });

  return response.data;
};

// Отметка сообщений как прочитанных
export const markMessagesAsRead = async (
  messageIds: number[]
): Promise<Message[]> => {
  const token = getSessionTokenFromCookie();
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await strapiFetchAuth({
    path: "/api/messages/mark-read",
    method: "PUT",
    body: { messageIds },
    token,
  });

  return response.data;
};

// Отметка всех сообщений чата как прочитанных
export const markChatAsRead = async (chatId: number): Promise<Message[]> => {
  const token = getSessionTokenFromCookie();
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await strapiFetchAuth({
    path: `/api/messages/chat/${chatId}/mark-read`,
    method: "PUT",
    token,
  });

  return response.data;
};

// Завершение чата
export const finishChat = async (
  chatId: number,
  status: FinishChatRequest["status"]
): Promise<Chat> => {
  const token = getSessionTokenFromCookie();
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await strapiFetchAuth({
    path: `/api/chats/${chatId}/finish`,
    method: "PUT",
    body: { status },
    token,
  });

  return response.data;
};

// Получение количества чатов с непрочитанными сообщениями
export const getUnreadChatsCount = async (): Promise<{
  unreadCount: number;
}> => {
  const token = getSessionTokenFromCookie();
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await strapiFetchAuth({
    path: `/api/chats/unread-count`,
    method: "GET",
    token,
  });

  return response.data;
};
