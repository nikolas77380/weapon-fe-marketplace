export const queryKeys = {
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (params?: any) => [...queryKeys.products.lists(), params] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.products.details(), id] as const,
    seller: (sellerId: number) =>
      [...queryKeys.products.lists(), "seller", sellerId] as const,
  },
  categories: {
    all: ["categories"] as const,
    lists: () => [...queryKeys.categories.all, "list"] as const,
    details: () => [...queryKeys.categories.all, "detail"] as const,
    detail: (slug: string) =>
      [...queryKeys.categories.details(), slug] as const,
  },
  certificates: {
    all: ["certificates"] as const,
    lists: () => [...queryKeys.certificates.all, "list"] as const,
    list: (params?: any) =>
      [...queryKeys.certificates.lists(), params] as const,
  },
  favourites: {
    all: ["favourites"] as const,
    lists: () => [...queryKeys.favourites.all, "list"] as const,
    list: (userId?: number) =>
      [...queryKeys.favourites.lists(), userId] as const,
  },
} as const;
