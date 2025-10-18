"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { getUnreadChatsCount } from "@/lib/chat-api";
import { useAuthContext } from "./AuthContext";

interface UnreadChatsContextType {
  unreadChatsCount: number;
  refreshUnreadCount: () => Promise<void>;
  isLoading: boolean;
}

const UnreadChatsContext = createContext<UnreadChatsContextType | undefined>(
  undefined
);

export const UnreadChatsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [unreadChatsCount, setUnreadChatsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const { currentUser } = useAuthContext();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const refreshUnreadCount = useCallback(async () => {
    if (!currentUser || !isPageVisible) {
      if (!currentUser) {
        setUnreadChatsCount(0);
      }
      return;
    }

    try {
      setIsLoading(true);
      const { unreadCount } = await getUnreadChatsCount();
      setUnreadChatsCount(unreadCount);
    } catch (err) {
      console.error("Error loading unread chats count:", err);
      setUnreadChatsCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, isPageVisible]);
  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      setIsPageVisible(visible);

      if (visible && currentUser) {
        refreshUnreadCount();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [currentUser, refreshUnreadCount]);

  useEffect(() => {
    if (currentUser && isPageVisible) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        refreshUnreadCount();
      }, 20000);
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
  }, [currentUser, isPageVisible, refreshUnreadCount]);

  useEffect(() => {
    refreshUnreadCount();
  }, [refreshUnreadCount]);

  return (
    <UnreadChatsContext.Provider
      value={{
        unreadChatsCount,
        refreshUnreadCount,
        isLoading,
      }}
    >
      {children}
    </UnreadChatsContext.Provider>
  );
};

export const useUnreadChats = () => {
  const context = useContext(UnreadChatsContext);
  if (context === undefined) {
    throw new Error(
      "useUnreadChats must be used within an UnreadChatsProvider"
    );
  }
  return context;
};
