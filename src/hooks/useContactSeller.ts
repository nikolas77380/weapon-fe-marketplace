import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { createChat } from "@/lib/chat-api";

export const useContactSeller = () => {
  const { currentUser } = useAuthContext();
  const router = useRouter();

  const contactSeller = useCallback(
    async (sellerId: number, productTitle?: string) => {
      if (!currentUser) {
        return false;
      }

      try {
        const topic = productTitle
          ? `Question about the product: ${productTitle}`
          : "Conversation with the seller";

        await createChat({
          topic,
          participantIds: [currentUser.id, sellerId],
        });

        router.push("/messages");

        return true;
      } catch (error) {
        console.error("Failed to create chat with seller:", error);
        return false;
      }
    },
    [currentUser, router]
  );

  return { contactSeller };
};
