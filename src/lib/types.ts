// API Response types
export interface SellerMeta {
  id: number;
  UUID: string;
  specialisation?: string;
  sellerDescription?: string;
  companyName?: string;
  webSite?: string;
  phoneNumbers?: string;
  country?: string;
  address?: string;
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
    details?: any;
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

export interface MediaFile {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: any;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  description?: string;
  price: number;
  currency: string;
  sku?: string;
  status: "available" | "reserved" | "sold" | "archived";
  category?: Category;
  tags?: Tag[];
  seller?: {
    id: number;
    username: string;
    email: string;
    metadata?: SellerMeta;
  };
  images?: MediaFile[];
  certificates?: Certificate[];
  attributesJson?: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
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
  price: number;
  currency?: string;
  category: number;
  tags?: number[];
  sku?: string;
  status?: "available" | "reserved" | "sold" | "archived";
  attributesJson?: any;
}

export interface UpdateProductData {
  title?: string;
  description?: string;
  price?: number;
  currency?: string;
  category?: number;
  tags?: number[];
  sku?: string;
  status?: "available" | "reserved" | "sold" | "archived";
  attributesJson?: any;
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
