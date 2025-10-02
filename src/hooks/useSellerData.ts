import { useState, useEffect } from "react";
import { getUserById, getSessionTokenFromCookie } from "@/lib/auth";
import { getSellerMetaBySellerId } from "@/lib/strapi";
import { UserProfile } from "@/lib/types";

export const useSellerData = (sellerId?: number) => {
  const [sellerData, setSellerData] = useState<UserProfile | null>(null);
  const [sellerMeta, setSellerMeta] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSellerData = async () => {
      if (!sellerId) {
        setSellerData(null);
        setSellerMeta(null);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Сначала пытаемся получить данные через авторизованный запрос
        const token = getSessionTokenFromCookie();
        let userResponse = null;

        if (token) {
          try {
            userResponse = await getUserById(sellerId, token);
          } catch {
            console.log("Auth request failed, trying public endpoints");
          }
        }

        // Если авторизованный запрос не удался, используем публичные endpoints
        if (!userResponse) {
          try {
            // Получаем метаданные продавца через публичный API
            const metaResponse = await getSellerMetaBySellerId(sellerId);
            if (
              metaResponse &&
              metaResponse.data &&
              metaResponse.data.length > 0
            ) {
              const meta = metaResponse.data[0];
              setSellerMeta(meta);

              // Создаем базовый объект пользователя из метаданных
              const basicUserData = {
                id: meta.sellerEntity.id,
                username: meta.sellerEntity.username,
                displayName: meta.sellerEntity.displayName,
                email: meta.sellerEntity.email,
                role: { name: "seller" },
                metadata: meta,
              };
              setSellerData(basicUserData as UserProfile);
            } else {
              setError("Seller information not found");
            }
          } catch (publicError) {
            console.error("Error fetching public seller data:", publicError);
            setError("Failed to load seller information");
          }
        } else {
          // Используем данные из авторизованного запроса
          setSellerData(userResponse as UserProfile);

          // Дополнительно получаем метаданные
          try {
            const metaResponse = await getSellerMetaBySellerId(sellerId);
            if (
              metaResponse &&
              metaResponse.data &&
              metaResponse.data.length > 0
            ) {
              setSellerMeta(metaResponse.data[0]);
            }
          } catch (metaError) {
            console.log("Could not fetch seller metadata:", metaError);
          }
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

  return { sellerData, sellerMeta, loading, error };
};
