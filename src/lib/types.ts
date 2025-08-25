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
