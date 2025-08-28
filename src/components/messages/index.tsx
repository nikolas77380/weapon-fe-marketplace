"use client";

import React from "react";
import { App as SendbirdApp } from "@sendbird/uikit-react";
import "@sendbird/uikit-react/dist/index.css";
import { getSendbirdSessionTokenFromCookie } from "@/lib/auth";

const Messages = ({ appId, userId }: { appId: string; userId: string }) => {
  return (
    <SendbirdApp
      appId={appId}
      userId={userId}
      accessToken={getSendbirdSessionTokenFromCookie() as string}
    />
  );
};

export default Messages;
