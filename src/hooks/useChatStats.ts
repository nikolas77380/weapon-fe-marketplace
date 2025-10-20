import { useState, useCallback, useEffect } from "react";
import { getChatStats } from "@/lib/chat-api";
import { useAuthContext } from "@/context/AuthContext";

interface ChatStats {
  activeChatsCount: number;
  closedChatsCount: number;
  latestMessages: {
    id: number;
    text: string;
    isRead: boolean;
    createdAt: string;
    sender: {
      id: number;
      username: string;
      displayName?: string;
    };
    chat: {
      id: number;
      topic: string;
      status: string;
      participants: Array<{
        id: number;
        username: string;
        displayName?: string;
      }>;
    };
  }[];
}

export const useChatStats = () => {
  const [stats, setStats] = useState<ChatStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuthContext();

  const loadChatStats = useCallback(async () => {
    if (!currentUser) {
      setStats(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const chatStats = await getChatStats();
      setStats(chatStats);
    } catch (err) {
      console.error("Error loading chat stats:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load chat statistics"
      );
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadChatStats();
  }, [loadChatStats]);

  return {
    stats,
    loading,
    error,
    loadChatStats,
  };
};
