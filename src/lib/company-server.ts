import { getSellerMetaBySellerId } from "./strapi";
import { getServerCurrentUser } from "./server-auth";
import { UserProfile } from "./types";

export interface CompanyPageData {
  sellerData: UserProfile;
  sellerMeta: any;
  currentUser: UserProfile | null;
}

export const getCompanyPageData = async (
  sellerId: number
): Promise<CompanyPageData> => {
  // Загружаем данные параллельно
  const [metaResponse, currentUser] = await Promise.all([
    getSellerMetaBySellerId(sellerId).catch((error) => {
      console.error(
        `[Company Server] Error fetching seller ${sellerId}:`,
        error
      );
      return null;
    }),
    getServerCurrentUser().catch(() => null), // Не критично, если не загрузится
  ]);

  if (!metaResponse?.data || metaResponse.data.length === 0) {
    console.error(`[Company Server] Seller ${sellerId} not found`);
    throw new Error("Seller not found");
  }

  const meta = metaResponse.data[0];

  // Создаем объект пользователя из метаданных
  const sellerData: UserProfile = {
    id: meta.sellerEntity.id,
    username: meta.sellerEntity.username,
    displayName: meta.sellerEntity.displayName,
    email: meta.sellerEntity.email,
    role: { name: "seller", id: 0, type: "seller" },
    confirmed: true,
    blocked: false,
    createdAt: meta.sellerEntity.createdAt || new Date().toISOString(),
    updatedAt: meta.sellerEntity.updatedAt || new Date().toISOString(),
    metadata: meta,
  };

  return {
    sellerData,
    sellerMeta: meta,
    currentUser,
  };
};
