import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addToFavourites,
  removeFromFavourites,
  getFavourites,
  checkIfFavourited,
  FavouriteProduct,
} from "@/lib/favourites";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

// Хук для получения всех избранных продуктов
export const useFavouritesQuery = () => {
  const t = useTranslations("ProductDetail");

  return useQuery({
    queryKey: queryKeys.favourites.list(),
    queryFn: async () => {
      const result = await getFavourites();
      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to fetch favourites");
      }
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};

// Хук для проверки статуса избранного для конкретного продукта
// Используем данные из основного запроса избранного для оптимизации
export const useFavouriteStatusQuery = (productId: number) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [...queryKeys.favourites.list(), "status", productId],
    queryFn: async () => {
      if (!productId) {
        return { isFavourited: false, favouriteId: undefined };
      }

      // Сначала проверяем кеш основного запроса избранного
      const cachedFavourites = queryClient.getQueryData<FavouriteProduct[]>(
        queryKeys.favourites.list()
      );

      if (cachedFavourites) {
        const favourite = cachedFavourites.find(
          (fav) => fav.product.id === productId
        );
        if (favourite) {
          return {
            isFavourited: true,
            favouriteId: favourite.id,
          };
        }
        // Если не найден в кеше, возвращаем false (может быть еще не загружен)
        return { isFavourited: false, favouriteId: undefined };
      }

      // Если кеша нет, делаем запрос
      const result = await checkIfFavourited(productId);
      if (!result.success) {
        throw new Error(result.error || "Failed to check favourite status");
      }
      return {
        isFavourited: result.isFavourited,
        favouriteId: result.favouriteId,
      };
    },
    enabled: !!productId,
    staleTime: 2 * 60 * 1000, // 2 минуты
  });
};

// Хук для добавления в избранное с оптимистичными обновлениями
export const useAddToFavouritesMutation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("ProductDetail");

  return useMutation({
    mutationFn: async (productId: number) => {
      const result = await addToFavourites(productId);
      if (!result.success) {
        throw new Error(result.error || "Failed to add to favourites");
      }
      return result.data as FavouriteProduct;
    },
    onMutate: async (productId) => {
      // Отменяем все исходящие запросы для избранного
      await queryClient.cancelQueries({
        queryKey: queryKeys.favourites.list(),
      });

      // Сохраняем предыдущее состояние
      const previousFavourites = queryClient.getQueryData<FavouriteProduct[]>(
        queryKeys.favourites.list()
      );

      // Оптимистично обновляем список избранного
      queryClient.setQueryData<FavouriteProduct[]>(
        queryKeys.favourites.list(),
        (old = []) => {
          // Проверяем, не добавлен ли уже продукт
          const exists = old.some((fav) => fav.product.id === productId);
          if (exists) return old;

          // Создаем временный объект избранного
          const optimisticFavourite = {
            id: -Date.now(), // Временный ID
            product: {
              id: productId,
              title: "",
              slug: "",
              description: "",
              price: 0,
              status: "available",
              images: [],
              seller: {
                id: 0,
                companyName: "",
              },
            },
            createdAt: new Date().toISOString(),
            isOptimistic: true, // Флаг для идентификации оптимистичного обновления
          } as FavouriteProduct & { isOptimistic?: boolean };

          return [...old, optimisticFavourite];
        }
      );

      // Оптимистично обновляем статус для конкретного продукта
      queryClient.setQueryData(
        [...queryKeys.favourites.list(), "status", productId],
        {
          isFavourited: true,
          favouriteId: -Date.now(),
        }
      );

      return { previousFavourites };
    },
    onError: (error, productId, context) => {
      // Откатываем изменения при ошибке
      if (context?.previousFavourites !== undefined) {
        queryClient.setQueryData(
          queryKeys.favourites.list(),
          context.previousFavourites
        );
      }

      // Откатываем статус
      queryClient.setQueryData(
        [...queryKeys.favourites.list(), "status", productId],
        {
          isFavourited: false,
          favouriteId: undefined,
        }
      );

      toast.error(t("toastErrorAddFavourite"));
    },
    onSuccess: (data, productId) => {
      // Обновляем список избранного с реальными данными
      queryClient.setQueryData<FavouriteProduct[]>(
        queryKeys.favourites.list(),
        (old = []) => {
          // Удаляем оптимистичное обновление
          const filtered = old.filter(
            (fav) => !(fav as any).isOptimistic || fav.product.id !== productId
          );

          // Проверяем, не добавлен ли уже продукт
          const exists = filtered.some((fav) => fav.product.id === productId);
          if (exists) return filtered;

          // Добавляем реальные данные
          return [...filtered, data];
        }
      );

      // Обновляем статус с реальным favouriteId
      queryClient.setQueryData(
        [...queryKeys.favourites.list(), "status", productId],
        {
          isFavourited: true,
          favouriteId: data.id,
        }
      );

      queryClient.invalidateQueries({
        queryKey: queryKeys.favourites.list(),
      });
    },
  });
};

// Хук для удаления из избранного с оптимистичными обновлениями
export const useRemoveFromFavouritesMutation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("ProductDetail");

  return useMutation({
    mutationFn: async ({
      favouriteId,
      productId,
    }: {
      favouriteId: number;
      productId: number;
    }) => {
      const result = await removeFromFavourites(favouriteId);
      if (!result.success) {
        throw new Error(result.error || "Failed to remove from favourites");
      }
      return { favouriteId, productId };
    },
    onMutate: async ({ favouriteId, productId }) => {
      // Отменяем все исходящие запросы
      await queryClient.cancelQueries({
        queryKey: queryKeys.favourites.list(),
      });

      // Сохраняем предыдущее состояние
      const previousFavourites = queryClient.getQueryData<FavouriteProduct[]>(
        queryKeys.favourites.list()
      );

      // Оптимистично удаляем из списка
      queryClient.setQueryData<FavouriteProduct[]>(
        queryKeys.favourites.list(),
        (old = []) => old.filter((fav) => fav.id !== favouriteId)
      );

      // Оптимистично обновляем статус
      queryClient.setQueryData(
        [...queryKeys.favourites.list(), "status", productId],
        {
          isFavourited: false,
          favouriteId: undefined,
        }
      );

      return { previousFavourites };
    },
    onError: (error, variables, context) => {
      // Откатываем изменения при ошибке
      if (context?.previousFavourites !== undefined) {
        queryClient.setQueryData(
          queryKeys.favourites.list(),
          context.previousFavourites
        );
      }

      // Откатываем статус
      queryClient.setQueryData(
        [...queryKeys.favourites.list(), "status", variables.productId],
        {
          isFavourited: true,
          favouriteId: variables.favouriteId,
        }
      );

      toast.error(t("toastErrorRemoveFavourite"));
    },
    onSuccess: (data) => {
      // Инвалидируем запросы для обновления данных
      queryClient.invalidateQueries({
        queryKey: queryKeys.favourites.list(),
      });
    },
  });
};
