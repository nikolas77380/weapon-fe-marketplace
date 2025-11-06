import { useCallback } from "react";
import {
  useFavouritesQuery,
  useFavouriteStatusQuery,
  useAddToFavouritesMutation,
  useRemoveFromFavouritesMutation,
} from "./useFavouritesQuery";

export const useFavourites = (productId?: number) => {
  // Загружаем все избранные продукты
  const {
    data: favourites = [],
    isLoading: favouritesLoading,
    refetch: loadFavourites,
  } = useFavouritesQuery();

  // Загружаем статус для конкретного продукта, если передан productId
  const { data: favouriteStatus, isLoading: statusLoading } =
    useFavouriteStatusQuery(productId || 0);

  // Мутации для добавления и удаления
  const addToFavouritesMutation = useAddToFavouritesMutation();
  const removeFromFavouritesMutation = useRemoveFromFavouritesMutation();

  // Проверить, добавлен ли продукт в избранное
  const isFavourited = useCallback(
    (id: number) => {
      if (id === productId && favouriteStatus) {
        return favouriteStatus.isFavourited;
      }
      // Проверяем в общем списке избранного
      return favourites.some((fav) => fav.product.id === id);
    },
    [favourites, productId, favouriteStatus]
  );

  // Переключить статус избранного
  const toggleFavourite = useCallback(
    async (id: number) => {
      const isCurrentlyFavourited = isFavourited(id);

      if (isCurrentlyFavourited) {
        // Находим favouriteId для удаления
        const favourite = favourites.find((fav) => fav.product.id === id);
        if (favourite) {
          await removeFromFavouritesMutation.mutateAsync({
            favouriteId: favourite.id,
            productId: id,
          });
        }
      } else {
        await addToFavouritesMutation.mutateAsync(id);
      }
    },
    [
      isFavourited,
      favourites,
      addToFavouritesMutation,
      removeFromFavouritesMutation,
    ]
  );

  // Получить количество избранных продуктов
  const getFavouritesCount = useCallback(() => {
    return favourites.length;
  }, [favourites]);

  // Проверить статус избранного для конкретного продукта
  const checkFavouriteStatus = useCallback(
    async (id: number) => {
      // Используем данные из кеша или делаем новый запрос
      const status = favourites.find((fav) => fav.product.id === id);
      return {
        success: true,
        isFavourited: !!status,
        favouriteId: status?.id,
      };
    },
    [favourites]
  );

  return {
    favourites,
    loading: favouritesLoading || statusLoading,
    isFavourited,
    getFavouritesCount,
    addToFavourites: addToFavouritesMutation.mutateAsync,
    removeFromFavourites: removeFromFavouritesMutation.mutateAsync,
    toggleFavourite,
    checkFavouriteStatus,
    loadFavourites,
    refresh: loadFavourites,
  };
};
