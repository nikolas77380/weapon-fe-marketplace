import { useState, useEffect } from "react";
import { getProducts } from "@/lib/strapi";
import { Product } from "@/lib/types";

export const useSellerProducts = (sellerId?: number) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true); // Start with true to show skeleton on initial load
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSellerProducts = async () => {
      if (!sellerId) {
        setProducts([]);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await getProducts({
          seller: sellerId,
          pagination: {
            page: 1,
            pageSize: 6,
          },
        });

        if (response?.data) {
          setProducts(response.data);
        } else if (Array.isArray(response)) {
          setProducts(response);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching seller products:", err);
        setError("Failed to load seller products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerProducts();
  }, [sellerId]);

  return { products, loading, error };
};
