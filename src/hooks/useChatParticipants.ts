import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserById, getSessionTokenFromCookie } from "@/lib/auth";
import { UserProfile } from "@/lib/types";
import { Chat } from "@/types/chat";

interface ChatWithParticipant extends Chat {
  participant?: UserProfile;
  participantName?: string;
  participantCompany?: string;
  productId?: number;
}

interface UseChatParticipantsReturn {
  chats: ChatWithParticipant[];
  isLoading: boolean;
  isError: boolean;
}

/**
 * Хук для загрузки данных собеседников для списка чатов
 */
export const useChatParticipants = (
  chats: Chat[],
  currentUserId?: number
): UseChatParticipantsReturn => {
  // Собираем уникальные ID собеседников
  const participantIds = useMemo(() => {
    if (!currentUserId || !chats.length) return [];

    const ids = new Set<number>();
    chats.forEach((chat: any) => {
      if (chat.buyer_id && chat.seller_id) {
        // Определяем собеседника
        const otherId =
          chat.buyer_id === currentUserId ? chat.seller_id : chat.buyer_id;
        if (otherId && otherId !== currentUserId) {
          ids.add(otherId);
        }
      }
    });
    return Array.from(ids);
  }, [chats, currentUserId]);

  // Загружаем данные всех собеседников параллельно
  const participantQueries = useQuery({
    queryKey: ["chat-participants", participantIds],
    queryFn: async () => {
      const token = getSessionTokenFromCookie();
      if (!token) return {};

      const participants: Record<number, UserProfile> = {};

      // Загружаем данные всех участников параллельно
      await Promise.all(
        participantIds.map(async (userId) => {
          try {
            const userData = await getUserById(userId, token);
            if (userData && "id" in userData) {
              participants[userId] = userData as UserProfile;
            }
          } catch (error) {
            console.error(`Failed to fetch user ${userId}:`, error);
          }
        })
      );

      return participants;
    },
    enabled: participantIds.length > 0,
    staleTime: 5 * 60 * 1000, // 5 минут
  });

  // Объединяем данные чатов с данными участников
  const chatsWithParticipants = useMemo(() => {
    const participants = participantQueries.data || {};

    return chats.map((chat: any) => {
      console.log("[useChatParticipants] Processing chat:", {
        chatId: chat.id,
        buyer_id: chat.buyer_id,
        seller_id: chat.seller_id,
        currentUserId,
      });

      if (!currentUserId || !chat.buyer_id || !chat.seller_id) {
        console.log("[useChatParticipants] Missing data, returning as is");
        return chat as ChatWithParticipant;
      }

      // Определяем ID собеседника
      const otherId =
        chat.buyer_id === currentUserId ? chat.seller_id : chat.buyer_id;

      console.log("[useChatParticipants] Other user ID:", otherId);

      const participant = participants[otherId];

      console.log("[useChatParticipants] Participant data:", {
        otherId,
        hasParticipant: !!participant,
        participant,
      });

      if (participant) {
        const participantName =
          participant.displayName || participant.username || "";
        const participantCompany =
          participant.metadata?.companyName || undefined;

        console.log("[useChatParticipants] Final names:", {
          participantName,
          participantCompany,
        });

        return {
          ...chat,
          participant,
          participantName,
          participantCompany,
        } as ChatWithParticipant;
      }

      console.log(
        "[useChatParticipants] No participant found, returning as is"
      );
      return chat as ChatWithParticipant;
    });
  }, [chats, participantQueries.data, currentUserId]);

  return {
    chats: chatsWithParticipants,
    isLoading: participantQueries.isLoading || participantQueries.isFetching,
    isError: participantQueries.isError,
  };
};
