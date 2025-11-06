import { getProductById } from "./strapi";
import { getServerCurrentUser } from "./server-auth";
import { Product, UserProfile } from "./types";

export interface ProductPageData {
  product: Product;
  currentUser: UserProfile | null;
}

export const getProductPageData = async (
  productId: number
): Promise<ProductPageData> => {
  // Загружаем данные параллельно
  const [productResponse, currentUser] = await Promise.all([
    getProductById(productId).catch((error) => {
      console.error(
        `[Product Server] Error fetching product ${productId}:`,
        error
      );
      return null;
    }),
    getServerCurrentUser().catch(() => null), // Не критично, если не загрузится
  ]);

  // Проверяем структуру ответа
  if (!productResponse) {
    throw new Error("Product not found");
  }

  let product: Product;
  if (productResponse?.data) {
    product = productResponse.data as Product;
  } else if (productResponse && "id" in productResponse) {
    product = productResponse as Product;
  } else {
    console.error(
      "[Product Server] Invalid product response structure:",
      productResponse
    );
    throw new Error("Product not found");
  }

  if (!product || !product.id) {
    console.error("[Product Server] Product missing required fields:", product);
    throw new Error("Product not found");
  }

  return {
    product,
    currentUser,
  };
};
