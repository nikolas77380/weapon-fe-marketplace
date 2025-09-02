// app/messages/MessagesClient.tsx
"use client";

import dynamic from "next/dynamic";

const Messages = dynamic(() => import("./index"), {
  ssr: false,
});

export default function MessagesClient() {
  return <Messages />;
}
