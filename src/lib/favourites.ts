import { getSessionTokenFromCookie } from "./auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export interface FavouriteProduct {
  id: number;
  product: {
    id: number;
    status?: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    slug: string;
    seller: {
      id: number;
      companyName: string;
    };
  };
  createdAt: string;
}

export interface AddToFavouritesRequest {
  productId: number;
}

export interface RemoveFromFavouritesRequest {
  favouriteId: number;
}

// Добавить продукт в избранное
export const addToFavourites = async (
  productId: number
): Promise<{ success: boolean; data?: unknown; error?: string }> => {
  try {
    const token = getSessionTokenFromCookie();

    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_BASE_URL}/api/favourites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error?.message || "Failed to add to favourites",
      };
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error("Error adding to favourites:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
};

// Удалить продукт из избранного
export const removeFromFavourites = async (
  favouriteId: number
): Promise<{ success: boolean; error?: string }> => {
  try {
    const token = getSessionTokenFromCookie();

    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(
      `${API_BASE_URL}/api/favourites/${favouriteId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error?.message || "Failed to remove from favourites",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error removing from favourites:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
};

// Получить список избранных продуктов
export const getFavourites = async (): Promise<{
  success: boolean;
  data?: FavouriteProduct[];
  error?: string;
}> => {
  try {
    const token = getSessionTokenFromCookie();

    if (!token) {
      return { success: false, error: "" };
    }

    const response = await fetch(
      `${API_BASE_URL}/api/favourites?populate[product][populate][0]=images&populate[product][populate][1]=seller&populate[product][populate][2]=category`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error?.message || "Failed to fetch favourites",
      };
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error("Error fetching favourites:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
};

// Проверить, добавлен ли продукт в избранное
// Используем существующий эндпоинт /api/favourites с фильтрацией
export const checkIfFavourited = async (
  productId: number
): Promise<{
  success: boolean;
  isFavourited: boolean;
  favouriteId?: number;
  error?: string;
}> => {
  try {
    const token = getSessionTokenFromCookie();

    if (!token) {
      return {
        success: false,
        isFavourited: false,
        error: "Authentication required",
      };
    }

    // Используем существующий эндпоинт с фильтрацией по productId
    const response = await fetch(
      `${API_BASE_URL}/api/favourites?filters[product][id][$eq]=${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        isFavourited: false,
        error: errorData.error?.message || "Failed to check favourite status",
      };
    }

    const data = await response.json();
    const favourites = data.data || [];
    const isFavourited = favourites.length > 0;
    const favouriteId = isFavourited ? favourites[0].id : undefined;

    return { success: true, isFavourited, favouriteId };
  } catch (error) {
    console.error("Error checking favourite status:", error);
    return {
      success: false,
      isFavourited: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
};
