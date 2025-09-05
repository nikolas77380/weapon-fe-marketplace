import { useState, useEffect } from "react";
import { getUserById, getSessionTokenFromCookie } from "@/lib/auth";
import { UserProfile } from "@/lib/types";

export const useSellerData = (sellerId?: number) => {
  const [sellerData, setSellerData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSellerData = async () => {
      if (!sellerId) {
        setSellerData(null);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const token = getSessionTokenFromCookie();
        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        const response = await getUserById(sellerId, token);
        if (response && "id" in response) {
          setSellerData(response);
        } else {
          setError("Failed to fetch seller data");
        }
      } catch (error) {
        console.error("Error fetching seller data:", error);
        setError("Failed to load seller information");
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [sellerId]);

  return { sellerData, loading, error };
};
