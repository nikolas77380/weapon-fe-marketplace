import React from "react";
import { requireAuth } from "@/lib/server-auth";
import Messages from "@/components/messages";

const MessagesPage = async () => {
  const currentUser = await requireAuth();
  console.log(currentUser);

  return (
    <main className="w-full h-screen">
      <div className="h-full">
        <Messages
          appId={process.env.NEXT_PUBLIC_SENDBIRD_APP_ID!}
          userId={String(currentUser.id)}
        />
      </div>
    </main>
  );
};

export default MessagesPage;
