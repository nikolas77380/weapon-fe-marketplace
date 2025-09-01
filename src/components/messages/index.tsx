"use client";

import React from "react";
import { App as SendbirdApp } from "@sendbird/uikit-react";
import "@sendbird/uikit-react/dist/index.css";
import { getSendbirdSessionTokenFromCookie } from "@/lib/auth";

interface MessagesProps {
  appId: string;
  userId: string;
}

const Messages = ({ appId, userId }: MessagesProps) => {
  return (
    <SendbirdApp
      appId={appId}
      userId={userId}
      accessToken={getSendbirdSessionTokenFromCookie() as string}
    />
  );
};

export default Messages;
