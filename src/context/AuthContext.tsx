"use client";

import { getCurrentUserFromCookie, logout } from "@/lib/auth";
import { UserProfile } from "@/lib/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useRouter } from "next/navigation";

interface AuthContextContextValue {
  currentUser: UserProfile | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  currentUserLoading: boolean;
  setCurrentUserLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fetchUser: () => Promise<void>;
  handleLogout: () => Promise<void>;
  handleEmailConfirmation: (confirmationToken: string) => Promise<boolean>;
  chatSocketConnected: boolean;
  chatSocketError: string | null;
  reconnectChatSocket: () => void;
  socket: any; // Socket instance from useChatSocket
}

export const AuthContext = createContext<AuthContextContextValue | null>(null);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentUserLoading, setCurrentUserLoading] = useState(true);
  const router = useRouter();
  const {
    socket,
    isConnected: chatSocketConnected,
    lastError: chatSocketError,
    forceReconnect,
  } = useChatSocket(!!currentUser);
  const fetchUser = async () => {
    try {
      const userData = await getCurrentUserFromCookie();
      setCurrentUser(userData);
    } catch {
      setCurrentUser(null);
    } finally {
      setCurrentUserLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    setCurrentUserLoading(false);
    // Use window.location for a full page reload to ensure all state is cleared
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  const handleEmailConfirmation = async (
    confirmationToken: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
        }/api/auth/email-confirmation?confirmation=${confirmationToken}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Сохраняем JWT токен и пользователя в localStorage
        if (data.jwt) {
          localStorage.setItem("jwt", data.jwt);
        }

        // Обновляем текущего пользователя
        setCurrentUser(data.user);
        return true;
      } else {
        console.error("Email confirmation failed:", data.error || data.message);
        return false;
      }
    } catch (error) {
      console.error("Error confirming email:", error);
      return false;
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (chatSocketError) {
      console.warn("[AuthContext] Chat socket error:", chatSocketError);
    }
  }, [chatSocketError]);
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        currentUserLoading,
        setCurrentUserLoading,
        fetchUser,
        handleLogout,
        handleEmailConfirmation,
        chatSocketConnected,
        chatSocketError,
        reconnectChatSocket: forceReconnect,
        socket,
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
