import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { createChat } from "@/lib/chat-api";
import { getSellerMetaBySellerId } from "@/lib/strapi";

export const useContactSeller = () => {
  const { currentUser } = useAuthContext();
  const router = useRouter();

  const contactSeller = useCallback(
    async (sellerId: number, productTitle?: string) => {
      if (!currentUser) {
        return false;
      }

      try {
        let topic = productTitle;

        if (!topic) {
          try {
            const metaResponse = await getSellerMetaBySellerId(sellerId);
            if (
              metaResponse &&
              metaResponse.data &&
              metaResponse.data.length > 0
            ) {
              const meta = metaResponse.data[0];
              const username = meta.sellerEntity?.username;
              if (username) {
                topic = username;
              }
            }
          } catch (error) {
            console.error("Failed to fetch seller username:", error);
          }

          if (!topic) {
            topic = "";
          }
        }

        if (!topic) {
          return false;
        }

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
