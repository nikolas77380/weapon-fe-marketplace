"use client";

import React, { useEffect, useRef } from "react";
import { Chat } from "@/types/chat";
import { useChat } from "@/hooks/useChat";
import { ChatList } from "./ChatList";
import { ChatInterface } from "./ChatInterface";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, MessageSquare } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import LoadingState from "../ui/LoadingState";

export const ChatApp: React.FC = () => {
  const { currentUser, currentUserLoading } = useAuthContext();
  const t = useTranslations("Chat");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const lastLoadedChatIdRef = useRef<number | null>(null);
  const isUpdatingUrlRef = useRef(false);

  const {
    chats,
    currentChat,
    messages,
    loading,
    isFetching,
    error,
    loadUserChats,
    loadChat,
    sendNewMessage,
    finishCurrentChat,
    clearCurrentChat,
  } = useChat();

  useEffect(() => {
    if (currentUser) {
      loadUserChats();
    }
  }, [loadUserChats, currentUser]);

  const handleChatSelect = async (chat: Chat, updateUrl = true) => {
    if (
      lastLoadedChatIdRef.current === chat.id &&
      currentChat?.id === chat.id
    ) {
      return;
    }

    try {
      await loadChat(chat.id);
      lastLoadedChatIdRef.current = chat.id;

      // Обновляем URL с новым chatId только если это не было вызвано из useEffect
      if (updateUrl && !isUpdatingUrlRef.current) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("chatId", chat.id.toString());
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      }
    } catch (error) {
      console.error("Failed to load chat:", error);
    }
  };

  useEffect(() => {
    const chatId = searchParams.get("chatId");
    if (!chatId || !currentUser || chats.length === 0) {
      return;
    }

    const chatIdNumber = parseInt(chatId, 10);

    if (lastLoadedChatIdRef.current === chatIdNumber) {
      return;
    }

    const chat = chats.find((c) => c.id === chatIdNumber);

    if (chat) {
      isUpdatingUrlRef.current = true;
      handleChatSelect(chat, false).finally(() => {
        isUpdatingUrlRef.current = false;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString(), currentUser?.id, chats.length]);

  // Блокируем скролл body на мобильных, когда открыт чат
  useEffect(() => {
    const isMobile = window.innerWidth < 768; // md breakpoint
    if (isMobile && currentChat) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [currentChat]);

  if (!currentUser && !currentUserLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="h-16 w-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">{t("authRequired")}</h3>
          <p className="text-gray-500 mb-4">{t("authRequiredDescription")}</p>
          <Button asChild>
            <a href="/auth">{t("loginButton")}</a>
          </Button>
        </div>
      </div>
    );
  }

  if (currentUserLoading) {
    return <LoadingState title={t("loadingChats")} />;
  }

  const handleSendMessage = async (text: string) => {
    if (!currentChat) return;

    try {
      await sendNewMessage(text, currentChat.id);
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  };

  const handleFinishChat = async (
    status: "successfully_completed" | "unsuccessfully_completed" | "closed"
  ) => {
    if (!currentChat) return;

    try {
      await finishCurrentChat(status);
    } catch (error) {
      console.error("Failed to finish chat:", error);
    }
  };

  const handleBackToChatList = () => {
    clearCurrentChat();
    lastLoadedChatIdRef.current = null;
    const params = new URLSearchParams(searchParams.toString());
    params.delete("chatId");
    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.push(newUrl, { scroll: false });
  };

  if (error) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("loadingError")}</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={() => loadUserChats()}>{t("retryButton")}</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      className="h-screen flex border-b border-gray-200 bg-transparent mb-20 min-w-0 overflow-x-hidden w-full max-w-full"
      style={{ maxWidth: "100vw", width: "100%" }}
    >
      {/* Side panel  */}
      <div
        className={cn(
          "w-full md:w-80 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 min-w-0",
          currentChat ? "hidden md:flex" : "flex"
        )}
        style={{ maxWidth: "100%" }}
      >
        <div className="px-4 py-6 border-b border-gray-200 bg-white sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-gray-900 mb-3">
            {t("title")}
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <ChatList
            chats={chats}
            currentChatId={currentChat?.id}
            onChatSelect={handleChatSelect}
            loading={loading}
          />
        </div>
      </div>

      {/* Main chat area */}
      <div
        className={cn(
          "flex-1 flex flex-col bg-white transition-all duration-300 min-w-0 overflow-x-hidden w-full max-w-full",
          !currentChat && "hidden md:flex",
          currentChat && "fixed md:relative inset-0 md:inset-auto"
        )}
        style={{ maxWidth: "100vw", width: "100%" }}
      >
        {currentChat ? (
          <ChatInterface
            chat={currentChat}
            messages={messages}
            currentUserId={currentUser?.id}
            onSendMessage={handleSendMessage}
            onFinishChat={handleFinishChat}
            onBackToChatList={handleBackToChatList}
            loading={loading}
            isFetching={isFetching}
          />
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-400 bg-gradient-to-b from-gray-50 to-gray-100 animate-fadeIn">
            <div className="p-6 rounded-full bg-gold-main/10 mb-4">
              <MessageSquare className="h-10 w-10 text-gold-main" />
            </div>
            <h2 className="text-lg font-semibold text-gray-700">
              {t("selectChat")}
            </h2>
            <p className="text-sm text-gray-500 mt-1 text-center px-8">
              {t("selectChatDescription")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
