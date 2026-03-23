import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  getCategoryProducts,
  getCategoryFilters,
  getSellerProducts,
  getSellerProductFilters,
} from "@/lib/strapi";
import { CreateProductData, UpdateProductData, Product } from "@/lib/types";
import { queryKeys } from "@/lib/query-keys";

export interface ProductsQueryParams {
  category?: number;
  categorySlug?: string;
  seller?: number;
  status?: string;
  search?: string;
  sort?: string;
  ids?: number[];
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
export const useProductsQuery = (
  params?: ProductsQueryParams,
  initialData?: {
    data: Product[];
    meta: {
      pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
      };
    };
  }
) => {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => getProducts(params),
    enabled: params !== undefined, // Don't fetch if params are undefined
    initialData: initialData,
  });
};

export const useProductQuery = (id: number, initialData?: Product) => {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => getProductById(id),
    enabled: !!id,
    initialData: initialData,
  });
};

export const useSellerProductsQuery = (
  sellerId?: number,
  initialData?: {
    data: Product[];
    meta?: {
      pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
      };
    };
  }
) => {
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
    initialData: initialData,
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

export const useDeleteProductImageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      imageId,
      currentImages,
    }: {
      productId: number;
      imageId: number;
      currentImages?: Array<{ id: number }>;
    }) => deleteProductImage({ productId, imageId, currentImages }),
    onSuccess: (updatedProduct, variables) => {
      // Update the specific product in cache
      queryClient.setQueryData(
        queryKeys.products.detail(variables.productId),
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

// Combined hook for backward compatibility
export const useProductActions = () => {
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();
  const deleteMutation = useDeleteProductMutation();
  const deleteImageMutation = useDeleteProductImageMutation();

  return {
    createProduct: createMutation.mutateAsync,
    updateProduct: updateMutation.mutateAsync,
    deleteProduct: deleteMutation.mutateAsync,
    deleteImage: deleteImageMutation.mutateAsync,
    loading:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      deleteImageMutation.isPending,
    error:
      createMutation.error ||
      updateMutation.error ||
      deleteMutation.error ||
      deleteImageMutation.error,
  };
};

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

export const useCategoryProducts = (
  params: CategoryProductsElasticParams
) => {
  return useQuery({
    queryKey: ["category-products", params],
    queryFn: () => getCategoryProducts(params),
    enabled: !!params.categorySlug,
  });
};

// backward-compat alias
export const useCategoryProductsElastic = useCategoryProducts;

export const useCategoryFilters = (
  params: CategoryFiltersElasticParams
) => {
  return useQuery({
    queryKey: ["category-filters", params],
    queryFn: () => getCategoryFilters(params),
    enabled: !!params.categorySlug,
  });
};

// backward-compat alias
export const useCategoryFiltersElastic = useCategoryFilters;

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

export const useSellerProducts = (
  params: SellerProductsElasticParams
) => {
  return useQuery({
    queryKey: ["seller-products", params],
    queryFn: () => getSellerProducts(params),
    enabled: !!params.sellerId,
  });
};

// backward-compat alias
export const useSellerProductsElastic = useSellerProducts;

export const useSellerFilters = (params: SellerFiltersElasticParams) => {
  return useQuery({
    queryKey: ["seller-filters", params],
    queryFn: () => getSellerProductFilters(params),
    enabled: !!params.sellerId,
  });
};

// backward-compat alias
export const useSellerFiltersElastic = useSellerFilters;
