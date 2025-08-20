// API Response types
export interface AuthResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
    displayName?: string;
    storeRole?: string;
    role: {
      id: number;
      name: string;
      type: string;
    };
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
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
  storeRole?: string;
  role: {
    id: number;
    name: string;
    type: string;
  };
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
}

// Generic API response wrapper
export type ApiResponse<T> = T | ErrorResponse;
