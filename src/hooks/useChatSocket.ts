import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getSessionTokenFromCookie } from "@/lib/auth";

type ChatSocket = Socket | null;

const MESSAGE_SERVICE_URL =
  process.env.NEXT_PUBLIC_MESSAGE_SERVICE_URL || "http://localhost:3010";

/**
 * Подключение к chat WebSocket только для авторизованных пользователей.
 * Возвращает активный socket и состояние соединения.
 */
export const useChatSocket = (shouldConnect: boolean) => {
  const socketRef = useRef<ChatSocket>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [connectionNonce, setConnectionNonce] = useState(0);

  const forceReconnect = useCallback(() => {
    console.log("[useChatSocket] Force reconnect triggered");
    setLastError(null);
    setConnectionNonce((prev) => prev + 1);
  }, []);

  useEffect(() => {
    console.log("[useChatSocket] Effect triggered", {
      shouldConnect,
      connectionNonce,
      hasSocket: !!socketRef.current,
    });

    // Очищаем старый сокет если есть
    if (socketRef.current) {
      console.log("[useChatSocket] Cleaning up old socket");
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    if (!shouldConnect) {
      console.log("[useChatSocket] Should not connect, skipping");
      setIsConnected(false);
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    const token = getSessionTokenFromCookie();
    if (!token) {
      console.log("[useChatSocket] No token found");
      setIsConnected(false);
      return;
    }

    console.log("[useChatSocket] Creating new socket connection");
    const socket = io(`${MESSAGE_SERVICE_URL}/chat`, {
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      auth: { token },
    });

    socketRef.current = socket;
    setLastError(null);

    const handleConnect = () => {
      console.log("[useChatSocket] Connected successfully");
      setIsConnected(true);
      setLastError(null);
    };

    const handleDisconnect = (reason: string) => {
      console.log("[useChatSocket] Disconnected:", reason);
      setIsConnected(false);
    };

    const handleConnectError = (error: Error) => {
      console.error("[useChatSocket] Connection error:", error.message);
      setLastError(error.message);
      setIsConnected(false);
    };

    const handleTokenExpired = () => {
      console.log("[useChatSocket] Token expired, attempting refresh");
      const freshToken = getSessionTokenFromCookie();
      if (freshToken) {
        socket.emit("auth:refresh-token", { token: freshToken });
      } else {
        console.log("[useChatSocket] No fresh token, triggering reconnect");
        setConnectionNonce((prev) => prev + 1);
      }
    };

    const handleAuthError = (payload: { error?: string }) => {
      console.error("[useChatSocket] Auth error:", payload?.error);
      setLastError(payload?.error || "Authentication error");
      setIsConnected(false);
      // Не вызываем disconnect тут, пусть socket.io сам попробует переподключиться
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("error", handleConnectError);
    socket.on("auth:token-expired", handleTokenExpired);
    socket.on("auth:error", handleAuthError);

    return () => {
      console.log("[useChatSocket] Cleanup triggered");
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("error", handleConnectError);
      socket.off("auth:token-expired", handleTokenExpired);
      socket.off("auth:error", handleAuthError);
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [shouldConnect, connectionNonce]);

  return { socket: socketRef.current, isConnected, lastError, forceReconnect };
};
