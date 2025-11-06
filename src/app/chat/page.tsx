import React from "react";
import { requireAuth } from "@/lib/server-auth";
import { getUserChatsServer } from "@/lib/chat-api-server";
import { ChatAppClient } from "@/components/chat/ChatAppClient";
import { Chat } from "@/types/chat";

export default async function ChatPage() {
  const currentUser = await requireAuth();

  // Загружаем начальные данные на сервере
  let initialChats: Chat[] = [];
  try {
    initialChats = await getUserChatsServer();
  } catch (error) {
    console.error("Failed to load chats on server:", error);
    // Продолжаем работу, данные загрузятся на клиенте
  }

  return (
    <ChatAppClient initialChats={initialChats} currentUser={currentUser} />
  );
}
