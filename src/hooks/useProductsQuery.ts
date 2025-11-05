import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategoryProductsElastic,
  getCategoryFiltersElastic,
  getSellerProductsElastic,
  getSellerProductFiltersElastic,
} from "@/lib/strapi";
import { CreateProductData, UpdateProductData } from "@/lib/types";
import { queryKeys } from "@/lib/query-keys";

export interface ProductsQueryParams {
  category?: number;
  categorySlug?: string;
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
}

// Query hooks
export const useProductsQuery = (params?: ProductsQueryParams) => {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => getProducts(params),
  });
};

export const useProductQuery = (id: number) => {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};

export const useSellerProductsQuery = (sellerId?: number) => {
  return useQuery({
    queryKey: queryKeys.products.seller(sellerId || 0),
    queryFn: () =>
      getProducts({
        seller: sellerId,
        pagination: {
          page: 1,
          pageSize: 30,
        },
      }),
    enabled: !!sellerId,
  });
};

// Mutation hooks
export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      images,
    }: {
      data: CreateProductData;
      images?: File[];
    }) => createProduct({ data, images }),
    onSuccess: (newProduct) => {
      // Invalidate and refetch products lists
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });

      // If the product has a seller, invalidate seller products
      if (newProduct?.data?.seller?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.products.seller(newProduct.data.seller.id),
        });
      }
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
      images,
    }: {
      id: string;
      data: UpdateProductData;
      images?: File[];
    }) => updateProduct({ id: Number(id), data, images }),
    onSuccess: (updatedProduct, variables) => {
      // Update the specific product in cache
      queryClient.setQueryData(
        queryKeys.products.detail(Number(variables.id)),
        updatedProduct
      );

      // Invalidate all product lists to refetch with updated data
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });

      // If the product has a seller, invalidate seller products
      if (updatedProduct?.data?.seller?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.products.seller(updatedProduct.data.seller.id),
        });
      }
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => deleteProduct({ id }),
    onSuccess: (_, deletedId) => {
      // Remove the product from cache
      queryClient.removeQueries({
        queryKey: queryKeys.products.detail(deletedId.id),
      });

      // Invalidate all product lists to refetch without the deleted product
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
  });
};

// Combined hook for backward compatibility
export const useProductActions = () => {
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();
  const deleteMutation = useDeleteProductMutation();

  return {
    createProduct: createMutation.mutateAsync,
    updateProduct: updateMutation.mutateAsync,
    deleteProduct: deleteMutation.mutateAsync,
    loading:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    error: createMutation.error || updateMutation.error || deleteMutation.error,
  };
};

// Elasticsearch-based hooks
export interface CategoryProductsElasticParams {
  categorySlug: string;
  search?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  currency?: string;
  tags?: string[];
  status?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
  availability?: string[];
  condition?: string[];
  categories?: string[];
}

export interface CategoryFiltersElasticParams {
  categorySlug: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  currency?: string;
  tags?: string[];
  status?: string;
}

export const useCategoryProductsElastic = (
  params: CategoryProductsElasticParams
) => {
  return useQuery({
    queryKey: ["category-products-elastic", params],
    queryFn: () => getCategoryProductsElastic(params),
    enabled: !!params.categorySlug,
  });
};

export const useCategoryFiltersElastic = (
  params: CategoryFiltersElasticParams
) => {
  return useQuery({
    queryKey: ["category-filters-elastic", params],
    queryFn: () => getCategoryFiltersElastic(params),
    enabled: !!params.categorySlug,
  });
};

// Seller Elasticsearch hooks
export interface SellerProductsElasticParams {
  sellerId: number;
  search?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  tags?: string[];
  status?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
  availability?: string[];
  condition?: string[];
  categories?: string[];
}

export interface SellerFiltersElasticParams {
  sellerId: number;
  priceRange?: {
    min?: number;
    max?: number;
  };
  tags?: string[];
  status?: string;
  availability?: string[];
  condition?: string[];
  categories?: string[];
}

export const useSellerProductsElastic = (
  params: SellerProductsElasticParams
) => {
  return useQuery({
    queryKey: ["seller-products-elastic", params],
    queryFn: () => getSellerProductsElastic(params),
    enabled: !!params.sellerId,
  });
};

export const useSellerFiltersElastic = (params: SellerFiltersElasticParams) => {
  return useQuery({
    queryKey: ["seller-filters-elastic", params],
    queryFn: () => getSellerProductFiltersElastic(params),
    enabled: !!params.sellerId,
  });
};
