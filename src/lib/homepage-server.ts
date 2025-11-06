import {
  getProducts,
  getPromos,
  getCategories,
  getTopProductsByCategories,
} from "./strapi";
import { Product, Category, Promo } from "./types";

// Серверные функции для загрузки данных главной страницы

export interface HomePageData {
  products: {
    data: Product[];
    meta: {
      pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
      };
    };
  };
  promos: {
    data: Promo[];
  };
  categories: Category[];
  topProducts: Product[];
}

export const getHomePageData = async (): Promise<HomePageData> => {
  // Загружаем данные параллельно для лучшей производительности
  let topProductsResponse;

  // Проверяем переменные окружения
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!apiUrl) {
    console.error("[HomePage Server] NEXT_PUBLIC_STRAPI_URL is not set");
  } else {
    console.log("[HomePage Server] API URL:", apiUrl);
  }

  try {
    // Используем Promise.allSettled для независимой обработки ошибок
    // Это позволяет странице загрузиться даже если один из запросов упал
    const [productsResult, promosResult, categoriesResult, topProductsResult] =
      await Promise.allSettled([
        getProducts({
          pagination: {
            page: 1,
            pageSize: 12,
          },
          sort: "viewsCount:desc",
        }),
        getPromos(),
        getCategories(),
        getTopProductsByCategories(),
      ]);

    // Обрабатываем результаты независимо
    const productsResponse =
      productsResult.status === "fulfilled"
        ? productsResult.value
        : {
            data: [],
            meta: {
              pagination: {
                page: 1,
                pageSize: 12,
                pageCount: 0,
                total: 0,
              },
            },
          };

    const promosResponse =
      promosResult.status === "fulfilled" ? promosResult.value : { data: [] };

    const categories =
      categoriesResult.status === "fulfilled" ? categoriesResult.value : [];

    // topProducts не критичен, просто возвращаем пустой массив при ошибке
    let topProductsResponse = null;
    if (topProductsResult.status === "fulfilled") {
      topProductsResponse = topProductsResult.value;
    } else {
      console.error(
        "[HomePage Server] Error fetching top products by categories:",
        topProductsResult.reason
      );
    }

    // Логируем ошибки для отладки
    if (productsResult.status === "rejected") {
      console.error(
        "[HomePage Server] Error fetching products:",
        productsResult.reason
      );
    }
    if (promosResult.status === "rejected") {
      console.error(
        "[HomePage Server] Error fetching promos:",
        promosResult.reason
      );
    }
    if (categoriesResult.status === "rejected") {
      console.error(
        "[HomePage Server] Error fetching categories:",
        categoriesResult.reason
      );
    }

    // Логируем ответ для отладки
    console.log(
      "[HomePage Server] Top products response type:",
      typeof topProductsResponse
    );
    console.log(
      "[HomePage Server] Top products response:",
      topProductsResponse
        ? JSON.stringify(topProductsResponse, null, 2).substring(0, 500)
        : "null"
    );

    // Проверяем структуру ответа
    let topProductsArray: Product[] = [];
    if (topProductsResponse) {
      if (Array.isArray(topProductsResponse)) {
        // Если ответ - массив напрямую
        topProductsArray = topProductsResponse;
      } else if (
        topProductsResponse.data &&
        Array.isArray(topProductsResponse.data)
      ) {
        // Если ответ - объект с полем data (стандартный формат Strapi)
        topProductsArray = topProductsResponse.data;
      } else if (
        topProductsResponse.data &&
        Array.isArray(topProductsResponse.data.data)
      ) {
        // Если ответ вложен еще глубже
        topProductsArray = topProductsResponse.data.data;
      }
    }

    console.log(
      "[HomePage Server] Final topProducts length:",
      topProductsArray.length
    );

    return {
      products: productsResponse,
      promos: promosResponse,
      categories,
      topProducts: topProductsArray,
    };
  } catch (error) {
    console.error("[HomePage Server] Error loading homepage data:", error);
    // Возвращаем пустые данные при ошибке
    return {
      products: {
        data: [],
        meta: {
          pagination: {
            page: 1,
            pageSize: 12,
            pageCount: 0,
            total: 0,
          },
        },
      },
      promos: {
        data: [],
      },
      categories: [],
      topProducts: [],
    };
  }
};
