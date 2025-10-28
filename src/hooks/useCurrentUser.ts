import { useState, useCallback } from "react";
import { UserProfile } from "@/lib/types";
import { getCurrentUser, getSessionTokenFromCookie } from "@/lib/auth";

export const useCurrentUser = (initialUser: UserProfile) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(initialUser);
  const [isUpdating, setIsUpdating] = useState(false);

  const refreshUserData = useCallback(async () => {
    setIsUpdating(true);
    try {
      const token = getSessionTokenFromCookie();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const updatedUser = await getCurrentUser(token);
      if (updatedUser && "id" in updatedUser) {
        setCurrentUser(updatedUser);
        return updatedUser;
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const updateUserData = useCallback((newUserData: UserProfile) => {
    setCurrentUser(newUserData);
  }, []);

  return {
    currentUser,
    refreshUserData,
    updateUserData,
    isUpdating,
  };
};
