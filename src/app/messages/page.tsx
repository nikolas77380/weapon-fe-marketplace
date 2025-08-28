import React from "react";
import { requireAuth } from "@/lib/server-auth";
import Messages from "@/components/messages";
import BreadcrumbComponent from "@/components/ui/BreadcrumbComponent";

const MessagesPage = async () => {
  const currentUser = await requireAuth();
  console.log(currentUser);

  return (
    <main className="w-full h-screen mb-20">
      <BreadcrumbComponent
        currentUser={currentUser}
        className="mt-4 mb-10 ml-10"
      />
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
