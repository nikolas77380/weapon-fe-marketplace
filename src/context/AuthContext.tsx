"use client";

import { getCurrentUserFromCookie, logout } from "@/lib/auth";
import { UserProfile } from "@/lib/types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AuthContextContextValue {
  currentUser: UserProfile | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  currentUserLoading: boolean;
  setCurrentUserLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fetchUser: () => Promise<void>;
  handleLogout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextContextValue | null>(null);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentUserLoading, setCurrentUserLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const userData = await getCurrentUserFromCookie();
      setCurrentUser(userData);
    } catch (error) {
      console.error("Error fetching user:", error);
      setCurrentUser(null);
    } finally {
      setCurrentUserLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        currentUserLoading,
        setCurrentUserLoading,
        fetchUser,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextlProvider"
    );
  }
  return context;
};