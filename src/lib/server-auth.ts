import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./auth";
import type { UserProfile } from "./types";

export const getServerSessionToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("sessionToken")?.value || null;
};

export const getServerCurrentUser = async (): Promise<UserProfile | null> => {
  const token = await getServerSessionToken();
  if (!token) return null;

  try {
    const response = await getCurrentUser(token);
    // getCurrentUser возвращает ApiResponse<UserProfile>, который может быть UserProfile или ErrorResponse
    if (response && "id" in response && !("error" in response)) {
      return response as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error getting current user on server:", error);
    return null;
  }
};

export const requireAuth = async (): Promise<UserProfile> => {
  const user = await getServerCurrentUser();
  if (!user) {
    redirect("/auth");
  }
  return user;
};
