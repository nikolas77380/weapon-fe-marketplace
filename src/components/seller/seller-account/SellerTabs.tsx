import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SellerListenedCard from "./SellerListenedCard";
import { useProducts } from "@/hooks/useProducts";
import { MessageSquare, Users } from "lucide-react";
import { Message } from "@/types/message";
import { mockMessages } from "@/mockup/messages";
import Link from "next/link";
import { UserProfile } from "@/lib/types";
import SkeletonComponent from "@/components/ui/SkeletonComponent";

const SellerAccountTabs = ({ currentUser }: { currentUser: UserProfile }) => {
  const { products, loading, refetch } = useProducts({
    seller: currentUser.id,
  });
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const handleProductDeleted = () => {
    refetch();
  };

  const markAsRead = (messageId: number) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === messageId ? { ...message, isRead: true } : message
      )
    );
  };

  return (
    <div className="mt-9">
      <Tabs defaultValue="myInquiries">
        <TabsList className="border border-muted-foreground/20 w-full">
          <TabsTrigger value="myInquiries">My listings</TabsTrigger>
          <TabsTrigger value="savedItems">Analytics</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>
        <TabsContent value="myInquiries">
          <div className="mt-15">
            <h1 className="text-xl font-roboto">My Inquiries</h1>
            <p className="text-sm font-medium text-[#C4C2C2] mt-2">
              Manage your product listings and inventory
            </p>
            <div className="mt-3.5 flex flex-col gap-4 items-center w-full">
              {loading ? (
                <SkeletonComponent type="sellerCard" count={3} className="w-full" />
              ) : (
                products.map((product) => (
                  <SellerListenedCard
                    key={product.id}
                    product={product}
                    onProductDeleted={handleProductDeleted}
                  />
                ))
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="messages">
          <div className="mt-15">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-roboto">Customer messages</h1>
              <Link
                href="/messages"
                className="bg-black py-1.5 px-4 rounded-md flex items-center gap-3 text-white
              hover:bg-black/80 duration-300 transition-all"
              >
                <MessageSquare size={20} />
                <p className="text-xs font-semibold">Open Full Messenger</p>
              </Link>
            </div>
            <p className="text-sm font-medium text-[#C4C2C2] mt-2">
              Manage inquires and customer communications
            </p>
            {/* Message Activities */}
            <div className="flex items-center justify-between gap-16 w-full mt-5">
              {/* Message Activities Cards */}
              <div className="w-full border border-gray-primary rounded-xl py-5 flex items-center px-10">
                <div className="flex justify-center gap-3">
                  <div className="rounded-xl bg-red-100 px-3.5 flex items-center justify-center">
                    <MessageSquare size={22} className="text-red-500" />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-roboto text-xl font-medium">2</p>
                    <p className="font-roboto font-light">Unread Messages</p>
                  </div>
                </div>
              </div>

              <div className="w-full border border-gray-primary rounded-xl py-5 flex items-center px-10">
                <div className="flex justify-center gap-3">
                  <div className="rounded-xl bg-blue-100 px-3.5 flex items-center justify-center">
                    <Users size={22} className="text-blue-500" />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-roboto text-xl font-medium">12</p>
                    <p className="font-roboto font-light">
                      Active conversations
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full border border-gray-primary rounded-xl py-5 flex items-center px-10">
                <div className="flex justify-center gap-3">
                  <div className="rounded-xl bg-red-100 px-3.5 flex items-center justify-center">
                    <MessageSquare size={22} className="text-red-500" />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-roboto text-xl font-medium">2</p>
                    <p className="font-roboto font-light">Unread Messages</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Last Messages */}
            <div className="mt-9 border border-gray-primary rounded-xl p-5 flex flex-col gap-5">
              <h2 className="font-roboto">Recent messages</h2>

              {/* Messages Cards */}
              {messages.slice(0, 3).map((message) => (
                <div
                  key={message.id}
                  className={`border rounded-xl w-full flex gap-5 py-3 px-6 cursor-pointer transition-all duration-200 ${
                    !message.isRead
                      ? "border-black bg-gray-primary hover:bg-gray-200"
                      : "border-gray-primary hover:bg-gray-50"
                  }`}
                  onClick={() => markAsRead(message.id)}
                >
                  <div className="rounded-full bg-[#CED8EE] p-1 size-fit">
                    <Users size={20} />
                  </div>
                  <div className="flex flex-col font-roboto">
                    <div className="flex items-center gap-2">
                      <p>{message.sender}</p>
                      {!message.isRead && (
                        <div className="w-2 h-2 bg-black rounded-full"></div>
                      )}
                    </div>
                    <p className="text-[15px] font-semibold text-[#727070]">
                      {message.product}
                    </p>
                    <p className="text-[15px] font-semibold">
                      {message.content}
                    </p>
                    <p className="text-[15px] font-extrabold text-[#7C7A7A]">
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SellerAccountTabs;
