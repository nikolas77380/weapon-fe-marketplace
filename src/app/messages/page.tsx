import React from "react";
import { requireAuth } from "@/lib/server-auth";
import Messages from "@/components/messages";
import BreadcrumbComponent from "@/components/ui/BreadcrumbComponent";

const MessagesPage = async () => {
  const currentUser = await requireAuth();
  return (
    <main className="w-full h-screen mb-20 bg-[#E8E8E8]">
      <BreadcrumbComponent
        currentUser={currentUser}
        className="mt-4 mb-10 ml-10"
      />
      <div className="h-full">
        <div className="container mx-auto p-4">
          <div className="h-[600px]">
            <Messages />
          </div>
        </div>
      </div>
    </main>
  );
};

export default MessagesPage;
