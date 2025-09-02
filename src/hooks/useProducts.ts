import { useState, useEffect } from "react";
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
    pageSize: 10,
    pageCount: 0,
    total: 0,
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getProducts(params);

      if (response) {
        const productsData = response.data || response;
        setProducts(productsData);

        if (response.meta?.pagination) {
          setPagination(response.meta.pagination);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [
    params?.category,
    params?.seller,
    params?.status,
    params?.search,
    params?.sort,
    params?.pagination?.page,
    params?.pagination?.pageSize,
  ]);

  return {
    products,
    loading,
    error,
    pagination,
    refetch: fetchProducts,
  };
};

export const useProduct = (id: number) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getProductById(id);

      if (response.data) {
        setProduct(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

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
