import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SellerListenedCard from "./SellerListenedCard";
import { MessageSquare, Users } from "lucide-react";
import { Message } from "@/types/message";
import { mockMessages } from "@/mockup/messages";
import Link from "next/link";
import { Product, UserProfile } from "@/lib/types";
import SkeletonComponent from "@/components/ui/SkeletonComponent";
import SellerAccountHeader from "./SellerAccountHeader";
import { cn, triggerClasses } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface SellerTabsDesktopProps {
  products: Product[];
  loading: boolean;
  refetch: () => void;
  currentUser: UserProfile;
}

const SellerTabsDesktop = ({
  products,
  loading,
  refetch,
  currentUser,
}: SellerTabsDesktopProps) => {
  const t = useTranslations("SellerAccountTabs");
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const markAsRead = (messageId: number) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === messageId ? { ...message, isRead: true } : message
      )
    );
  };

  return (
    <div className="hidden md:block w-full">
      <Tabs
        defaultValue="myInquiries"
        orientation="vertical"
        className="w-full flex-row gap-10"
      >
        <TabsList className="flex-col w-64 h-23 bg-gray-100">
          <TabsTrigger value="myInquiries" className={cn(triggerClasses)}>
            {t("tabMyInquiries.titleTabMyInquiries")}
          </TabsTrigger>
          <TabsTrigger value="messages" className={cn(triggerClasses)}>
            {t("tabMessage.titleMessages")}
          </TabsTrigger>
        </TabsList>
        <div className="grow w-full">
          <SellerAccountHeader
            products={products}
            currentUser={currentUser}
            className="hidden md:block"
          />
          <div className="mt-9 overflow-hidden">
            <TabsContent
              value="myInquiries"
              className="bg-background border border-sidebar-accent px-6 pt-2 pb-4"
            >
              <div className="mt-7.5">
                <h1 className="text-xl font-roboto">
                  {t("tabMyInquiries.titleTabMyInquiries")}
                </h1>
                <p className="text-sm font-medium text-[#C4C2C2] mt-2">
                  {t("tabMyInquiries.descriptionManageProducts")}
                </p>
                <div className="mt-3.5 flex flex-col gap-4 items-center w-full">
                  {loading ? (
                    <SkeletonComponent
                      type="sellerCard"
                      count={3}
                      className="w-full"
                    />
                  ) : (
                    products.map((product) => (
                      <SellerListenedCard key={product.id} product={product} />
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="messages">
              <div className="mt-7.5">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-roboto">
                    {t("tabMessage.titleCustomerMessages")}
                  </h1>
                  <Link
                    href="/messages"
                    className="bg-black py-1.5 px-4 rounded-md flex items-center gap-3 text-white hover:bg-black/80 duration-300 transition-all"
                  >
                    <MessageSquare size={20} />
                    <p className="text-xs font-semibold">
                      {t("tabMessage.titleOpenFullMessenger")}
                    </p>
                  </Link>
                </div>
                <p className="text-sm font-medium text-[#C4C2C2] mt-2">
                  {t("tabMessage.descriptionCustomerMessages")}
                </p>
                <div className="flex items-center justify-between gap-16 w-full mt-5">
                  <div className="w/full border border-gray-primary rounded-xl py-5 flex items-center px-10">
                    <div className="flex justify-center gap-3">
                      <div className="rounded-xl bg-red-100 px-3.5 flex items-center justify-center">
                        <MessageSquare size={22} className="text-red-500" />
                      </div>
                      <div className="flex flex-col">
                        <p className="font-roboto text-xl font-medium">2</p>
                        <p className="font-roboto font-light">
                          Unread Messages
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w/full border border-gray-primary rounded-xl py-5 flex items-center px-10">
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
                  <div className="w/full border border-gray-primary rounded-xl py-5 flex items-center px-10">
                    <div className="flex justify-center gap-3">
                      <div className="rounded-xl bg-red-100 px-3.5 flex items-center justify-center">
                        <MessageSquare size={22} className="text-red-500" />
                      </div>
                      <div className="flex flex-col">
                        <p className="font-roboto text-xl font-medium">2</p>
                        <p className="font-roboto font-light">
                          Unread Messages
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-9 border border-gray-primary rounded-xl p-5 flex flex-col gap-5">
                  <h2 className="font-roboto">Recent messages</h2>
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
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default SellerTabsDesktop;
