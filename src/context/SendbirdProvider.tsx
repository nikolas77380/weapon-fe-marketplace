"use client";

import { getSendbirdSessionTokenFromCookie } from "@/lib/auth";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect, useState } from "react";

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
    console.error("SendbirdProvider: NEXT_PUBLIC_SENDBIRD_APP_ID not set");
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <strong>Configuration Error:</strong> NEXT_PUBLIC_SENDBIRD_APP_ID
        environment variable is not set. Please check your .env.local file.
      </div>
    );
  }

  if (currentUserLoading) {
    console.log("SendbirdProvider: still loading user");
    return (
      <div className="p-4 bg-gray-100 border border-gray-400 text-gray-700 rounded">
        <strong>Loading user...</strong> Please wait while we authenticate.
      </div>
    );
  }

  if (!currentUser) {
    console.log(
      "SendbirdProvider: user not authenticated, showing children without Sendbird"
    );
    return <>{children}</>;
  }

  if (!isProviderLoaded) {
    console.log("SendbirdProvider: provider not loaded yet");
    return (
      <div className="p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
        <strong>Loading Sendbird...</strong> Please wait while we initialize the
        chat system.
      </div>
    );
  }

  if (!isInitialized) {
    console.log("SendbirdProvider: not initialized yet");
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
        <strong>Initializing...</strong> Setting up chat system for user.
      </div>
    );
  }

  console.log("SendbirdProvider: rendering with Sendbird", {
    appId,
    userId: currentUser.id,
    hasToken: !!sessionToken,
    isInitialized,
    isProviderLoaded,
    currentUserLoading,
    currentUserExists: !!currentUser,
  });

  if (!appId) {
    console.error("SendbirdProvider: appId is missing");
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <strong>Configuration Error:</strong> App ID is missing
      </div>
    );
  }

  if (!currentUser.id) {
    console.error("SendbirdProvider: currentUser.id is missing");
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <strong>Configuration Error:</strong> User ID is missing
      </div>
    );
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
