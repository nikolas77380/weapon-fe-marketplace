"use client";

import { useSendbird, useSendbirdStateContext } from "@sendbird/uikit-react";
import { useAuthContext } from "@/context/AuthContext";
import { SendbirdContextValue } from "@/types/sendbird";
import { SendbirdUtils } from "@/lib/sendbird-utils";
import { useMemo, useState, useEffect } from "react";

export const useSendbirdSDK = (): SendbirdContextValue & {
  utils: SendbirdUtils | null;
  isReady: boolean;
  sdkStatus: any;
} => {
  const authContext = useAuthContext();
  const [isReady, setIsReady] = useState(false);

  let sendbirdContext = null;
  let state = null;

  try {
    sendbirdContext = useSendbird();
    state = useSendbirdStateContext();
  } catch (error) {
    console.log("Sendbird context not available yet:", error);
  }

  const sendbird = sendbirdContext?.actions?.connect ? sendbirdContext : null;

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

  // Убираем console.log, который выполняется при каждом рендере
  // console.log("useSendbirdSDK: connection state", {
  //   connectionState,
  //   isConnected,
  //   hasConnectMethod: !!sendbirdContext?.actions?.connect,
  //   hasDisconnectMethod: !!sendbirdContext?.actions?.disconnect,
  //   hasSDK: !!state?.stores?.sdkStore?.sdk,
  //   hasGroupChannel: !!state?.stores?.sdkStore?.sdk?.groupChannel,
  // });

  const utils = useMemo(() => {
    if (state?.stores?.sdkStore?.sdk) {
      return new SendbirdUtils(state);
    }
    return null;
  }, [state]);

  const sdkStatus = utils?.getSDKStatus() || null;

  return {
    sendbird,
    currentUser: authContext.currentUser,
    isConnected,
    connectionState,
    utils,
    isReady,
    sdkStatus,
  };
};
