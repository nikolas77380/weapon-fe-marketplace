// API Response types
export interface SellerMeta {
  id: number;
  UUID: string;
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
  avatar?: {
    id: number;
    documentId: string;
    name: string;
    url: string;
    ext: string;
    mime: string;
    size: number;
    width: number;
    height: number;
    hash: string;
    provider: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    folderPath: string;
    alternativeText?: string;
    caption?: string;
    previewUrl?: string;
    provider_metadata?: any;
    locale?: string;
    formats?: any;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent?: Category;
  children?: Category[];
  order: number;
  createdAt: string;
  updatedAt: string;
  translate_ua?: string;
  icon?: {
    url: string;
  };
}

export interface AuthResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
    displayName?: string;
    role: {
      id: number;
      name: string;
      type: string;
    };
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
    metadata?: SellerMeta;
  };
}

export interface ErrorResponse {
  error: {
    status: number;
    name: string;
    message: string;
    details?: unknown;
  };
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  displayName?: string;
  role: {
    id: number;
    name: string;
    type: string;
  };
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  metadata?: SellerMeta;
}

// Generic API response wrapper
export type ApiResponse<T> = T | ErrorResponse;

// Role constants
export const USER_ROLES = {
  SELLER: "seller",
  BUYER: "buyer",
  AUTHENTICATED: "authenticated",
  PUBLIC: "public",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

type AttributesJson = {
  condition?: string;
  model?: string;
  manufacturer?: string;
  count?: number;
};

export interface MediaFile {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: unknown;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  description?: string;
  priceUSD?: number;
  priceEUR?: number;
  priceUAH?: number;
  // Legacy fields for backward compatibility
  price?: number;
  currency?: string;
  sku?: string;
  status: "available" | "unavailable";
  condition: "new" | "used";
  category?: Category;
  tags?: Tag[];
  seller?: {
    id: number;
    username: string;
    email?: string;
    companyName?: string;
    metadata?: SellerMeta;
  };
  images?: MediaFile[];
  certificates?: Certificate[];
  attributesJson?: AttributesJson;
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  viewsCount: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  title: string;
  description?: string;
  // New format: price + currency
  price?: number;
  currency?: "USD" | "EUR" | "UAH";
  // Legacy format for backward compatibility
  priceUSD?: number;
  priceEUR?: number;
  priceUAH?: number;
  category: number;
  tags?: number[];
  sku?: string;
  status?: "available" | "unavailable";
  condition?: "new" | "used";
  videoUrl?: string;
  attributesJson?: AttributesJson;
}

export interface UpdateProductData {
  title?: string;
  description?: string;
  // New format: price + currency
  price?: number;
  currency?: "USD" | "EUR" | "UAH";
  // Legacy format for backward compatibility
  priceUSD?: number;
  category?: string;
  tags?: number[];
  sku?: string;
  status?: "available" | "unavailable";
  condition?: "new" | "used";
  videoUrl?: string;
  attributesJson?: AttributesJson;
}

export interface Certificate {
  id: number;
  title: string;
  description?: string;
  certificateType: "product" | "seller";
  issuedBy: string;
  issuedDate: string;
  expiryDate?: string;
  certificateNumber?: string;
  status: "active" | "expired" | "revoked";
  product?: {
    id: number;
    title: string;
  };
  seller?: {
    id: number;
    username: string;
    displayName: string;
  };
  certificateFile?: MediaFile;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface CreateCertificateData {
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
}

export interface UpdateCertificateData {
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
}

export type ImageType = {
  url?: string;
  formats?: Record<string, { url?: string }>;
};

// Promo types
export interface Promo {
  id: number;
  title?: string;
  description?: string;
  subtitle?: string;
  image?: MediaFile;
  category?: Category | null;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// User role management types
export interface ChangeUserRoleParams {
  userId: number;
  role: UserRole;
}

export interface ChangeUserRoleResponse {
  data: {
    id: number;
    username: string;
    email: string;
    displayName: string;
    role: {
      id: number;
      name: UserRole;
      description: string;
    };
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
  };
  message: string;
  previousRole: UserRole;
  newRole: UserRole;
}
