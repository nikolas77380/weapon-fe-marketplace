import { serialize } from "cookie";
import { BuyerFormValues } from "@/schemas/buyerSchema";
import { SellerFormValues } from "@/schemas/sellerSchema";
import { LoginFormValues } from "@/schemas/loginSchema";
import { strapiFetch, strapiFetchAuth } from "./strapi";
import { setClientCookie, deleteClientCookie } from "./cookies";
// @ts-ignore: './types' module is missing, so ignore type import errors for now
import type { AuthResponse, UserProfile, ApiResponse } from "./types";

const setSessionTokenCookie = (token: string) => {
  setClientCookie("sessionToken", token, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

const clearSessionTokenCookie = () => {
  deleteClientCookie("sessionToken");
};

// Public authentication routes (no JWT required)
export const registerBuyer = async (
  values: BuyerFormValues
): Promise<ApiResponse<AuthResponse>> => {
  const { displayName, email, password } = values;
  const response = await strapiFetch({
    path: "/api/auth/local/register",
    method: "POST",
    body: {
      username: displayName,
      email,
      password,
      displayName,
      provider: "local",
      storeRole: "buyer",
    },
  });

  console.log("registerBuyer response:", response);

  if (response && "jwt" in response) {
    setSessionTokenCookie(response.jwt);
  }

  return response;
};

export const registerSeller = async (
  values: SellerFormValues
): Promise<ApiResponse<AuthResponse>> => {
  const { fullName, email, password } = values;
  const response = await strapiFetch({
    path: "/api/auth/local/register",
    method: "POST",
    body: {
      username: fullName,
      email,
      password,
      displayName: fullName,
      provider: "local",
      storeRole: "seller",
    },
  });

  console.log("registerSeller response:", response);

  if (response && "jwt" in response) {
    setSessionTokenCookie(response.jwt);
  }

  return response;
};

export const login = async (
  values: LoginFormValues
): Promise<ApiResponse<AuthResponse>> => {
  console.log("login values:", values);
  const response = await strapiFetch({
    path: "/api/auth/local",
    method: "POST",
    body: { identifier: values.email, password: values.password },
  });

  if (response && "jwt" in response) {
    setSessionTokenCookie(response.jwt);
  }

  return response;
};

export const forgotPassword = async (
  email: string
): Promise<ApiResponse<{ ok: boolean }>> => {
  const response = await strapiFetch({
    path: "/api/auth/forgot-password",
    method: "POST",
    body: { email },
  });

  return response;
};

export const resetPassword = async (
  code: string,
  password: string,
  passwordConfirmation: string
): Promise<ApiResponse<AuthResponse>> => {
  const response = await strapiFetch({
    path: "/api/auth/reset-password",
    method: "POST",
    body: {
      code,
      password,
      passwordConfirmation,
    },
  });

  if (response && "jwt" in response) {
    setSessionTokenCookie(response.jwt);
  }

  return response;
};

// Protected routes (JWT required)
export const getCurrentUser = async (
  token: string
): Promise<ApiResponse<UserProfile>> => {
  const response = await strapiFetchAuth({
    path: "/api/users/me",
    method: "GET",
    token,
  });

  return response;
};

export const updateProfile = async (
  token: string,
  data: Partial<UserProfile>
): Promise<ApiResponse<UserProfile>> => {
  const response = await strapiFetchAuth({
    path: "/api/users/me",
    method: "PUT",
    body: data,
    token,
  });

  return response;
};

export const changePassword = async (
  token: string,
  currentPassword: string,
  newPassword: string
): Promise<ApiResponse<UserProfile>> => {
  const response = await strapiFetchAuth({
    path: "/api/users/me",
    method: "PUT",
    body: {
      currentPassword,
      password: newPassword,
    },
    token,
  });

  return response;
};

export const logout = async (): Promise<ApiResponse<{ ok: boolean }>> => {
  clearSessionTokenCookie();
  return { ok: true };
};

export const getSessionTokenFromCookie = (): string | null => {
  if (typeof window === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; sessionToken=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
};
