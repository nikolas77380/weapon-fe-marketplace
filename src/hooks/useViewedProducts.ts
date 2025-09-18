import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "@/context/AuthContext";

const VIEWED_PRODUCTS_BASE_KEY = "viewedProducts";
const MAX_VIEWED_PRODUCTS = 15;

interface ViewedProduct {
  id: number;
  timestamp: number;
}

export const useViewedProducts = () => {
  const { currentUser } = useAuthContext();
  const [viewedProductIds, setViewedProductIds] = useState<number[]>([]);

  // Create a unique key for each user
  const getStorageKey = useCallback(() => {
    if (!currentUser) return null;
    return `${VIEWED_PRODUCTS_BASE_KEY}_${currentUser.id}`;
  }, [currentUser]);

  // Loading viewed items from localStorage during initialization
  useEffect(() => {
    const loadViewedProducts = () => {
      try {
        const storageKey = getStorageKey();
        if (!storageKey) {
          setViewedProductIds([]);
          return;
        }

        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const viewedProducts: ViewedProduct[] = JSON.parse(stored);
          // Sort by time (newest first) and extract only IDs
          const sortedIds = viewedProducts
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((item) => item.id);
          setViewedProductIds(sortedIds);
        } else {
          setViewedProductIds([]);
        }
      } catch (error) {
        console.error(
          "Error loading viewed products from localStorage:",
          error
        );
        setViewedProductIds([]);
      }
    };

    loadViewedProducts();
  }, [getStorageKey]);

  // Add the product to your viewed list
  const addViewedProduct = useCallback(
    (productId: number) => {
      try {
        const storageKey = getStorageKey();
        if (!storageKey) {
          return;
        }

        const stored = localStorage.getItem(storageKey);
        let viewedProducts: ViewedProduct[] = stored ? JSON.parse(stored) : [];

        // Delete the item if it already exists (to update the timestamp)
        viewedProducts = viewedProducts.filter((item) => item.id !== productId);

        // Add the product to the top with the current timestamp
        viewedProducts.unshift({
          id: productId,
          timestamp: Date.now(),
        });

        // Limit to MAX_VIEWED_PRODUCTS
        if (viewedProducts.length > MAX_VIEWED_PRODUCTS) {
          viewedProducts = viewedProducts.slice(0, MAX_VIEWED_PRODUCTS);
        }

        // Save to localStorage with user-specific key
        localStorage.setItem(storageKey, JSON.stringify(viewedProducts));

        // Updating the state
        const updatedIds = viewedProducts.map((item) => item.id);
        setViewedProductIds(updatedIds);
      } catch (error) {
        console.error("Error saving viewed product to localStorage:", error);
      }
    },
    [getStorageKey]
  );

  // Clearing viewed products
  const clearViewedProducts = useCallback(() => {
    try {
      const storageKey = getStorageKey();
      if (storageKey) {
        localStorage.removeItem(storageKey);
      }
      setViewedProductIds([]);
    } catch (error) {
      console.error("Error clearing viewed products:", error);
    }
  }, [getStorageKey]);

  return {
    viewedProductIds,
    addViewedProduct,
    clearViewedProducts,
    hasViewedProducts: viewedProductIds.length > 0,
  };
};
