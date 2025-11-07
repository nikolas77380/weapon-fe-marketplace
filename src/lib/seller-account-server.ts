import { getServerSessionToken } from "./server-auth";
import { strapiFetchAuth } from "./strapi";
import { Product, UserProfile } from "./types";

export interface SellerAccountData {
  products: Product[];
  currentUser: UserProfile;
}

export const getSellerAccountData = async (
  currentUser: UserProfile
): Promise<SellerAccountData> => {
  const token = await getServerSessionToken();

  if (!token) {
    return {
      products: [],
      currentUser,
    };
  }

  try {
    // Загружаем продукты продавца на сервере
    const queryParams = new URLSearchParams();
    queryParams.append("filters[seller][$eq]", currentUser.id.toString());
    queryParams.append("pagination[page]", "1");
    queryParams.append("pagination[pageSize]", "30");
    queryParams.append("populate", "*");

    const path = `/api/products/public${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await strapiFetchAuth({
      path,
      method: "GET",
      token,
    });

    let products: Product[] = [];
    if (response?.data && Array.isArray(response.data)) {
      products = response.data as Product[];
    } else if (Array.isArray(response)) {
      products = response as Product[];
    }

    return {
      products,
      currentUser,
    };
  } catch (error) {
    console.error(
      `[Seller Account Server] Error fetching products for seller ${currentUser.id}:`,
      error
    );
    // Возвращаем пустой массив при ошибке, чтобы не ломать страницу
    return {
      products: [],
      currentUser,
    };
  }
};
