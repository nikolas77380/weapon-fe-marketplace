import React from "react";
import Messages from "@/components/messages";

const MessagesPage = () => {
  return (
    <main className="w-full h-screen mb-20 bg-[#E8E8E8]">
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
