import { useState, useEffect, useCallback } from "react";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/strapi";
import { Product, CreateProductData, UpdateProductData } from "@/lib/types";
import { getSessionTokenFromCookie } from "@/lib/auth";

export const useProducts = (params?: {
  category?: number;
  seller?: number;
  status?: string;
  search?: string;
  sort?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  pagination?: {
    page?: number;
    pageSize?: number;
  };
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 5,
    pageCount: 0,
    total: 0,
  });

  // Create a stable key for the params to avoid infinite loops
  const paramsKey = JSON.stringify({
    category: params?.category,
    seller: params?.seller,
    status: params?.status,
    search: params?.search,
    sort: params?.sort,
    priceRange: params?.priceRange,
    pagination: params?.pagination,
  });

  useEffect(() => {
    let isCancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getProducts(params);
        if (!isCancelled && response) {
          if (response.data && Array.isArray(response.data)) {
            setProducts(response.data);
          } else if (Array.isArray(response)) {
            setProducts(response);
          }

          // Обновляем пагинацию из мета-данных
          if (response.meta?.pagination) {
            setPagination(response.meta.pagination);
          } else {
            setPagination({
              page: params?.pagination?.page || 1,
              pageSize: params?.pagination?.pageSize || 5,
              pageCount: 1,
              total: response.data?.length || 0,
            });
          }
        }
      } catch (err) {
        if (!isCancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch products"
          );
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isCancelled = true;
    };
  }, [paramsKey]);

  return {
    products,
    loading,
    error,
    pagination,
  };
};

export const useProduct = (id: number) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getProductById(id);

      if (response) {
        setProduct(response);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch product");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id, fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
};

export const useProductActions = () => {
  const token = getSessionTokenFromCookie();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProductAction = async (
    data: CreateProductData,
    images?: File[]
  ) => {
    if (!token) {
      throw new Error("Authentication required");
    }

    try {
      setLoading(true);
      setError(null);

      const response = await createProduct({ data, images });
      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create product";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateProductAction = async (
    id: number,
    data: UpdateProductData,
    images?: File[]
  ) => {
    if (!token) {
      throw new Error("Authentication required");
    }

    try {
      setLoading(true);
      setError(null);

      const response = await updateProduct({ id, data, images });
      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update product";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteProductAction = async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      await deleteProduct({ id });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete product";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createProduct: createProductAction,
    updateProduct: updateProductAction,
    deleteProduct: deleteProductAction,
    loading,
    error,
  };
};
