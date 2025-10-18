import { useEffect, useRef, useCallback, useState } from "react";
import { Chat, Message } from "@/types/chat";
import { getChatMessages } from "@/lib/chat-api";

interface UseChatPollingProps {
  chatId: number | null;
  onMessagesUpdate: (messages: Message[]) => void;
  onChatUpdate: (chat: Chat) => void;
  pollingInterval?: number;
  enabled?: boolean;
}

export const useChatPolling = ({
  chatId,
  onMessagesUpdate,
  onChatUpdate,
  pollingInterval = 10000,
  enabled = true,
}: UseChatPollingProps) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageIdRef = useRef<number | null>(null);
  const [isPageVisible, setIsPageVisible] = useState(true);

  const onMessagesUpdateRef = useRef(onMessagesUpdate);
  const onChatUpdateRef = useRef(onChatUpdate);

  useEffect(() => {
    onMessagesUpdateRef.current = onMessagesUpdate;
    onChatUpdateRef.current = onChatUpdate;
  }, [onMessagesUpdate, onChatUpdate]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      setIsPageVisible(visible);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const pollChatRef = useRef<(() => Promise<void>) | null>(null);

  pollChatRef.current = async () => {
    if (!chatId || !enabled) {
      return;
    }

    try {
      const messages = await getChatMessages(chatId);

      const latestMessage = messages[messages.length - 1];
      if (latestMessage && latestMessage.id !== lastMessageIdRef.current) {
        onMessagesUpdateRef.current(messages);
        lastMessageIdRef.current = latestMessage.id;
      }
    } catch (error) {
      console.error("Error polling chat:", error);
    }
  };

  useEffect(() => {
    if (enabled && chatId) {
      lastMessageIdRef.current = null;

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Используем разные интервалы в зависимости от видимости страницы
      const interval = isPageVisible ? pollingInterval : pollingInterval * 3; // В 3 раза реже когда неактивна

      intervalRef.current = setInterval(() => {
        if (pollChatRef.current) {
          pollChatRef.current();
        }
      }, interval);

      // Первый запрос делаем сразу
      if (pollChatRef.current) {
        pollChatRef.current();
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [chatId, enabled, isPageVisible, pollingInterval]);

  const refreshChat = useCallback(() => {
    if (chatId && enabled && pollChatRef.current) {
      pollChatRef.current();
    }
  }, [chatId, enabled]);

  return {
    refreshChat,
  };
};
