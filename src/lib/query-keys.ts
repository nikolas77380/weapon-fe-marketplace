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
    details: () => [...queryKeys.certificates.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.certificates.details(), id] as const,
    byUser: (userId: number, params?: any) =>
      [...queryKeys.certificates.lists(), "user", userId, params] as const,
    byProduct: (productId: number, params?: any) =>
      [
        ...queryKeys.certificates.lists(),
        "product",
        productId,
        params,
      ] as const,
  },
  favourites: {
    all: ["favourites"] as const,
    lists: () => [...queryKeys.favourites.all, "list"] as const,
    list: (userId?: number) =>
      [...queryKeys.favourites.lists(), userId] as const,
  },
  promos: {
    all: ["promos"] as const,
    lists: () => [...queryKeys.promos.all, "list"] as const,
    list: (params?: any) => [...queryKeys.promos.lists(), params] as const,
    details: () => [...queryKeys.promos.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.promos.details(), id] as const,
  },
  chats: {
    all: ["chats"] as const,
    lists: () => [...queryKeys.chats.all, "list"] as const,
    list: () => [...queryKeys.chats.lists()] as const,
    details: () => [...queryKeys.chats.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.chats.details(), id] as const,
    messages: (id: number) =>
      [...queryKeys.chats.detail(id), "messages"] as const,
  },
  sellerMeta: {
    all: ["sellerMeta"] as const,
    lists: () => [...queryKeys.sellerMeta.all, "list"] as const,
    details: () => [...queryKeys.sellerMeta.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.sellerMeta.details(), id] as const,
    bySeller: (sellerId: number) =>
      [...queryKeys.sellerMeta.all, "seller", sellerId] as const,
  },
} as const;
