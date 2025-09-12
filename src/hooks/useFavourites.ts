import { useState, useEffect, useCallback } from "react";
import {
  addToFavourites,
  removeFromFavourites,
  getFavourites,
  checkIfFavourited,
  FavouriteProduct,
} from "@/lib/favourites";
import { toast } from "sonner";

export const useFavourites = () => {
  const [favourites, setFavourites] = useState<FavouriteProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [favouriteStatuses, setFavouriteStatuses] = useState<
    Record<number, boolean>
  >({});

  // Загрузить все избранные продукты
  const loadFavourites = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getFavourites();

      if (result.success && result.data) {
        setFavourites(result.data);
        // Обновляем статусы для всех продуктов
        const statuses: Record<number, boolean> = {};
        result.data.forEach((fav) => {
          statuses[fav.product.id] = true;
        });
        setFavouriteStatuses(statuses);
      }
    } catch (error) {
      console.error("Error loading favourites:", error);
      toast.error("Failed to load favourites");
    } finally {
      setLoading(false);
    }
  }, []);

  // Проверить статус избранного для конкретного продукта
  const checkFavouriteStatus = useCallback(async (productId: number) => {
    try {
      const result = await checkIfFavourited(productId);
      if (result.success) {
        setFavouriteStatuses((prev) => ({
          ...prev,
          [productId]: result.isFavourited,
        }));
        return result;
      }
    } catch (error) {
      console.error("Error checking favourite status:", error);
    }
    return { success: false, isFavourited: false };
  }, []);

  // Добавить продукт в избранное
  const addToFavouritesHandler = useCallback(
    async (productId: number) => {
      try {
        const result = await addToFavourites(productId);

        if (result.success) {
          // Обновляем статус
          setFavouriteStatuses((prev) => ({
            ...prev,
            [productId]: true,
          }));

          // Перезагружаем список избранного
          await loadFavourites();

          toast.success("Added to favourites");
          return true;
        } else {
          toast.error(result.error || "Failed to add to favourites");
          return false;
        }
      } catch (error) {
        console.error("Error adding to favourites:", error);
        toast.error("Failed to add to favourites");
        return false;
      }
    },
    [loadFavourites]
  );

  // Удалить продукт из избранного
  const removeFromFavouritesHandler = useCallback(
    async (favouriteId: number, productId: number) => {
      try {
        const result = await removeFromFavourites(favouriteId);

        if (result.success) {
          // Обновляем статус
          setFavouriteStatuses((prev) => ({
            ...prev,
            [productId]: false,
          }));

          // Удаляем из локального состояния
          setFavourites((prev) => prev.filter((fav) => fav.id !== favouriteId));

          toast.success("Removed from favourites");
          return true;
        } else {
          toast.error(result.error || "Failed to remove from favourites");
          return false;
        }
      } catch (error) {
        console.error("Error removing from favourites:", error);
        toast.error("Failed to remove from favourites");
        return false;
      }
    },
    []
  );

  // Переключить статус избранного
  const toggleFavourite = useCallback(
    async (productId: number) => {
      const isCurrentlyFavourited = favouriteStatuses[productId];

      if (isCurrentlyFavourited) {
        // Находим favouriteId для удаления
        const favourite = favourites.find(
          (fav) => fav.product.id === productId
        );
        if (favourite) {
          return await removeFromFavouritesHandler(favourite.id, productId);
        }
      } else {
        return await addToFavouritesHandler(productId);
      }

      return false;
    },
    [
      favouriteStatuses,
      favourites,
      addToFavouritesHandler,
      removeFromFavouritesHandler,
    ]
  );

  // Проверить, добавлен ли продукт в избранное
  const isFavourited = useCallback(
    (productId: number) => {
      return favouriteStatuses[productId] || false;
    },
    [favouriteStatuses]
  );

  // Получить количество избранных продуктов
  const getFavouritesCount = useCallback(() => {
    return favourites.length;
  }, [favourites]);

  // Инициализация при монтировании
  useEffect(() => {
    loadFavourites();
  }, [loadFavourites]);

  return {
    favourites,
    loading,
    isFavourited,
    getFavouritesCount,
    addToFavourites: addToFavouritesHandler,
    removeFromFavourites: removeFromFavouritesHandler,
    toggleFavourite,
    checkFavouriteStatus,
    loadFavourites,
    refresh: loadFavourites,
  };
};
