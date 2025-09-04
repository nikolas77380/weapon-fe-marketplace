import { useState, useEffect } from "react";
import { getUserById, getSessionTokenFromCookie } from "@/lib/auth";
import { UserProfile } from "@/lib/types";

export const useSellerData = (sellerId?: number) => {
  const [sellerData, setSellerData] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchSellerData = async () => {
      if (sellerId) {
        try {
          const token = getSessionTokenFromCookie();
          if (token) {
            const response = await getUserById(sellerId, token);
            if (response && "id" in response) {
              setSellerData(response);
            }
          }
        } catch (error) {
          console.error("Error fetching seller data:", error);
        }
      }
    };

    fetchSellerData();
  }, [sellerId]);

  return { sellerData };
};
