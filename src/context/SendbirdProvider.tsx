"use client";

import { getSendbirdSessionTokenFromCookie } from "@/lib/auth";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import LoadingState from "@/components/ui/LoadingState";

let SendbirdProvider: unknown = null;

export function ProviderSendBird({ children }: { children: React.ReactNode }) {
  const { currentUser, currentUserLoading } = useAuthContext();
  const [sessionToken, setSessionToken] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isProviderLoaded, setIsProviderLoaded] = useState(false);

  useEffect(() => {
    const loadSendbirdProvider = async () => {
      try {
        const sendbirdModule = await import(
          "@sendbird/uikit-react/SendbirdProvider"
        );
        SendbirdProvider = sendbirdModule.default;
        setIsProviderLoaded(true);
        console.log("SendbirdProvider: provider loaded successfully");
      } catch (error) {
        console.error("SendbirdProvider: failed to load provider", error);
      }
    };

    loadSendbirdProvider();
  }, []);

  useEffect(() => {
    console.log("SendbirdProvider: currentUser changed", {
      currentUser,
      currentUserLoading,
    });

    if (currentUser && !currentUserLoading) {
      const token = getSendbirdSessionTokenFromCookie();
      console.log("SendbirdProvider: setting session token", {
        token,
        userId: currentUser.id,
        hasToken: !!token,
      });
      setSessionToken(token ?? "");
      setIsInitialized(true);
    } else if (!currentUser && !currentUserLoading) {
      console.log("SendbirdProvider: user not authenticated");
      setIsInitialized(true);
    }
  }, [currentUser, currentUserLoading]);

  const appId = process.env.NEXT_PUBLIC_SENDBIRD_APP_ID;
  if (!appId) {
    return <>{children}</>;
  }

  if (currentUserLoading) {
    console.log("SendbirdProvider: still loading user");
    return <LoadingState title="Loading..." />;
  }

  if (!currentUser) {
    return <>{children}</>;
  }

  if (!isProviderLoaded) {
    return <LoadingState title="Loading..." />;
  }

  if (!isInitialized) {
    return <LoadingState title="Loading..." />;
  }

  if (!appId) {
    console.error("SendbirdProvider: appId is missing");
    return <>{children}</>;
  }

  if (!currentUser.id) {
    console.error("SendbirdProvider: currentUser.id is missing");
    return <>{children}</>;
  }

  const SendbirdProviderComponent = SendbirdProvider as React.ComponentType<{
    appId: string;
    userId: string;
    accessToken: string;
    theme: string;
    config: {
      enableAutoPushTokenRegistration: boolean;
      enableChannelListTypingIndicator: boolean;
      enableChannelListMessageReceiptStatus: boolean;
    };
    children: React.ReactNode;
  }>;

  return (
    <SendbirdProviderComponent
      appId={appId}
      userId={currentUser.id.toString()}
      accessToken={sessionToken}
      theme="light"
      config={{
        enableAutoPushTokenRegistration: true,
        enableChannelListTypingIndicator: true,
        enableChannelListMessageReceiptStatus: true,
      }}
    >
      {children}
    </SendbirdProviderComponent>
  );
}
