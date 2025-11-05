import { SellerFormValues } from "@/schemas/sellerSchema";
import { Category, CreateProductData, UpdateProductData } from "./types";
import { getSessionTokenFromCookie } from "./auth";

// Base Strapi API client for public requests (without JWT)
export const strapiFetch = async ({
  path,
  method,
  body,
}: {
  path: string;
  method: string;
  body?: unknown;
}) => {
  const url = `${
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
  }${path}`;

  console.log(`Making ${method} request to:`, url);
  console.log("Request body:", body);

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    // const errorText = await response.text();
    // console.error("Response error:", errorText);
    // throw new Error(`HTTP ${response.status}: ${errorText}`);
    const errorData = await response.json();
    throw {
      status: response.status,
      message: errorData?.error?.message || "Unknown error",
    };
  }

  const data = await response.json();
  console.log("Response data:", data);
  return data;
};

// Protected Strapi API client for authenticated requests (with JWT)
export const strapiFetchAuth = async ({
  path,
  method,
  body,
  token,
  cache,
}: {
  path: string;
  method: string;
  body?: unknown;
  token: string;
  cache?: number;
}) => {
  const url = `${
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
  }${path}`;

  // Определяем настройки кеширования
  let cacheConfig: RequestInit["cache"] | RequestInit["next"];

  if (cache === undefined) {
    cacheConfig = undefined;
  } else if (cache === 0) {
    cacheConfig = "no-store";
  } else {
    cacheConfig = { revalidate: cache };
  }

  // Check if body is FormData to handle file uploads
  const isFormData = body instanceof FormData;

  const fetchOptions: RequestInit = {
    method,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Authorization: `Bearer ${token}`,
    },
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  };

  if (cache === 0) {
    fetchOptions.cache = cacheConfig as RequestCache;
  } else if (cache && cache > 0) {
    fetchOptions.next = cacheConfig as { revalidate: number };
  }

  const response = await fetch(url, fetchOptions);

  console.log("Response status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  console.log("Response data:", data);
  return data;
};

// Function to create seller meta data
export const createSellerMeta = async ({
  data,
  token,
}: {
  data: SellerFormValues;
  token: string;
}) => {
  return strapiFetchAuth({
    path: "/api/seller-metas",
    method: "POST",
    body: {
      data,
    },
    token,
  });
};

// Function to update seller meta data
export const updateSellerMeta = async ({
  id,
  data,
  token,
}: {
  id: number;
  data: {
    specialisation?: string;
    sellerDescription?: string;
    companyName?: string;
    businessId?: string;
    webSite?: string;
    phoneNumbers?: string;
    country?: string;
    address?: string;
    workTimeMonFri?: string;
    workTimeSaturday?: string;
    workTimeSunday?: string;
  };
  token: string;
}) => {
  return strapiFetchAuth({
    path: `/api/seller-metas/${id}`,
    method: "PUT",
    body: {
      data,
    },
    token,
  });
};

export const uploadSellerAvatar = async ({
  id,
  avatar,
  token,
}: {
  id: number;
  avatar: File;
  token: string;
}) => {
  const formData = new FormData();
  formData.append("files.avatar", avatar);

  return strapiFetchAuth({
    path: `/api/seller-metas/${id}/avatar`,
    method: "POST",
    body: formData,
    token,
  });
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    const url = `${baseUrl}/api/categories/public`;

    console.log("Fetching categories from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(10000),
    });

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);

      if (response.status === 404) {
        throw new Error(
          "Categories API endpoint not found. Please check if Strapi server is running and categories are configured."
        );
      } else if (response.status === 500) {
        throw new Error(
          "Internal server error. Please check Strapi server logs."
        );
      } else {
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }
    }

    const data = await response.json();

    if (!data.data || !Array.isArray(data.data)) {
      console.error("Invalid data structure:", data);
      throw new Error("Invalid response format from categories API");
    }
    return data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Network error. Please check if Strapi server is running at " +
          (process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337")
      );
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        "Request timeout. Strapi server might be slow or unavailable."
      );
    }

    throw error;
  }
};

export const getCategoryById = async (id: number): Promise<Category> => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    const url = `${baseUrl}/api/categories/public/${id}?populate=*`;
    const token = getSessionTokenFromCookie();
    console.log("Fetching category by ID from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Category data:", data);

    const category: Category = data.data;

    return category;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};

export const getCategoryBySlug = async (slug: string): Promise<Category> => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    const url = `${baseUrl}/api/categories/public/slug/${slug}`;
    console.log("Fetching category by slug from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(10000),
    });

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);

      if (response.status === 404) {
        throw new Error(
          "Category not found. Please check if the category slug is correct."
        );
      } else if (response.status === 500) {
        throw new Error(
          "Internal server error. Please check Strapi server logs."
        );
      } else {
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }
    }

    const data = await response.json();

    if (!data.data) {
      console.error("Invalid data structure:", data);
      throw new Error("Invalid response format from category API");
    }

    const category: Category = {
      id: data.data.id,
      name: data.data.name,
      slug: data.data.slug,
      description: data.data.description,
      order: data.data.order,
      createdAt: data.data.createdAt,
      updatedAt: data.data.updatedAt,
      translate_ua: data.data.translate_ua,
      parent: data.data.parent
        ? {
            id: data.data.parent.id,
            name: data.data.parent.name,
            slug: data.data.parent.slug,
            description: data.data.parent.description,
            order: data.data.parent.order,
            createdAt: data.data.parent.createdAt,
            updatedAt: data.data.parent.updatedAt,
          }
        : undefined,
      children: data.data.children
        ? data.data.children.map((child: unknown) => {
            const typedChild = child as {
              id: number;
              name: string;
              slug: string;
              description: string;
              order: number;
              createdAt: string;
              updatedAt: string;
              translate_ua?: string;
            };
            return {
              id: typedChild.id,
              name: typedChild.name,
              slug: typedChild.slug,
              description: typedChild.description,
              order: typedChild.order,
              createdAt: typedChild.createdAt,
              updatedAt: typedChild.updatedAt,
              translate_ua: (typedChild as any).translate_ua,
            };
          })
        : undefined,
    };

    console.log("Transformed category:", category);
    return category;
  } catch (error) {
    console.error("Error fetching category by slug:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Network error. Please check if Strapi server is running at " +
          (process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337")
      );
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        "Request timeout. Strapi server might be slow or unavailable."
      );
    }

    throw error;
  }
};

export const createProduct = async ({
  data,
  images,
}: {
  data: CreateProductData;
  images?: File[];
}) => {
  const token = getSessionTokenFromCookie();
  if (!token) {
    throw new Error("Authentication required");
  }

  // If images are provided, use FormData for file upload
  if (images && images.length > 0) {
    console.log("Creating product with images:", images);
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));

    images.forEach((image, index) => {
      console.log(`Adding image ${index}:`, image.name, image.size);
      formData.append(`files.images`, image);
    });

    return strapiFetchAuth({
      path: "/api/products",
      method: "POST",
      body: formData,
      token,
    });
  }

  // Otherwise, use regular JSON request
  console.log("Creating product without images");
  return strapiFetchAuth({
    path: "/api/products",
    method: "POST",
    body: {
      data,
    },
    token,
  });
};

export const updateProduct = async ({
  id,
  data,
  images,
}: {
  id: number;
  data: UpdateProductData;
  images?: File[];
}) => {
  const token = getSessionTokenFromCookie();
  if (!token) {
    throw new Error("Authentication required");
  }

  // If images are provided, use FormData for file upload
  if (images && images.length > 0) {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));

    images.forEach((image) => {
      formData.append(`files.images`, image);
    });

    return strapiFetchAuth({
      path: `/api/products/${id}`,
      method: "PUT",
      body: formData,
      token,
    });
  }

  // Otherwise, use regular JSON request
  return strapiFetchAuth({
    path: `/api/products/${id}`,
    method: "PUT",
    body: {
      data,
    },
    token,
  });
};

export const deleteProduct = async ({ id }: { id: number }) => {
  const token = getSessionTokenFromCookie();
  if (!token) {
    throw new Error("Authentication required");
  }
  return strapiFetchAuth({
    path: `/api/products/${id}`,
    method: "DELETE",
    token,
  });
};

export const getProducts = async (params?: {
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
}) => {
  const queryParams = new URLSearchParams();

  if (params?.category) {
    queryParams.append("filters[category][$eq]", params.category.toString());
  }

  if (params?.categorySlug) {
    queryParams.append("filters[categorySlug]", params.categorySlug);
  }

  if (params?.seller) {
    queryParams.append("filters[seller][$eq]", params.seller.toString());
  }

  if (params?.status) {
    queryParams.append("filters[status][$eq]", params.status);
  }

  if (params?.search) {
    queryParams.append("filters[title][$containsi]", params.search);
  }

  if (params?.ids && params.ids.length > 0) {
    // Add each ID to the query params for $in filter
    // Format: filters[id][$in][0]=1&filters[id][$in][1]=2
    params.ids.forEach((id, index) => {
      queryParams.append(`filters[id][$in][${index}]`, id.toString());
    });
  }

  if (params?.priceRange?.min !== undefined) {
    queryParams.append(
      "filters[priceRange][min]",
      params.priceRange.min.toString()
    );
  }

  if (params?.priceRange?.max !== undefined) {
    queryParams.append(
      "filters[priceRange][max]",
      params.priceRange.max.toString()
    );
  }

  if (params?.sort) {
    queryParams.append("sort", params.sort);
  }

  const page = params?.pagination?.page || 1;
  const pageSize = params?.pagination?.pageSize || 5;

  queryParams.append("pagination[page]", page.toString());
  queryParams.append("pagination[pageSize]", pageSize.toString());

  queryParams.append("populate", "*");

  const queryString = queryParams.toString();
  const path = `/api/products/public${queryString ? `?${queryString}` : ""}`;

  // If seller filter is present, try to use authenticated request
  // so the API can determine if the user is viewing their own products
  const token = getSessionTokenFromCookie();
  if (token && params?.seller) {
    console.log(
      "Using authenticated request for seller products, sellerId:",
      params.seller
    );
    return strapiFetchAuth({
      path,
      method: "GET",
      token,
    });
  }
  return strapiFetch({
    path,
    method: "GET",
  });
};

export const getProductById = async (id: number) => {
  // Используем публичный endpoint без авторизации
  return strapiFetch({
    path: `/api/products/public/${id}?populate=*`,
    method: "GET",
  });
};

export const getTopProductsByCategories = async () => {
  // Используем публичный endpoint для получения топ продуктов по всем категориям
  return strapiFetch({
    path: `/api/products/public/top-by-categories`,
    method: "GET",
  });
};

// Search products by title or seller name (public)
export const searchProductsPublic = async (params?: {
  search: string;
  categorySlug?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  sort?: string;
}) => {
  const queryParams = new URLSearchParams();

  if (params?.search) {
    queryParams.append("search", params.search);
  }

  if (params?.categorySlug) {
    queryParams.append("filters[categorySlug]", params.categorySlug);
  }

  if (params?.priceRange?.min !== undefined) {
    queryParams.append(
      "filters[priceRange][min]",
      params.priceRange.min.toString()
    );
  }

  if (params?.priceRange?.max !== undefined) {
    queryParams.append(
      "filters[priceRange][max]",
      params.priceRange.max.toString()
    );
  }

  if (params?.pagination?.page) {
    queryParams.append("pagination[page]", params.pagination.page.toString());
  }

  if (params?.pagination?.pageSize) {
    queryParams.append(
      "pagination[pageSize]",
      params.pagination.pageSize.toString()
    );
  }

  if (params?.sort) {
    queryParams.append("sort", params.sort);
  }

  const queryString = queryParams.toString();
  const path = `/api/products/search/public${
    queryString ? `?${queryString}` : ""
  }`;

  return strapiFetch({
    path,
    method: "GET",
  });
};

// Search products by title or seller name (authenticated)
export const searchProducts = async (params?: {
  search: string;
  categorySlug?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  sort?: string;
}) => {
  const token = getSessionTokenFromCookie();
  if (!token) {
    throw new Error("Authentication required");
  }

  const queryParams = new URLSearchParams();

  if (params?.search) {
    queryParams.append("search", params.search);
  }

  if (params?.categorySlug) {
    queryParams.append("filters[categorySlug]", params.categorySlug);
  }

  if (params?.priceRange?.min !== undefined) {
    queryParams.append(
      "filters[priceRange][min]",
      params.priceRange.min.toString()
    );
  }

  if (params?.priceRange?.max !== undefined) {
    queryParams.append(
      "filters[priceRange][max]",
      params.priceRange.max.toString()
    );
  }

  if (params?.pagination?.page) {
    queryParams.append("pagination[page]", params.pagination.page.toString());
  }

  if (params?.pagination?.pageSize) {
    queryParams.append(
      "pagination[pageSize]",
      params.pagination.pageSize.toString()
    );
  }

  if (params?.sort) {
    queryParams.append("sort", params.sort);
  }

  const queryString = queryParams.toString();
  const path = `/api/products/search${queryString ? `?${queryString}` : ""}`;

  return strapiFetchAuth({
    path,
    method: "GET",
    token,
  });
};

// Search sellers by name or company (public)
export const searchSellersPublic = async (params?: {
  search: string;
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  sort?: string;
}) => {
  const queryParams = new URLSearchParams();

  if (params?.search) {
    queryParams.append("search", params.search);
  }

  if (params?.pagination?.page) {
    queryParams.append("pagination[page]", params.pagination.page.toString());
  }

  if (params?.pagination?.pageSize) {
    queryParams.append(
      "pagination[pageSize]",
      params.pagination.pageSize.toString()
    );
  }

  if (params?.sort) {
    queryParams.append("sort", params.sort);
  }

  const queryString = queryParams.toString();
  const path = `/api/user-search/sellers/public${
    queryString ? `?${queryString}` : ""
  }`;

  return strapiFetch({
    path,
    method: "GET",
  });
};

// Search sellers by name or company (authenticated)
export const searchSellers = async (params?: {
  search: string;
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  sort?: string;
}) => {
  const token = getSessionTokenFromCookie();
  if (!token) {
    throw new Error("Authentication required");
  }

  const queryParams = new URLSearchParams();

  if (params?.search) {
    queryParams.append("search", params.search);
  }

  if (params?.pagination?.page) {
    queryParams.append("pagination[page]", params.pagination.page.toString());
  }

  if (params?.pagination?.pageSize) {
    queryParams.append(
      "pagination[pageSize]",
      params.pagination.pageSize.toString()
    );
  }

  if (params?.sort) {
    queryParams.append("sort", params.sort);
  }

  const queryString = queryParams.toString();
  const path = `/api/user-search/sellers${
    queryString ? `?${queryString}` : ""
  }`;

  return strapiFetchAuth({
    path,
    method: "GET",
    token,
  });
};

// Certificate API functions
export const createCertificate = async ({
  data,
  files,
}: {
  data: {
    title: string;
    description?: string;
    certificateType: "product" | "seller";
    issuedBy: string;
    issuedDate: string;
    expiryDate?: string;
    certificateNumber?: string;
    status?: "active" | "expired" | "revoked";
    product?: number;
    seller?: number;
  };
  files?: File[];
}) => {
  const token = getSessionTokenFromCookie();
  if (!token) {
    throw new Error("Authentication required");
  }

  // If files are provided, use FormData for file upload
  if (files && files.length > 0) {
    console.log("Creating certificate with files:", files);
    const formData = new FormData();

    // Create the data object with proper structure
    const certificateData = {
      title: data.title,
      description: data.description,
      certificateType: data.certificateType,
      issuedBy: data.issuedBy,
      issuedDate: data.issuedDate,
      expiryDate: data.expiryDate,
      certificateNumber: data.certificateNumber,
      status: data.status || "active",
      product: data.product,
    };

    formData.append("data", JSON.stringify(certificateData));

    // Since certificateFile is single file (not multiple), we only take the first file
    const file = files[0];
    console.log(`Adding certificate file:`, file.name, file.size);
    formData.append(`files.certificateFile`, file);

    console.log("FormData created, sending to Strapi...");
    console.log("Certificate data:", certificateData);

    return strapiFetchAuth({
      path: "/api/certificates",
      method: "POST",
      body: formData,
      token,
    });
  }

  // Otherwise, use regular JSON request
  const certificateData = {
    title: data.title,
    description: data.description,
    certificateType: data.certificateType,
    issuedBy: data.issuedBy,
    issuedDate: data.issuedDate,
    expiryDate: data.expiryDate,
    certificateNumber: data.certificateNumber,
    status: data.status || "active",
    product: data.product,
  };

  console.log("Creating certificate with JSON:", certificateData);

  return strapiFetchAuth({
    path: "/api/certificates",
    method: "POST",
    body: {
      data: certificateData,
    },
    token,
  });
};

export const getCertificates = async (params?: {
  certificateType?: "product" | "seller";
  product?: number;
  seller?: number;
  status?: "active" | "expired" | "revoked";
}) => {
  const queryParams = new URLSearchParams();

  if (params?.certificateType) {
    queryParams.append("filters[certificateType][$eq]", params.certificateType);
  }

  if (params?.product) {
    queryParams.append("filters[product][$eq]", params.product.toString());
  }

  if (params?.seller) {
    queryParams.append("filters[seller][$eq]", params.seller.toString());
  }

  if (params?.status) {
    queryParams.append("filters[status][$eq]", params.status);
  }

  queryParams.append("populate", "*");

  const queryString = queryParams.toString();
  const path = `/api/certificates${queryString ? `?${queryString}` : ""}`;

  const token = getSessionTokenFromCookie();
  if (!token) {
    throw new Error("Authentication required");
  }

  return strapiFetchAuth({
    path,
    method: "GET",
    token,
    cache: 0,
  });
};

export const getCertificatesPublic = async (params?: {
  certificateType?: "product" | "seller";
  product?: number;
  seller?: number;
  status?: "active" | "expired" | "revoked";
  sort?: string;
  pagination?: { page?: number; pageSize?: number };
}) => {
  const queryParams = new URLSearchParams();

  if (params?.certificateType) {
    queryParams.append("filters[certificateType][$eq]", params.certificateType);
  }
  if (params?.product) {
    queryParams.append("filters[product][$eq]", params.product.toString());
  }
  if (params?.seller) {
    queryParams.append("filters[seller][$eq]", params.seller.toString());
  }
  if (params?.status) {
    queryParams.append("filters[status][$eq]", params.status);
  }
  if (params?.sort) {
    queryParams.append("sort", params.sort);
  }
  if (params?.pagination?.page) {
    queryParams.append("pagination[page]", String(params.pagination.page));
  }
  if (params?.pagination?.pageSize) {
    queryParams.append(
      "pagination[pageSize]",
      String(params.pagination.pageSize)
    );
  }
  queryParams.append("populate", "*");

  const queryString = queryParams.toString();
  const path = `/api/certificates/public${
    queryString ? `?${queryString}` : ""
  }`;

  return strapiFetch({ path, method: "GET" });
};

export const getCertificatesByUser = async (
  userId: number,
  params?: {
    certificateType?: "product" | "seller";
    status?: "active" | "expired" | "revoked";
    sort?: string;
    pagination?: { page?: number; pageSize?: number };
  }
) => {
  const queryParams = new URLSearchParams();
  if (params?.certificateType) {
    queryParams.append("filters[certificateType][$eq]", params.certificateType);
  }
  if (params?.status) {
    queryParams.append("filters[status][$eq]", params.status);
  }
  if (params?.sort) {
    queryParams.append("sort", params.sort);
  }
  if (params?.pagination?.page) {
    queryParams.append("pagination[page]", String(params.pagination.page));
  }
  if (params?.pagination?.pageSize) {
    queryParams.append(
      "pagination[pageSize]",
      String(params.pagination.pageSize)
    );
  }
  queryParams.append("populate", "*");

  const queryString = queryParams.toString();
  const path = `/api/certificates/by-user/${userId}${
    queryString ? `?${queryString}` : ""
  }`;

  // Endpoint is public per backend config
  return strapiFetch({ path, method: "GET" });
};

export const getCertificatesByProduct = async (
  productId: number,
  params?: {
    certificateType?: "product" | "seller";
    status?: "active" | "expired" | "revoked";
    sort?: string;
    pagination?: { page?: number; pageSize?: number };
  }
) => {
  const queryParams = new URLSearchParams();
  if (params?.certificateType) {
    queryParams.append("filters[certificateType][$eq]", params.certificateType);
  }
  if (params?.status) {
    queryParams.append("filters[status][$eq]", params.status);
  }
  if (params?.sort) {
    queryParams.append("sort", params.sort);
  }
  if (params?.pagination?.page) {
    queryParams.append("pagination[page]", String(params.pagination.page));
  }
  if (params?.pagination?.pageSize) {
    queryParams.append(
      "pagination[pageSize]",
      String(params.pagination.pageSize)
    );
  }
  queryParams.append("populate", "*");

  const queryString = queryParams.toString();
  const path = `/api/certificates/by-product/${productId}${
    queryString ? `?${queryString}` : ""
  }`;

  // Endpoint is public per backend config
  return strapiFetch({ path, method: "GET" });
};

export const updateCertificate = async ({
  id,
  data,
}: {
  id: number;
  data: {
    title?: string;
    description?: string;
    certificateType?: "product" | "seller";
    issuedBy?: string;
    issuedDate?: string;
    expiryDate?: string;
    certificateNumber?: string;
    status?: "active" | "expired" | "revoked";
    product?: number;
    seller?: number;
  };
}) => {
  const token = getSessionTokenFromCookie();
  if (!token) {
    throw new Error("Authentication required");
  }

  return strapiFetchAuth({
    path: `/api/certificates/${id}`,
    method: "PUT",
    body: {
      data,
    },
    token,
  });
};

export const deleteCertificate = async ({ id }: { id: number }) => {
  const token = getSessionTokenFromCookie();
  if (!token) {
    throw new Error("Authentication required");
  }

  return strapiFetchAuth({
    path: `/api/certificates/${id}`,
    method: "DELETE",
    token,
  });
};

// Seller Meta API functions (public)
export const getSellerMetas = async (params?: {
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  sort?: string;
}) => {
  const queryParams = new URLSearchParams();

  if (params?.sort) {
    queryParams.append("sort", params.sort);
  }

  const page = params?.pagination?.page || 1;
  const pageSize = params?.pagination?.pageSize || 10;

  queryParams.append("pagination[page]", page.toString());
  queryParams.append("pagination[pageSize]", pageSize.toString());

  const queryString = queryParams.toString();
  const path = `/api/seller-metas/public${
    queryString ? `?${queryString}` : ""
  }`;

  return strapiFetch({
    path,
    method: "GET",
  });
};

export const getSellerMetaById = async (id: number) => {
  return strapiFetch({
    path: `/api/seller-metas/public/${id}`,
    method: "GET",
  });
};

export const getSellerMetaBySellerId = async (sellerId: number) => {
  return strapiFetch({
    path: `/api/seller-metas/public/seller/${sellerId}`,
    method: "GET",
  });
};

// Promo API (public)
export const getPromos = async (params?: {
  category?: number;
  categorySlug?: string;
}) => {
  const queryParams = new URLSearchParams();

  if (params?.category) {
    queryParams.append("category", params.category.toString());
  }

  if (params?.categorySlug) {
    queryParams.append("categorySlug", params.categorySlug);
  }

  const queryString = queryParams.toString();
  const path = `/api/promos/public${queryString ? `?${queryString}` : ""}`;

  return strapiFetch({
    path,
    method: "GET",
  });
};

export const getPromoById = async (id: number) => {
  return strapiFetch({
    path: `/api/promos/public/${id}`,
    method: "GET",
  });
};

// Elasticsearch-powered search (public)
export const searchProductsElasticPublic = async (params?: {
  search?: string;
  categorySlug?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  tags?: string[];
  status?: string;
  availability?: string[];
  condition?: string[];
  subcategories?: string[];
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  sort?: string;
}) => {
  const queryParams = new URLSearchParams();

  if (params?.search) {
    queryParams.append("search", params.search);
  }

  if (params?.categorySlug) {
    queryParams.append("categorySlug", params.categorySlug);
  }

  if (params?.priceRange) {
    queryParams.append("priceRange", JSON.stringify(params.priceRange));
  }

  if (params?.tags && params.tags.length > 0) {
    params.tags.forEach((tag) => queryParams.append("tags", tag));
  }

  if (params?.status) {
    queryParams.append("status", params.status);
  }

  if (params?.availability && params.availability.length > 0) {
    params.availability.forEach((availability) =>
      queryParams.append("availability", availability)
    );
  }

  if (params?.condition && params.condition.length > 0) {
    params.condition.forEach((condition) =>
      queryParams.append("condition", condition)
    );
  }

  if (params?.subcategories && params.subcategories.length > 0) {
    params.subcategories.forEach((subcategory) =>
      queryParams.append("subcategories", subcategory)
    );
  }

  if (params?.pagination?.page) {
    queryParams.append("page", params.pagination.page.toString());
  }

  if (params?.pagination?.pageSize) {
    queryParams.append("pageSize", params.pagination.pageSize.toString());
  }

  if (params?.sort) {
    queryParams.append("sort", params.sort);
  }

  const queryString = queryParams.toString();
  const path = `/api/products/search/elastic/public${
    queryString ? `?${queryString}` : ""
  }`;

  return strapiFetch({
    path,
    method: "GET",
  });
};

// Elasticsearch-powered search (authenticated)
export const searchProductsElastic = async (params?: {
  search?: string;
  categorySlug?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  tags?: string[];
  status?: string;
  availability?: string[];
  condition?: string[];
  subcategories?: string[];
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  sort?: string;
}) => {
  const token = getSessionTokenFromCookie();
  if (!token) {
    throw new Error("Authentication required");
  }

  const queryParams = new URLSearchParams();

  if (params?.search) {
    queryParams.append("search", params.search);
  }

  if (params?.categorySlug) {
    queryParams.append("categorySlug", params.categorySlug);
  }

  if (params?.priceRange) {
    queryParams.append("priceRange", JSON.stringify(params.priceRange));
  }

  if (params?.tags && params.tags.length > 0) {
    params.tags.forEach((tag) => queryParams.append("tags", tag));
  }

  if (params?.status) {
    queryParams.append("status", params.status);
  }

  if (params?.availability && params.availability.length > 0) {
    params.availability.forEach((availability) =>
      queryParams.append("availability", availability)
    );
  }

  if (params?.condition && params.condition.length > 0) {
    params.condition.forEach((condition) =>
      queryParams.append("condition", condition)
    );
  }

  if (params?.subcategories && params.subcategories.length > 0) {
    params.subcategories.forEach((subcategory) =>
      queryParams.append("subcategories", subcategory)
    );
  }

  if (params?.pagination?.page) {
    queryParams.append("page", params.pagination.page.toString());
  }

  if (params?.pagination?.pageSize) {
    queryParams.append("pageSize", params.pagination.pageSize.toString());
  }

  if (params?.sort) {
    queryParams.append("sort", params.sort);
  }

  const queryString = queryParams.toString();
  const path = `/api/products/search/elastic${
    queryString ? `?${queryString}` : ""
  }`;

  return strapiFetchAuth({
    path,
    method: "GET",
    token,
  });
};

// Get product aggregations for filters (public)
export const getProductAggregationsPublic = async (params?: {
  categorySlug?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  tags?: string[];
  status?: string;
  availability?: string[];
  condition?: string[];
  subcategories?: string[];
}) => {
  const queryParams = new URLSearchParams();

  if (params?.categorySlug) {
    queryParams.append("categorySlug", params.categorySlug);
  }

  if (params?.priceRange) {
    queryParams.append("priceRange", JSON.stringify(params.priceRange));
  }

  if (params?.tags && params.tags.length > 0) {
    params.tags.forEach((tag) => queryParams.append("tags", tag));
  }

  if (params?.status) {
    queryParams.append("status", params.status);
  }

  if (params?.availability && params.availability.length > 0) {
    params.availability.forEach((availability) =>
      queryParams.append("availability", availability)
    );
  }

  if (params?.condition && params.condition.length > 0) {
    params.condition.forEach((condition) =>
      queryParams.append("condition", condition)
    );
  }

  if (params?.subcategories && params.subcategories.length > 0) {
    params.subcategories.forEach((subcategory) =>
      queryParams.append("subcategories", subcategory)
    );
  }

  const queryString = queryParams.toString();
  const path = `/api/products/aggregations/public${
    queryString ? `?${queryString}` : ""
  }`;

  return strapiFetch({
    path,
    method: "GET",
  });
};

// Get product aggregations for filters (authenticated)
export const getProductAggregations = async (params?: {
  categorySlug?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  tags?: string[];
  status?: string;
  availability?: string[];
  condition?: string[];
  subcategories?: string[];
}) => {
  const token = getSessionTokenFromCookie();
  if (!token) {
    throw new Error("Authentication required");
  }

  const queryParams = new URLSearchParams();

  if (params?.categorySlug) {
    queryParams.append("categorySlug", params.categorySlug);
  }

  if (params?.priceRange) {
    queryParams.append("priceRange", JSON.stringify(params.priceRange));
  }

  if (params?.tags && params.tags.length > 0) {
    params.tags.forEach((tag) => queryParams.append("tags", tag));
  }

  if (params?.status) {
    queryParams.append("status", params.status);
  }

  if (params?.availability && params.availability.length > 0) {
    params.availability.forEach((availability) =>
      queryParams.append("availability", availability)
    );
  }

  if (params?.condition && params.condition.length > 0) {
    params.condition.forEach((condition) =>
      queryParams.append("condition", condition)
    );
  }

  if (params?.subcategories && params.subcategories.length > 0) {
    params.subcategories.forEach((subcategory) =>
      queryParams.append("subcategories", subcategory)
    );
  }

  const queryString = queryParams.toString();
  const path = `/api/products/aggregations${
    queryString ? `?${queryString}` : ""
  }`;

  return strapiFetchAuth({
    path,
    method: "GET",
    token,
  });
};

// Elasticsearch-based category products
export const getCategoryProductsElastic = async (params: {
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
}) => {
  const queryParams = new URLSearchParams();

  if (params.search) {
    queryParams.append("search", params.search);
  }

  if (params.priceRange) {
    queryParams.append("priceRange", JSON.stringify(params.priceRange));
  }

  if (params.currency) {
    queryParams.append("currency", params.currency);
  }

  if (params.tags && params.tags.length > 0) {
    params.tags.forEach((tag) => queryParams.append("tags", tag));
  }

  if (params.status) {
    queryParams.append("status", params.status);
  }

  if (params.sort) {
    queryParams.append("sort", params.sort);
  }

  if (params.page) {
    queryParams.append("page", params.page.toString());
  }

  if (params.pageSize) {
    queryParams.append("pageSize", params.pageSize.toString());
  }

  if (params.availability && params.availability.length > 0) {
    params.availability.forEach((availability) =>
      queryParams.append("availability", availability)
    );
  }

  if (params.condition && params.condition.length > 0) {
    params.condition.forEach((condition) =>
      queryParams.append("condition", condition)
    );
  }

  if (params.categories && params.categories.length > 0) {
    params.categories.forEach((category) =>
      queryParams.append("categories", category)
    );
  }

  const queryString = queryParams.toString();
  const path = `/api/categories/public/slug/${params.categorySlug}/products${
    queryString ? `?${queryString}` : ""
  }`;

  return strapiFetch({
    path,
    method: "GET",
  });
};

// Elasticsearch-based category filters
export const getCategoryFiltersElastic = async (params: {
  categorySlug: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  currency?: string;
  tags?: string[];
  status?: string;
}) => {
  const queryParams = new URLSearchParams();

  if (params.priceRange) {
    queryParams.append("priceRange", JSON.stringify(params.priceRange));
  }

  if (params.currency) {
    queryParams.append("currency", params.currency);
  }

  if (params.tags && params.tags.length > 0) {
    params.tags.forEach((tag) => queryParams.append("tags", tag));
  }

  if (params.status) {
    queryParams.append("status", params.status);
  }

  const queryString = queryParams.toString();
  const path = `/api/categories/public/slug/${params.categorySlug}/filters${
    queryString ? `?${queryString}` : ""
  }`;

  return strapiFetch({
    path,
    method: "GET",
  });
};

// Elasticsearch-based seller products
export const getSellerProductsElastic = async (params: {
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
}) => {
  const queryParams = new URLSearchParams();

  if (params.search) {
    queryParams.append("search", params.search);
  }

  if (params.priceRange) {
    queryParams.append("priceRange", JSON.stringify(params.priceRange));
  }

  if (params.tags && params.tags.length > 0) {
    params.tags.forEach((tag) => queryParams.append("tags", tag));
  }

  if (params.status) {
    queryParams.append("status", params.status);
  }

  if (params.sort) {
    queryParams.append("sort", params.sort);
  }

  if (params.page) {
    queryParams.append("page", params.page.toString());
  }

  if (params.pageSize) {
    queryParams.append("pageSize", params.pageSize.toString());
  }

  if (params.availability && params.availability.length > 0) {
    params.availability.forEach((availability) =>
      queryParams.append("availability", availability)
    );
  }

  if (params.condition && params.condition.length > 0) {
    params.condition.forEach((condition) =>
      queryParams.append("condition", condition)
    );
  }

  if (params.categories && params.categories.length > 0) {
    params.categories.forEach((category) =>
      queryParams.append("categories", category)
    );
  }

  const queryString = queryParams.toString();
  const path = `/api/products/seller/${params.sellerId}/search/elastic${
    queryString ? `?${queryString}` : ""
  }`;

  return strapiFetch({
    path,
    method: "GET",
  });
};

// Elasticsearch-based seller product filters
export const getSellerProductFiltersElastic = async (params: {
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
}) => {
  const queryParams = new URLSearchParams();

  if (params.priceRange) {
    queryParams.append("priceRange", JSON.stringify(params.priceRange));
  }

  if (params.tags && params.tags.length > 0) {
    params.tags.forEach((tag) => queryParams.append("tags", tag));
  }

  if (params.status) {
    queryParams.append("status", params.status);
  }

  if (params.availability && params.availability.length > 0) {
    params.availability.forEach((availability) =>
      queryParams.append("availability", availability)
    );
  }

  if (params.condition && params.condition.length > 0) {
    params.condition.forEach((condition) =>
      queryParams.append("condition", condition)
    );
  }

  if (params.categories && params.categories.length > 0) {
    params.categories.forEach((category) =>
      queryParams.append("categories", category)
    );
  }

  const queryString = queryParams.toString();
  const path = `/api/products/seller/${params.sellerId}/aggregations${
    queryString ? `?${queryString}` : ""
  }`;

  return strapiFetch({
    path,
    method: "GET",
  });
};

// User role management
export const changeUserRole = async ({
  userId,
  role,
}: {
  userId: number;
  role: "buyer" | "seller";
}) => {
  const token = getSessionTokenFromCookie();
  const path = `/api/user-role/${userId}`;

  return strapiFetchAuth({
    path,
    method: "PUT",
    body: { role },
    token: token || "",
  });
};
