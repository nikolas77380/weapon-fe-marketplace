import { Chat } from "@/types/chat";
import { strapiFetchAuth } from "./strapi";
import { getServerSessionToken } from "./server-auth";

// Серверная версия получения списка чатов пользователя
export const getUserChatsServer = async (): Promise<Chat[]> => {
  const token = await getServerSessionToken();

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
    console.error("Failed to fetch user chats on server:", error);
    throw error;
  }
};
