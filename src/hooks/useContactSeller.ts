import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { createChat } from "@/lib/chat-api";

export const useContactSeller = () => {
  const { currentUser } = useAuthContext();
  const router = useRouter();

  const contactSeller = useCallback(
    async (
      sellerId: number,
      options?: { productId?: number; productTitle?: string }
    ) => {
      if (!currentUser) {
        return false;
      }

      try {
        // API will automatically find an existing chat or create a new one
        const chat = await createChat({
          participantIds: [sellerId], // currentUser.id добавляется автоматически на бэкенде
          productId: options?.productId,
          topic: options?.productTitle, // topic теперь опциональный, бэкенд сгенерирует автоматически
        });

        router.push(`/messages?chatId=${chat.id}`);

        return true;
      } catch (error) {
        console.error("Failed to create/find chat with seller:", error);
        return false;
      }
    },
    [currentUser, router]
  );

  return { contactSeller };
};
