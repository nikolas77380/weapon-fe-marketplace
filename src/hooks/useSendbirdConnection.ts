"use client";

import { useSendbirdSDK } from "./useSendbird";
import { useSendbird } from "@sendbird/uikit-react";
import { useEffect, useState, useRef, useCallback } from "react";

export const useSendbirdConnection = () => {
  const { currentUser, isConnected, connectionState, isReady } =
    useSendbirdSDK();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const hasAttemptedConnection = useRef(false);
  const connectionAttempts = useRef(0);
  const maxConnectionAttempts = 3;

  let sendbirdContext = null;
  try {
    sendbirdContext = useSendbird();
  } catch (error) {
    console.log("Sendbird context not available:", error);
  }

  const connect = useCallback(async () => {
    if (
      !sendbirdContext?.actions?.connect ||
      isConnected ||
      !isReady ||
      !currentUser ||
      isConnecting ||
      connectionAttempts.current >= maxConnectionAttempts
    ) {
      return;
    }

    setIsConnecting(true);
    setConnectionError(null);
    connectionAttempts.current += 1;

    try {
      console.log(
        `Attempting to connect to Sendbird... (attempt ${connectionAttempts.current})`
      );
      await sendbirdContext.actions.connect({
        userId: currentUser.id.toString(),
      });
      console.log("Successfully connected to Sendbird");
      hasAttemptedConnection.current = true;
      setConnectionError(null);
    } catch (error) {
      console.error("Failed to connect to Sendbird:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Connection failed";
      setConnectionError(errorMessage);

      if (connectionAttempts.current >= maxConnectionAttempts) {
        setConnectionError(`${errorMessage} (max attempts reached)`);
      }
    } finally {
      setIsConnecting(false);
    }
  }, [sendbirdContext, isConnected, isReady, currentUser, isConnecting]);

  const disconnect = useCallback(async () => {
    if (!sendbirdContext?.actions?.disconnect || !isConnected) return;

    try {
      const logger = {
        info: () => {},
        warn: () => {},
        warning: () => {},
        error: () => {},
        debug: () => {},
      };

      await sendbirdContext.actions.disconnect({ logger });
      console.log("Disconnected from Sendbird");
      hasAttemptedConnection.current = false;
      connectionAttempts.current = 0;
      setConnectionError(null);
    } catch (error) {
      console.error("Failed to disconnect from Sendbird:", error);
    }
  }, [sendbirdContext, isConnected]);

  const resetConnection = useCallback(() => {
    setConnectionError(null);
    connectionAttempts.current = 0;
    hasAttemptedConnection.current = false;
  }, []);

  useEffect(() => {
    if (
      sendbirdContext?.actions?.connect &&
      !isConnected &&
      !isConnecting &&
      isReady &&
      currentUser &&
      !hasAttemptedConnection.current &&
      connectionAttempts.current < maxConnectionAttempts
    ) {
      connect();
    }
  }, [
    sendbirdContext,
    isConnected,
    isConnecting,
    isReady,
    currentUser,
    connect,
  ]);

  return {
    connect,
    disconnect,
    resetConnection,
    isConnecting,
    connectionError,
    isConnected,
    connectionState,
    isReady,
    hasUser: !!currentUser,
    connectionAttempts: connectionAttempts.current,
    maxConnectionAttempts,
    canRetry: connectionAttempts.current < maxConnectionAttempts,
  };
};
