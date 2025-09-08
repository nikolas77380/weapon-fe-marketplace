"use client";

import { useSendbird, useSendbirdStateContext } from "@sendbird/uikit-react";
import { useAuthContext } from "@/context/AuthContext";
import { SendbirdContextValue } from "@/types/sendbird";
import { SendbirdUtils } from "@/lib/sendbird-utils";
import { useMemo, useState, useEffect } from "react";

export const useSendbirdSDK = (): SendbirdContextValue & {
  utils: SendbirdUtils | null;
  isReady: boolean;
  sdkStatus: unknown;
} => {
  const authContext = useAuthContext();
  const [isReady, setIsReady] = useState(false);

  // Всегда вызываем хуки
  const sendbirdContext = useSendbird();
  const state = useSendbirdStateContext();

  const sendbird = sendbirdContext?.actions ? sendbirdContext : null;

  // Всегда вызываем useEffect и useMemo
  useEffect(() => {
    if (sendbird && state) {
      const checkSDKReady = () => {
        const sdk = state?.stores?.sdkStore?.sdk;
        const isSDKReady = !!(
          sdk &&
          sdk.groupChannel &&
          sdk.connectionState === "OPEN"
        );
        if (isSDKReady) {
          setIsReady(true);
        } else {
          // Проверяем только если еще не готов, и устанавливаем таймаут только один раз
          setTimeout(checkSDKReady, 1000); // Увеличиваем интервал до 1 секунды
        }
      };

      checkSDKReady();
    } else {
      setIsReady(false);
    }
  }, [sendbird, state]);

  const connectionState = state?.stores?.sdkStore?.sdk?.connectionState;
  const isConnected = connectionState === "OPEN";

  const utils = useMemo(() => {
    if (state?.stores?.sdkStore?.sdk) {
      return new SendbirdUtils(state);
    }
    return null;
  }, [state]);

  const sdkStatus = utils?.getSDKStatus() || null;

  if (!authContext || authContext.currentUserLoading) {
    return {
      sendbird: null,
      currentUser: null,
      isConnected: false,
      connectionState: undefined,
      utils: null,
      isReady: false,
      sdkStatus: null,
    };
  }

  if (!authContext.currentUser) {
    return {
      sendbird: null,
      currentUser: null,
      isConnected: false,
      connectionState: undefined,
      utils: null,
      isReady: false,
      sdkStatus: null,
    };
  }

  return {
    sendbird,
    currentUser: authContext.currentUser as unknown as {
      id: number;
      [key: string]: unknown;
    },
    isConnected,
    connectionState,
    utils,
    isReady,
    sdkStatus,
  };
};
