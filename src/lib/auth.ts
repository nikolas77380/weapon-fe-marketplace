import { RegisterFormValues } from "@/schemas/registerSchema";
import { LoginFormValues } from "@/schemas/loginSchema";
import { strapiFetch, strapiFetchAuth } from "./strapi";
import { setClientCookie, deleteClientCookie } from "./cookies";
// @ts-ignore: './types' module is missing, so ignore type import errors for now
import type { AuthResponse, UserProfile, ApiResponse } from "./types";

const setSessionTokenCookie = (token: string, name?: string) => {
  setClientCookie(name || "sessionToken", token, {
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
  values: RegisterFormValues
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
      role: "buyer",
    },
  });

  console.log("registerBuyer response:", response);

  if (response && "jwt" in response) {
    setSessionTokenCookie(response.jwt);
    // Save sendbirdSessionToken if it exists in response
    if (response.sendbirdSessionToken) {
      setSessionTokenCookie(
        response.sendbirdSessionToken,
        "sendbirdSessionToken"
      );
    }
  }

  return response;
};

export const registerSeller = async (
  values: RegisterFormValues
): Promise<ApiResponse<AuthResponse>> => {
  const { displayName, email, password } = values;
  const response = await strapiFetch({
    path: "/api/auth/local/register",
    method: "POST",
    body: {
      username: displayName,
      email,
      password,
      displayName: displayName,
      provider: "local",
      role: "seller", // Use role instead of storeRole
    },
  });

  console.log("registerSeller response:", response);

  if (response && "jwt" in response) {
    setSessionTokenCookie(response.jwt);
    // Save sendbirdSessionToken if it exists in response
    if (response.sendbirdSessionToken) {
      setSessionTokenCookie(
        response.sendbirdSessionToken,
        "sendbirdSessionToken"
      );
    }

    // Get full user data with metadata only for sellers
    const fullUserData = await getCurrentUser(response.jwt);
    if (fullUserData && "id" in fullUserData) {
      return {
        jwt: response.jwt,
        user: fullUserData,
      };
    }
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
  console.log("login response:", response);

  if (response && "jwt" in response) {
    setSessionTokenCookie(response.jwt);
    // Save sendbirdSessionToken if it exists in response
    if (response.sendbirdSessionToken) {
      setSessionTokenCookie(
        response.sendbirdSessionToken,
        "sendbirdSessionToken"
      );
    }

    // Get full user data with metadata only for sellers
    if (response.user && response.user.role?.name === "seller") {
      const fullUserData = await getCurrentUser(response.jwt);
      if (fullUserData && "id" in fullUserData) {
        return {
          jwt: response.jwt,
          user: fullUserData,
        };
      }
    }
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
    // Save sendbirdSessionToken if it exists in response
    if (response.sendbirdSessionToken) {
      setSessionTokenCookie(
        response.sendbirdSessionToken,
        "sendbirdSessionToken"
      );
    }

    // Get full user data with metadata only for sellers
    if (response.user && response.user.role?.name === "seller") {
      const fullUserData = await getCurrentUser(response.jwt);
      if (fullUserData && "id" in fullUserData) {
        return {
          jwt: response.jwt,
          user: fullUserData,
        };
      }
    }
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
  deleteClientCookie("sendbirdSessionToken");
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

export const getSendbirdSessionTokenFromCookie = (): string | null => {
  if (typeof window === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; sendbirdSessionToken=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
};

export const getCurrentUserFromCookie =
  async (): Promise<UserProfile | null> => {
    const token = getSessionTokenFromCookie();
    if (!token) return null;

    try {
      const response = await getCurrentUser(token);
      if (response && "id" in response) {
        return response;
      }
      return null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  };

// Get user info from token
export const getUserFromToken = async (token: string) => {
  try {
    const response = await strapiFetchAuth({
      path: "/api/users/me",
      method: "GET",
      token,
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Get user error:", error);
    throw error;
  }
};
